import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { eq, and, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { clients } from '@shared/database/schema';
import { ClientLoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/register.dto';
import { ClientJwtPayload } from '@shared/types';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private clientResponse(client: any) {
    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      telegramId: client.telegramId,
      avatarUrl: client.avatarUrl,
    };
  }

  async downloadAvatar(photoUrl: string, clientId: string): Promise<string | null> {
    if (!photoUrl) return null;

    const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${clientId}-${Date.now()}.jpg`;
    const filePath = path.join(uploadsDir, fileName);
    const avatarUrl = `/uploads/avatars/${fileName}`;

    return new Promise((resolve) => {
      const protocol = photoUrl.startsWith('https') ? https : http;
      protocol.get(photoUrl, (response) => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(filePath);
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(avatarUrl);
          });
        } else {
          resolve(null);
        }
      }).on('error', () => resolve(null));
    });
  }

  async register(dto: ClientRegisterDto) {
    const [existing] = await this.db
      .select()
      .from(clients)
      .where(eq(clients.telegramId, dto.telegramId))
      .limit(1);

    if (existing) {
      throw new ConflictException('Bu telegramId bilan client allaqachon mavjud');
    }

    // Avatar download
    let avatarUrl: string | null = null;
    if (dto.photoUrl) {
      avatarUrl = await this.downloadAvatar(dto.photoUrl, dto.telegramId);
    }

    const [client] = await this.db
      .insert(clients)
      .values({
        telegramId: dto.telegramId,
        firstName: dto.firstName,
        lastName: dto.lastName || null,
        phone: dto.phone || null,
        avatarUrl,
      })
      .returning();

    const payload: ClientJwtPayload = {
      sub: client.id,
      telegramId: client.telegramId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      client: this.clientResponse(client),
    };
  }

  async check(dto: ClientLoginDto) {
    const [client] = await this.db
      .select()
      .from(clients)
      .where(and(eq(clients.telegramId, dto.telegramId), isNull(clients.deletedAt)))
      .limit(1);

    if (!client) {
      return { registered: false };
    }

    if (client.blockedAt) {
      throw new ForbiddenException('Client is blocked');
    }

    const payload: ClientJwtPayload = {
      sub: client.id,
      telegramId: client.telegramId,
    };

    return {
      registered: true,
      accessToken: this.jwtService.sign(payload),
      client: this.clientResponse(client),
    };
  }

  async login(dto: ClientLoginDto) {
    const [client] = await this.db
      .select()
      .from(clients)
      .where(and(eq(clients.telegramId, dto.telegramId), isNull(clients.deletedAt)))
      .limit(1);

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.blockedAt) {
      throw new ForbiddenException('Client is blocked');
    }

    const payload: ClientJwtPayload = {
      sub: client.id,
      telegramId: client.telegramId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      client: this.clientResponse(client),
    };
  }

  async getProfile(clientId: string) {
    const [client] = await this.db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (!client) throw new NotFoundException('Client topilmadi');
    return this.clientResponse(client);
  }

  async refreshAvatar(clientId: string, photoUrl?: string) {
    // 1. Agar photoUrl berilsa — to'g'ridan-to'g'ri yuklash
    if (photoUrl) {
      const avatarUrl = await this.downloadAvatar(photoUrl, clientId);
      if (avatarUrl) {
        await this.db.update(clients).set({ avatarUrl }).where(eq(clients.id, clientId));
        return { avatarUrl };
      }
    }

    // 2. Telegram Bot API orqali avatar olish
    const [client] = await this.db.select().from(clients).where(eq(clients.id, clientId)).limit(1);
    if (!client) throw new NotFoundException('Client topilmadi');

    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.logger.log(`Bot token: ${botToken ? 'SET' : 'NOT SET'}, telegramId: ${client.telegramId}`);
    if (!botToken) return { avatarUrl: null };

    try {
      // getUserProfilePhotos
      const photosUrl = `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${client.telegramId}&limit=1`;
      const photosRes = await this.httpGet(photosUrl);
      const photosData = JSON.parse(photosRes);

      if (!photosData.ok || !photosData.result?.photos?.length) {
        return { avatarUrl: null };
      }

      // Eng katta rasmni olish
      const photo = photosData.result.photos[0];
      const bigPhoto = photo[photo.length - 1];

      // getFile
      const fileUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${bigPhoto.file_id}`;
      const fileRes = await this.httpGet(fileUrl);
      const fileData = JSON.parse(fileRes);

      if (!fileData.ok || !fileData.result?.file_path) {
        return { avatarUrl: null };
      }

      // Download
      const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
      const avatarUrl = await this.downloadAvatar(downloadUrl, clientId);

      if (avatarUrl) {
        await this.db.update(clients).set({ avatarUrl }).where(eq(clients.id, clientId));
        return { avatarUrl };
      }

      return { avatarUrl: null };
    } catch {
      return { avatarUrl: null };
    }
  }

  private httpGet(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      protocol.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }
}

import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq, and, isNull } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { clients } from '@shared/database/schema';
import { ClientLoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/register.dto';
import { ClientJwtPayload } from '@shared/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private jwtService: JwtService,
  ) {}

  async register(dto: ClientRegisterDto) {
    // Tekshirish: telegramId bilan client bormi
    const [existing] = await this.db
      .select()
      .from(clients)
      .where(eq(clients.telegramId, dto.telegramId))
      .limit(1);

    if (existing) {
      throw new ConflictException('Bu telegramId bilan client allaqachon mavjud');
    }

    const [client] = await this.db
      .insert(clients)
      .values({
        telegramId: dto.telegramId,
        firstName: dto.firstName,
        lastName: dto.lastName || null,
        phone: dto.phone || null,
      })
      .returning();

    const payload: ClientJwtPayload = {
      sub: client.id,
      telegramId: client.telegramId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      client: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        telegramId: client.telegramId,
      },
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
      client: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        telegramId: client.telegramId,
      },
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
      client: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        telegramId: client.telegramId,
      },
    };
  }
}

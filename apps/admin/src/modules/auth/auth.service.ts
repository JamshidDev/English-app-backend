import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq, isNull, and } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@shared/database/drizzle.helper';
import { admins } from '@shared/database/schema';
import { CreateAdminDto, LoginDto } from './dto/login.dto';
import { AdminRole, JwtPayload } from '@shared/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const [admin] = await this.db
      .select()
      .from(admins)
      .where(and(eq(admins.username, dto.username), isNull(admins.deletedAt)))
      .limit(1);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: admin.id,
      username: admin.username,
      role: admin.role as AdminRole,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName,
      },
    };
  }

  async createAdmin(dto: CreateAdminDto) {
    const existing = await this.db
      .select({ id: admins.id })
      .from(admins)
      .where(eq(admins.username, dto.username))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Username already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const [admin] = await this.db
      .insert(admins)
      .values({
        username: dto.username,
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        role: 'admin',
      })
      .returning({
        id: admins.id,
        username: admins.username,
        email: admins.email,
        role: admins.role,
        fullName: admins.fullName,
      });

    return admin;
  }

  async seedSuperAdmin() {
    const existing = await this.db
      .select({ id: admins.id })
      .from(admins)
      .where(eq(admins.role, 'super_admin'))
      .limit(1);

    if (existing.length > 0) {
      return { message: 'Super admin already exists' };
    }

    const passwordHash = await bcrypt.hash('admin123', 12);

    const [admin] = await this.db
      .insert(admins)
      .values({
        username: 'superadmin',
        email: 'superadmin@easyenglish.com',
        passwordHash,
        fullName: 'Super Admin',
        role: 'super_admin',
      })
      .returning({
        id: admins.id,
        username: admins.username,
        email: admins.email,
        role: admins.role,
      });

    return { message: 'Super admin created', admin };
  }
}

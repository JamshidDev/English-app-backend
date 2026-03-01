import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAdminDto, LoginDto } from './dto/login.dto';
import { LoginApiResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '@shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/auth/guards/roles.guard';
import { Roles } from '@shared/auth/decorators/roles.decorator';
import { AdminRole } from '@shared/types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiOkResponse({ type: LoginApiResponseDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new admin (super_admin only)' })
  @ApiCreatedResponse({ description: 'Admin created' })
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.authService.createAdmin(dto);
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Seed super admin (first-time setup)' })
  @ApiOkResponse({ description: 'Super admin seeded' })
  async seed() {
    return this.authService.seedSuperAdmin();
  }
}

import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClientLoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/register.dto';
import { ClientLoginApiResponseDto, ClientCheckApiResponseDto } from './dto/auth-response.dto';
import { ClientJwtAuthGuard } from './guards/client-jwt-auth.guard';
import { GetCurrentClient } from './decorators/current-client.decorator';
import { CurrentClient } from '@shared/types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "TelegramId bo'yicha ro'yxatdan o'tganligini tekshirish" })
  @ApiOkResponse({ type: ClientCheckApiResponseDto })
  async check(@Body() dto: ClientLoginDto) {
    return this.authService.check(dto);
  }

  @Post('register')
  @ApiOperation({ summary: "Yangi client ro'yxatdan o'tkazish" })
  @ApiCreatedResponse({ type: ClientLoginApiResponseDto })
  async register(@Body() dto: ClientRegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Client login with telegramId' })
  @ApiOkResponse({ type: ClientLoginApiResponseDto })
  async login(@Body() dto: ClientLoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(ClientJwtAuthGuard)
  @ApiOperation({ summary: 'Profil ma\'lumotlari' })
  async getProfile(@GetCurrentClient() client: CurrentClient) {
    return this.authService.getProfile(client.id);
  }

  @Post('refresh-avatar')
  @ApiBearerAuth()
  @UseGuards(ClientJwtAuthGuard)
  @ApiOperation({ summary: 'Telegram avatarni qayta yuklash' })
  async refreshAvatar(
    @GetCurrentClient() client: CurrentClient,
    @Body() body: { photoUrl?: string },
  ) {
    return this.authService.refreshAvatar(client.id, body.photoUrl);
  }
}

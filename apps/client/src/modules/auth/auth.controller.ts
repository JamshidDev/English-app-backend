import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClientLoginDto } from './dto/login.dto';
import { ClientRegisterDto } from './dto/register.dto';
import { ClientLoginApiResponseDto, ClientCheckApiResponseDto } from './dto/auth-response.dto';

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
}

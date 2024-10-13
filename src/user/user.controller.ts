import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { EmailPipe } from './emailPipe';
import { LoginDto } from './dtos/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('init')
  async initUser() {
    return await this.userService.initUser();
  }
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.registerUser(registerDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }
  @Get('captcha')
  async getCaptcha(@Query('email', EmailPipe) email: string) {
    return await this.userService.getCaptcha(email);
  }
  @Get('detail/:id')
  async getUserDetail(@Param('id') id: string) {
    return await this.userService.getUserDetail(id);
  }
  @Get('refresh')
  async refreshToken(@Query('token') token: string) {
    return await this.userService.refreshToken(token);
  }
}

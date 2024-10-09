import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { EmailPipe } from './emailPipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.userService.registerUser(registerDto);
  }
  @Post('login')
  async login(@Body() loginDto) {}
  @Get('captcha')
  async getCaptcha(@Query('email', EmailPipe) email: string) {
    return await this.userService.getCaptcha(email);
  }
}

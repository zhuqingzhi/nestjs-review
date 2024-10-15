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
import { RequireLogin } from 'src/customDecorators/login.decorator';
import { UserDetailVo } from './vos/userDetail.vo';
import { userInfoDecorator } from 'src/customDecorators/userinfo.decorator';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserListDto } from './dtos/userList.dto';

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
  @RequireLogin()
  @Get('detail/:id')
  async getUserDetail(@Param('id') id: string) {
    const userInfo = await this.userService.getUserDetail(id);
    const userVo = new UserDetailVo();
    userVo.id = userInfo.id;
    userVo.avatar = userInfo.avatar;
    userVo.email = userInfo.email;
    userVo.isAdmin = userInfo.isAdmin;
    userVo.isFrosen = userInfo.isFrosen;
    userVo.nickname = userInfo.nickname;
    userVo.phoneNumber = userInfo.phoneNumber;
    return userVo;
  }
  @Get('refresh')
  async refreshToken(@Query('token') token: string) {
    return await this.userService.refreshToken(token);
  }
  @RequireLogin()
  @Post(['update', 'admin/update'])
  async updateUserInfo(
    @userInfoDecorator('id') userId: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUser);
  }
  @RequireLogin()
  @Post('list')
  async getUserList(@Body() queryParams: UserListDto) {
    return this.userService.getUserList(queryParams);
  }
  @RequireLogin()
  @Get('frosen')
  async frosenUser(@Query('id') id: string) {
    return await this.userService.frosenUser(id);
  }
}

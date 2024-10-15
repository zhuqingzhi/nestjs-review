import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    title: '用户名',
    type: String,
    example: '张三',
  })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({
    title: '昵称',
    type: String,
  })
  @IsString()
  username: string;
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  @IsString()
  nickname: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码最少6位',
  })
  @IsString()
  password: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  captcha: string;
}

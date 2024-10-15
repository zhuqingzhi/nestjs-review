import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsGreaterThan } from 'src/class-validators/greater-than.validator';

export class UserListDto {
  @IsNotEmpty({
    message: '分页不能为空',
  })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    { message: '页码应该为数字' },
  )
  @IsGreaterThan(1, {
    message: '分页需要大于1',
  })
  pageNo: number;

  @IsNotEmpty({
    message: '页大小不能为空',
  })
  @IsNumber({}, { message: '页大小应该为数字' })
  pageSize: number;

  @IsString({
    message: '用户名应该为字符串',
  })
  @IsOptional()
  username: string;

  @IsString({
    message: '昵称应该为字符串',
  })
  @IsOptional()
  nickname: string;

  @IsEmail({}, { message: '邮箱应该为正确格式' })
  @IsOptional()
  email: string;
}

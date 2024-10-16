import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({
    message: '名字不能为空',
  })
  @MaxLength(15, {
    message: '不超过15个字符',
  })
  name: string;

  @IsNotEmpty({
    message: '会议室位置不能为空',
  })
  @MaxLength(30, {
    message: '会议室位置不能超过30个字符',
  })
  location: string;

  @IsString({
    message: '设备应为字符串',
  })
  equipment: string;

  @IsString({
    message: '描述应该为字符串',
  })
  @IsOptional()
  description: string;

  @IsBoolean({
    message: '预定状态应该为布尔值',
  })
  @IsOptional()
  isBooked: boolean;
}

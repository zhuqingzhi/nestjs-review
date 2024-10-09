import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}
export class EmailPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) throw new BadRequestException('邮箱不能为空');
    if (!validateEmail(value)) throw new BadRequestException('邮箱格式错误');
    return value;
  }
}

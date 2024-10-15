import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const msg = Array.isArray(exception.response?.message)
      ? exception.response?.message.join(',')
      : exception.message;
    return response.json({
      code: exception.status,
      message: msg,
      data: null,
    });
  }
}

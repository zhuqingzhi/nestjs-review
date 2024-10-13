import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RequireLogin } from 'src/customDecorators/login.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get('/list')
  @RequireLogin()
  getRoomList() {
    return [];
  }
}

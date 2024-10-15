import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RequireLogin } from 'src/customDecorators/login.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('rooms')
@ApiTags('会议室列表')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Get('/list')
  @RequireLogin()
  getRoomList() {
    return [];
  }
}

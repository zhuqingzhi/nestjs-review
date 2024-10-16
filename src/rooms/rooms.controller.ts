import { Body, Controller, Post, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RequireLogin } from 'src/customDecorators/login.decorator';
import { CreateRoomDto } from './dtos/create_room.dto';

@Controller('meeting_rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Post('add')
  async createNewMeetingRoom(@Body() createMeetingRoom: CreateRoomDto) {
    return await this.roomsService.createRoom(createMeetingRoom);
  }
}

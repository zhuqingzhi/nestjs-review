import { Module } from '@nestjs/common';
import { PermissonsService } from './permissons.service';
import { PermissonsController } from './permissons.controller';

@Module({
  controllers: [PermissonsController],
  providers: [PermissonsService],
})
export class PermissonsModule {}

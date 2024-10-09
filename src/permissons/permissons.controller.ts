import { Controller } from '@nestjs/common';
import { PermissonsService } from './permissons.service';

@Controller('permissons')
export class PermissonsController {
  constructor(private readonly permissonsService: PermissonsService) {}
}

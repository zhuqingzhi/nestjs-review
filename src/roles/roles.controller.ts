import { Body, Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RequireLogin } from 'src/customDecorators/login.decorator';
import { RequirePermission } from 'src/customDecorators/permission.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Get('/list')
  @RequireLogin()
  @RequirePermission('delete')
  async getRoleList(@Body() body: any) {
    return this.rolesService.getRoleList(body);
  }
}

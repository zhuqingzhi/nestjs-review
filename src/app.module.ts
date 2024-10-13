import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingModule } from './booking/booking.module';
import { StatisticModule } from './statistic/statistic.module';
import { RolesModule } from './roles/roles.module';
import { PermissonsModule } from './permissons/permissons.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guards/login.guard';
import { PermissionGuard } from './guards/permission.guard';
import * as path from 'path';
import { User } from './user/entities/user.entity';
import { Permission } from './permissons/entities/permission.entity';
import { Role } from './roles/entities/role.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./config/.env.development'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          host: configService.get('MYSQL_HOST'),
          port: configService.get('MYSQL_PORT'),
          username: configService.get('MYSQL_USERNAME'),
          password: configService.get('MYSQL_PASSWORD'),
          connectorPackage: 'mysql2',
          database: 'meeting',
          synchronize: true,
          entities: [User, Permission, Role],
          type: 'mysql',
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RoomsModule,
    BookingModule,
    StatisticModule,
    RolesModule,
    PermissonsModule,
    RedisModule,
    EmailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}

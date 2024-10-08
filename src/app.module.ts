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
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          type: 'mysql',
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RoomsModule,
    BookingModule,
    StatisticModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

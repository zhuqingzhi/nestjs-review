import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(RedisService)
  private readonly redisService: RedisService;
  sign(payload: Record<string, any>, expires: number) {
    return this.jwtService.sign(payload, {
      expiresIn: expires,
    });
  }
  verify(token: string) {
    try {
      const res = this.jwtService.verify(token);
      return res;
    } catch (e) {
      switch (e.name) {
        case 'TokenExpiredError': {
          throw new UnauthorizedException('token过期');
        }
        case 'JsonWebTokenError': {
          throw new UnauthorizedException('token错误');
        }
        default:
          throw new UnauthorizedException();
      }
    }
  }
  async expire(key: string) {
    await this.redisService.expire(key);
    return true;
  }
}

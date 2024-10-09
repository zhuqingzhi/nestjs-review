import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { md5 } from 'src/utils';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(EmailService)
  private readonly emailService: EmailService;
  async registerUser(registerDto: RegisterDto) {
    const captcha = await this.redisService.get('captcha_' + registerDto.email);
    if (!captcha)
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    if (captcha !== registerDto.captcha)
      throw new BadRequestException('验证码错误');
    const user = new User();
    user.email = registerDto.email;
    user.username = registerDto.username;
    user.password = md5(registerDto.password);
    user.nickname = registerDto.nickname;
    await this.userRepository.save(user);
    return '成功';
  }
  async getCaptcha(email: string) {
    const random = this.getRandom();
    // 存储到redis
    const key = 'captcha_' + email;
    let captcha = await this.redisService.get(key);
    if (!captcha) {
      captcha = random;
      // 发送验证码
      await this.emailService.sendEmail(email, captcha);
      this.redisService.set(key, random, 5 * 60 * 1000);
      return captcha;
    }

    return '验证码已存在';
  }
  getRandom() {
    return parseInt(Math.random() * Math.pow(10, 6) + '') + '';
  }
}

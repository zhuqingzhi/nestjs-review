import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { md5 } from 'src/utils';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { RequireLogin } from 'src/customDecorators/login.decorator';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { Permission } from 'src/permissons/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>;
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;
  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(EmailService)
  private readonly emailService: EmailService;
  @Inject(AuthService)
  private readonly authService: AuthService;
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
      this.redisService.set(key, random, 60);
      return null;
    }

    return '验证码已存在';
  }
  getRandom() {
    return parseInt(Math.random() * Math.pow(10, 6) + '') + '';
  }

  async getUserDetailById(id: string) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async login(loginDto: LoginDto) {
    // 判断是否存在用户
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username=:name', { name: loginDto.username })
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .getOne();

    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    // 判断密码是否正确
    if (md5(loginDto.password) !== user.password) {
      throw new BadRequestException('密码错误');
    }
    // 返回access_token和refresh_token
    const permissions = new Set();
    user.roles.forEach((item) => {
      item.permissions.forEach((permissionItem) => {
        permissions.add(permissionItem.code);
      });
    });
    const payload = {
      id: user.id,
      username: user.username,
      roles: user.roles,
      permissions: Array.from(permissions),
    };
    const access_token = this.authService.sign(payload, 60);
    const refresh_token = this.authService.sign(
      {
        id: user.id,
      },
      300,
    );
    return {
      access_token,
      refresh_token,
    };
  }
  async initUser() {
    const permission = new Permission();
    permission.code = 'query';
    permission.desc = '查询';
    const permission2 = new Permission();
    permission2.code = 'add';
    permission2.desc = '新增';
    const role = new Role();
    role.name = '角色1';
    role.permissions = [permission, permission2];
    const user = new User();
    user.username = 'zs';
    user.password = md5('123455');
    user.email = 'abc.qq.com';
    user.nickname = 'zs';
    user.roles = [role];
    await this.permissionRepository.save([permission, permission2]);
    await this.roleRepository.save([role]);
    await this.userRepository.save([user]);
    return true;
  }
  async getUserDetail(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id=:id', { id })
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .getOne();

    return user;
  }
  async refreshToken(token: string) {
    const user = this.authService.verify(token);
    if (!user) {
      throw new UnauthorizedException('token已过期');
    }
    const findUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (!findUser) {
      throw new UnauthorizedException('token错误');
    }
    const permissions = new Set();
    findUser.roles.forEach((item) => {
      item.permissions.forEach((permissionItem) => {
        permissions.add(permissionItem.code);
      });
    });
    const payload = {
      id: findUser.id,
      username: findUser.username,
      roles: findUser.roles,
      permissions: Array.from(permissions),
    };
    const access_token = this.authService.sign(payload, 20);
    const refresh_token = this.authService.sign(
      {
        id: findUser.id,
      },
      200,
    );
    return {
      access_token,
      refresh_token,
    };
  }

  async updateUser(userId: string, userDto: UpdateUserDto) {
    const key = 'captcha_' + userDto.email;
    const captcha = await this.redisService.get(key);
    if (!captcha)
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    if (captcha !== userDto.captcha)
      throw new BadRequestException('验证码错误');
    await this.userRepository.save({
      id: userId,
      password: md5(userDto.password),
      email: userDto.email,
    });
    // expire token
    this.authService.expire(key);
    return 'success';
  }
}

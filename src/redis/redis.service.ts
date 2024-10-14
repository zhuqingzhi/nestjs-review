import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('redisClient')
  private readonly redisClient: RedisClientType;
  set(key: string, value: string, ttl?: number) {
    this.redisClient.set(key, value);
    if (ttl) {
      this.redisClient.expire(key, ttl);
    }
  }
  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }
  async expire(key: string) {
    await this.redisClient.expire(key, -1);
  }
}

import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { REDIS_URL } from './constants';

export const redisPubSub = new RedisPubSub({
  publisher: new Redis(REDIS_URL),
  subscriber: new Redis(REDIS_URL),
});

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { REDIS_URL } from './constants';
export const redisPubSub = new RedisPubSub({
  connection: REDIS_URL,
});

import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { MONGODB_URL } from './common/helpers/constants';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './common/guards';

@Module({
  imports: [
    MoviesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    MongooseModule.forRoot(MONGODB_URL),
    PaymentsModule,
    WebhooksModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
  ],
})
export class AppModule {}

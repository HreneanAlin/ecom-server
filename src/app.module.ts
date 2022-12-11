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
import { ValidationError } from 'class-validator';

@Module({
  imports: [
    MoviesModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        subscriptions: {
          'graphql-ws': {
            onConnect: () => {
              console.log('graphql-ws');
            },
            context: ({ connectionParams }) => {
              const authorization =
                connectionParams.Authorization ||
                connectionParams.authorization ||
                '';
              return {
                req: {
                  headers: { ...connectionParams, authorization },
                },
              };
            },
          },
          'subscriptions-transport-ws': {
            onConnect: (connectionParams) => {
              console.log('subscriptions-transport-ws');
              const authorization =
                connectionParams.Authorization ||
                connectionParams.authorization ||
                '';
              return {
                req: {
                  headers: { ...connectionParams, authorization },
                },
              };
            },
          },
        },
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        formatError: (error) => {
          if (error.extensions.code === 'BAD_USER_INPUT') {
            const customError = error.extensions.response as {
              message: ValidationError[];
            };
            if (Array.isArray(customError.message)) {
              return {
                validationErrors: customError.message.map((mess) => {
                  return {
                    property: mess.property,
                    constraints: Object.values(mess.constraints).join(', '),
                  };
                }),
                message: error.message,
                statusCode: 400,
              };
            }
          }
          return error;
        },
      }),
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

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/env.config';
import { envValidationSchema } from './config/env.validation';
import { ExchangeModule } from './exchange/exchange.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('database.mongodbUri');

        if (!uri) {
          throw new Error('database.mongodbUri not found');
        }

        return {
          uri,
        };
      },
    }),

    ExchangeModule,

    ExchangeRateModule,
  ],
})
export class AppModule {}

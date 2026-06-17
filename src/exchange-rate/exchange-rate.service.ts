import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeRateService {
  getCurrentRate(): number {
    return 3.75;
  }
}

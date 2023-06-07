import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { TradeDetailsController } from './controllers/trade-details.controller';
import { TradeDetails } from './entities/trade-details.entity';
import { TradeDetailsService } from './services/trade-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([TradeDetails])],
  controllers: [TradeDetailsController],
  providers: [TradeDetailsService, JwtStrategy],
  exports: [TradeDetailsService],
})
export class TradeDetailsModule {}

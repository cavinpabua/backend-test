import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { SurvivorsController } from './controllers/survivors.controller';
import { Survivor } from './entities/survivor.entity';
import { SurvivorsService } from './services/survivors.service';
import { LocationsService } from '../locations/services/locations.service';
import { Location } from '../locations/entities/location.entity';
import { TradeRequest } from '../trade-requests/entities/trade-requests.entity';
import { TradeRequestService } from '../trade-requests/services/trade-requests.service';
import { Inventory } from '../inventory/entities/inventory.entity';
import { InventoryService } from '../inventory/services/inventory.service';
import { TradeDetails } from '../trade-details/entities/trade-details.entity';
import { TradeDetailsService } from '../trade-details/services/trade-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survivor,
      Location,
      TradeRequest,
      Inventory,
      TradeDetails,
    ]),
  ],
  controllers: [SurvivorsController],
  providers: [
    SurvivorsService,
    JwtStrategy,
    LocationsService,
    TradeRequestService,
    InventoryService,
    TradeDetailsService,
  ],
  exports: [SurvivorsService],
})
export class SurvivorsModule {}

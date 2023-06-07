import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { TradeRequestsController } from './controllers/trade-requests.controller';
import { TradeRequest } from './entities/trade-requests.entity';
import { TradeRequestService } from './services/trade-requests.service';
import { Survivor } from '../survivors/entities/survivor.entity';
import { SurvivorsService } from '../survivors/services/survivors.service';
import { LocationsService } from '../locations/services/locations.service';
import { Location } from '../locations/entities/location.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { InventoryService } from '../inventory/services/inventory.service';
import { TradeDetails } from '../trade-details/entities/trade-details.entity';
import { TradeDetailsService } from '../trade-details/services/trade-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradeRequest,
      Survivor,
      Location,
      Inventory,
      TradeDetails,
    ]),
  ],
  controllers: [TradeRequestsController],
  providers: [
    TradeRequestService,
    JwtStrategy,
    SurvivorsService,
    LocationsService,
    InventoryService,
    TradeDetailsService,
  ],
  exports: [TradeRequestService],
})
export class TradeRequestsModule {}

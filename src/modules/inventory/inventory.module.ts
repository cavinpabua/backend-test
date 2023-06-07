import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { InventoryController } from './controllers/inventory.controller';
import { Inventory } from './entities/inventory.entity';
import { InventoryService } from './services/inventory.service';
import { TradeRequest } from '../trade-requests/entities/trade-requests.entity';
import { TradeRequestService } from '../trade-requests/services/trade-requests.service';
import { Survivor } from '../survivors/entities/survivor.entity';
import { SurvivorsService } from '../survivors/services/survivors.service';
import { LocationsService } from '../locations/services/locations.service';
import { Location } from '../locations/entities/location.entity';
import { TradeDetails } from '../trade-details/entities/trade-details.entity';
import { TradeDetailsService } from '../trade-details/services/trade-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      TradeRequest,
      Survivor,
      Location,
      TradeDetails,
    ]),
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    JwtStrategy,
    TradeRequestService,
    SurvivorsService,
    LocationsService,
    TradeDetailsService,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}

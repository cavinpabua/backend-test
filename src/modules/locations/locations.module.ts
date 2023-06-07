import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { LocationsController } from './controllers/locations.controller';
import { Location } from './entities/location.entity';
import { LocationsService } from './services/locations.service';
import { Survivor } from '../survivors/entities/survivor.entity';
import { SurvivorsService } from '../survivors/services/survivors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location, Survivor])],
  controllers: [LocationsController],
  providers: [LocationsService, JwtStrategy, SurvivorsService],
  exports: [LocationsService],
})
export class LocationsModule {}

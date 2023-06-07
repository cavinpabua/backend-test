import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { ItemsController } from './controllers/items.controller';
import { Item } from './entities/items.entity';
import { ItemsService } from './services/items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [ItemsService, JwtStrategy],
  exports: [ItemsService],
})
export class ItemsModule {}

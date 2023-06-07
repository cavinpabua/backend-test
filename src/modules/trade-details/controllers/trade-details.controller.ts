import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { TradeDetailsService } from '../services/trade-details.service';
import {
  AddTradeDetailsDto,
  DefaultTradeDetailsResponse,
} from '../dto/trade-details.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/models/roles.model';

@ApiTags('trade-details')
@Controller('trade-details')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TradeDetailsController {
  constructor(private readonly itemsService: TradeDetailsService) {}

  /*
   * Add Item
   * @param addTradeDetailsDto
   */
  @ApiOperation({ summary: 'Add Item' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeDetailsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Post()
  add(@Body() addTradeDetailsDto: AddTradeDetailsDto) {
    return this.itemsService.add(addTradeDetailsDto);
  }

  /*
   * Remove Item
   * @param id
   */
  @ApiOperation({ summary: 'Remove Item' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeDetailsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.itemsService.remove(+id);
  }

  /*
   * Get all details from trade
   * @param id
   */
  @ApiOperation({ summary: 'Get all details from trade' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeDetailsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Get(':id')
  findAllDetails(@Param('id') id: number) {
    return this.itemsService.findAllDetails(+id);
  }
}

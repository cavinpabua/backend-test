import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { TradeRequestService } from '../services/trade-requests.service';
import {
  AcceptTradeRequestDto,
  CreateTradeRequestDto,
  DefaultTradeRequestsResponse,
  RejectTradeRequestDto,
} from '../dto/trade-requests.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/models/roles.model';
import { AuthSurvivor } from '../../../modules/survivors/decorators/survivor.decorator';
import { AuthSurvivorType } from '../../../modules/survivors/models/auth-survivor.model';

@ApiTags('trade-requests')
@Controller('trade-requests')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TradeRequestsController {
  constructor(private readonly tradesService: TradeRequestService) {}

  @ApiOperation({ summary: 'Create new trade request' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeRequestsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Post()
  create(@Body() createTradeRequestDto: CreateTradeRequestDto) {
    return this.tradesService.create(createTradeRequestDto);
  }

  @ApiOperation({ summary: 'Accept trade request' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeRequestsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Post('/accept')
  accept(
    @AuthSurvivor() survivor: AuthSurvivorType,
    @Body() acceptTradeRequestDto: AcceptTradeRequestDto,
  ) {
    return this.tradesService.accept(survivor.id, acceptTradeRequestDto);
  }

  @ApiOperation({ summary: 'Reject trade request' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeRequestsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Post('/reject')
  reject(
    @AuthSurvivor() survivor: AuthSurvivorType,
    @Body() rejectTradeRequestDto: RejectTradeRequestDto,
  ) {
    return this.tradesService.reject(survivor.id, rejectTradeRequestDto);
  }

  @ApiOperation({ summary: 'Get Trade History of User' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeRequestsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Get('/history')
  findTradeHistory(@AuthSurvivor() survivor: AuthSurvivorType) {
    return this.tradesService.findTradeHistory(survivor.id);
  }

  @ApiOperation({ summary: 'Get Trade Details' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeRequestsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Get(':id')
  findOne(
    @AuthSurvivor() survivor: AuthSurvivorType,
    @Param('id') requestId: number,
  ) {
    return this.tradesService.findOne(survivor.id, requestId);
  }

  @ApiOperation({ summary: 'Get Trades of User' })
  @ApiResponse({
    status: 201,
    type: DefaultTradeRequestsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Get()
  findOpenTrades(@AuthSurvivor() survivor: AuthSurvivorType) {
    return this.tradesService.findOpenTradeRequests(survivor.id);
  }
}

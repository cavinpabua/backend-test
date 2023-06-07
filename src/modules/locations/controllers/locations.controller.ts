import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { LocationsService } from '../services/locations.service';
import {
  CreateLocationDto,
  DefaultLocationsResponse,
} from '../dto/location.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/models/roles.model';

@ApiTags('locations')
@Controller('locations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /*
   * Add new location of a survivor
   * @param createLocationDto
   */
  @ApiOperation({ summary: 'Add new location of a survivor' })
  @ApiResponse({
    status: 201,
    type: DefaultLocationsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  /*
   * Find location of all survivors
   */
  @ApiOperation({ summary: 'Find location of all survivors' })
  @ApiResponse({
    status: 201,
    type: DefaultLocationsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Get()
  findAll() {
    return this.locationsService.findAllLatestLocation();
  }

  /*
   * Fetch location history of a survivor
   * @param id
   */
  @ApiOperation({ summary: 'Fetch location history of a survivor' })
  @ApiResponse({
    status: 201,
    type: DefaultLocationsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Get('history/:id')
  findSurvivorHistoryLocations(@Param('id') id: number) {
    return this.locationsService.findAllLocation(id);
  }

  /*
   * Find location of a survivor
   * @param id
   */
  @ApiOperation({ summary: 'Find location of a survivor' })
  @ApiResponse({
    status: 201,
    type: DefaultLocationsResponse,
  })
  @Roles(Role.SURVIVOR, Role.ADMIN)
  @Get(':id')
  findSurvivor(@Param('id') id: number) {
    return this.locationsService.findLatestLocation(id);
  }
}

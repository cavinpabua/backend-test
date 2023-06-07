import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../../auth/decorators/public.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Role } from '../../../auth/models/roles.model';
import {
  CreateAdminDto,
  CreateSurvivorDto,
  DefaultSurvivorResponse,
  SurvivorReportResponse,
} from '../dto/survivor.dto';
import { UpdateSurvivorDto } from '../dto/survivor.dto';
import { SurvivorsService } from '../services/survivors.service';
import { AuthSurvivor } from '../decorators/survivor.decorator';
import { AuthSurvivorType } from '../models/auth-survivor.model';

@ApiTags('survivors') // put the name of the controller in swagger
@Controller('survivors')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routs as private by default
export class SurvivorsController {
  constructor(private readonly survivorsService: SurvivorsService) {}

  @ApiOperation({ summary: 'register a survivor' })
  @ApiResponse({
    status: 201,
    type: DefaultSurvivorResponse,
  })
  @Public()
  @Post()
  create(@Body() createSurvivorDto: CreateSurvivorDto) {
    return this.survivorsService.create(createSurvivorDto);
  }

  @ApiOperation({ summary: 'create a survivor using admin role' })
  @ApiResponse({
    status: 201,
    type: DefaultSurvivorResponse,
  })
  @ApiBearerAuth('access-token') // Needs token to access the endpoint
  @Roles(Role.ADMIN) // makes the endpoint accessible only by the admin
  @Post('admin')
  createAdmin(@Body() creatAdminDto: CreateAdminDto) {
    return this.survivorsService.create(creatAdminDto);
  }

  @ApiOperation({ summary: 'Fetch all survivor' })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultSurvivorResponse,
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SURVIVOR) // both admin and survivor can access this endpoint
  @Get()
  findAll() {
    return this.survivorsService.findAll();
  }

  @ApiOperation({ summary: 'Get Healthy Survivor Count in the Past 30 Days' })
  @ApiResponse({
    status: 200,
    type: SurvivorReportResponse,
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SURVIVOR) // both admin and survivor can access this endpoint
  @Get('healthy')
  healthy30days() {
    return this.survivorsService.getHealthySurvivors();
  }

  @ApiOperation({ summary: 'Get Infected Survivor Count in the Past 30 Days' })
  @ApiResponse({
    status: 200,
    type: SurvivorReportResponse,
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SURVIVOR) // both admin and survivor can access this endpoint
  @Get('infected')
  infected30days() {
    return this.survivorsService.getInfectedSurvivors();
  }

  @ApiOperation({ summary: 'Get Own Data' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultSurvivorResponse,
  })
  @Roles(Role.ADMIN, Role.SURVIVOR)
  @Get('/own')
  findOwn(@AuthSurvivor() auth: AuthSurvivorType) {
    return this.survivorsService.findOwn(auth.id);
  }

  @ApiOperation({ summary: 'Fetch a specific survivor' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultSurvivorResponse,
  })
  @Roles(Role.ADMIN, Role.SURVIVOR)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.survivorsService.findOne(id);
  }

  // Admin can update any survivor
  @ApiOperation({ summary: 'Admin can update any survivor' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Patch('admin/:id')
  update(
    @Param('id') id: number,
    @Body() updateSurvivorDto: UpdateSurvivorDto,
  ) {
    return this.survivorsService.update(+id, updateSurvivorDto);
  }

  // Survivor can update itself only
  @ApiOperation({ summary: 'Survivor update its own details' })
  @ApiBearerAuth('access-token')
  @Roles(Role.SURVIVOR)
  @Patch()
  async updateSelf(
    @AuthSurvivor() auth: AuthSurvivorType,
    @Body() updateSurvivorDto: UpdateSurvivorDto,
  ) {
    return this.survivorsService.update(auth.id, updateSurvivorDto);
  }

  @ApiOperation({ summary: 'Admin can remove survivors' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Delete('admin/:id')
  remove(@Param('id') id: string) {
    return this.survivorsService.remove(+id);
  }
}

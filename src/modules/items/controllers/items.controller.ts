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
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { ItemsService } from '../services/items.service';
import {
  CreateItemDto,
  DefaultItemsResponse,
  UpdateItemDto,
} from '../dto/items.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/models/roles.model';

@ApiTags('items')
@Controller('items')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({ summary: 'Create new Item' })
  @ApiResponse({
    status: 201,
    type: DefaultItemsResponse,
  })
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @ApiOperation({ summary: 'Update Item' })
  @ApiResponse({
    status: 201,
    type: DefaultItemsResponse,
  })
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @ApiOperation({ summary: 'Fetch All Item' })
  @ApiResponse({
    status: 201,
    type: DefaultItemsResponse,
  })
  @Roles(Role.ADMIN, Role.SURVIVOR)
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @ApiOperation({ summary: 'Find Item' })
  @ApiResponse({
    status: 201,
    type: DefaultItemsResponse,
  })
  @Roles(Role.ADMIN, Role.SURVIVOR)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Delete Item' })
  @ApiResponse({
    status: 201,
    type: DefaultItemsResponse,
  })
  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.itemsService.delete(id);
  }
}

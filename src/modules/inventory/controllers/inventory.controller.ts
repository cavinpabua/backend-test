import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { InventoryService } from '../services/inventory.service';
import {
  CreateInventoryDto,
  DefaultInventoryResponse,
  SpendInventoryDto,
} from '../dto/inventory.dto';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '../../../auth/models/roles.model';
import { AuthSurvivor } from '../../../modules/survivors/decorators/survivor.decorator';
import { AuthSurvivorType } from '../../../modules/survivors/models/auth-survivor.model';

@ApiTags('inventory')
@Controller('inventory')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /*
   * This is a super powerful method that can create items out of nothing
   * It is not included in the test
   * @param createInventoryDto
   */
  @ApiOperation({
    summary:
      'Add an Item to a Survivor via Admin Role - This creates nothing into something - ADMIN SUPER POWERFUL',
  })
  @ApiResponse({
    status: 201,
    type: DefaultInventoryResponse,
  })
  @Roles(Role.ADMIN)
  @Post('add')
  add(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.add(createInventoryDto);
  }

  /*
   * Remove an Item from a Survivor
   * It is not included in the test
   * @param createInventoryDto
   */
  @ApiOperation({
    summary:
      'Remove an Item from a Survivor via Admin Role - ADMIN SUPER POWERFUL',
  })
  @ApiResponse({
    status: 201,
    type: DefaultInventoryResponse,
  })
  @Roles(Role.ADMIN)
  @Post('remove')
  remove(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.remove(createInventoryDto);
  }

  /*
   * User spends an Item
   * It is not included in the test
   * @param spendInventoryDto
   * @param survivor - Authenticated Survivor
   */
  @ApiOperation({
    summary: 'User spends an Item - Not included in test',
  })
  @ApiResponse({
    status: 201,
    type: DefaultInventoryResponse,
  })
  @Roles(Role.SURVIVOR)
  @Post('spend')
  spend(
    @AuthSurvivor() survivor: AuthSurvivorType,
    @Body() spendInventoryDto: SpendInventoryDto,
  ) {
    return this.inventoryService.spend(survivor.id, spendInventoryDto);
  }

  /*
   * Get Average Resource Allocation
   * @param id - Item Id
   */
  @ApiOperation({
    summary: 'Average Resource Allocation',
  })
  @ApiResponse({
    status: 201,
    isArray: true,
    type: DefaultInventoryResponse,
  })
  @Roles(Role.ADMIN, Role.SURVIVOR)
  @Get('average/:id')
  getAllInventory(@Param('id') id: number) {
    return this.inventoryService.averageResourceAllocation(id);
  }

  /*
   * Check inventory of Survivor
   * @param id - Survivor Id
   */
  @ApiOperation({
    summary: 'Check inventory of Survivor',
  })
  @ApiResponse({
    status: 201,
    type: DefaultInventoryResponse,
  })
  @Roles(Role.ADMIN, Role.SURVIVOR)
  @Get(':id')
  getInventory(@Param('id') id: number) {
    return this.inventoryService.getInventory(+id);
  }
}

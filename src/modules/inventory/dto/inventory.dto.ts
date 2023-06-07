import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDto } from '../../../auth/shared/dto/base.dto';

export class CreateInventoryDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly itemId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
}

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {}

export class SpendInventoryDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly itemId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
}

export class DefaultInventoryResponse extends IntersectionType(
  CreateInventoryDto,
  BaseDto,
) {}

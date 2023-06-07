import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDto } from '../../../auth/shared/dto/base.dto';

export class AddTradeDetailsDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly requestId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly itemId: number;
}

export class UpdateTradeDetailsDto extends PartialType(AddTradeDetailsDto) {}

export class DefaultTradeDetailsResponse extends IntersectionType(
  AddTradeDetailsDto,
  BaseDto,
) {}

import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../../auth/shared/dto/base.dto';

export class CreateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

export class DefaultItemsResponse extends IntersectionType(
  CreateItemDto,
  BaseDto,
) {}

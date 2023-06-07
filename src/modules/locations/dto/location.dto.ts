import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../../auth/shared/dto/base.dto';

export class CreateLocationDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly latitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly longitude: string;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

export class DefaultLocationsResponse extends IntersectionType(
  CreateLocationDto,
  BaseDto,
) {}

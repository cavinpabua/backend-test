import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Role } from '../../../auth/models/roles.model';
import { Gender } from '../models/genders.model';
import { BaseDto } from '../../../auth/shared/dto/base.dto';
import { Inventory } from '../../../modules/inventory/entities/inventory.entity';

export class BaseSurvivorDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly infected: boolean;

  @ApiProperty()
  @IsEnum(Gender)
  readonly gender: Gender;
}

export class CreateSurvivorDto extends BaseSurvivorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateSurvivorDto extends PartialType(BaseSurvivorDto) {}

export class CreateAdminDto extends CreateSurvivorDto {
  @ApiProperty()
  @IsEnum(Role)
  readonly role: Role;
}

export class DefaultSurvivorResponse extends IntersectionType(
  CreateSurvivorDto,
  BaseDto,
) {
  @ApiProperty()
  readonly role: Role;

  @ApiProperty()
  readonly lastLocation: {
    readonly latitude?: string;
    readonly longitude?: string;
  };

  @ApiProperty()
  readonly inventory: Inventory[];
}

export class SurvivorReportResponse {
  @ApiProperty()
  readonly count: number;

  @ApiProperty()
  readonly percentage: number;
}

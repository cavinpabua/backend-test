import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Status } from '../models/status.model';
import { BaseDto } from '../../../auth/shared/dto/base.dto';
import { Survivor } from '../../../modules/survivors/entities/survivor.entity';

export class CreateTradeRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId1: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId2: number;
}

export class CreateTradeRequestDtoWithUser {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId1: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId2: number;

  @ApiProperty()
  user1?: Survivor;

  @ApiProperty()
  user2?: Survivor;
}

export class AcceptTradeRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

export class RejectTradeRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

export class UpdateTradeRequestDto extends PartialType(CreateTradeRequestDto) {}

export class DefaultTradeRequestsResponse extends IntersectionType(
  CreateTradeRequestDto,
  BaseDto,
) {
  @ApiProperty()
  @IsEnum(Status)
  readonly userAccept1: Status;

  @ApiProperty()
  @IsEnum(Status)
  readonly userAccept2: Status;

  @ApiProperty()
  @IsEnum(Status)
  @IsNotEmpty()
  readonly status: Status;

  @ApiProperty()
  user1?: Survivor;

  @ApiProperty()
  user2?: Survivor;
}

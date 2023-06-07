import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString } from 'class-validator';
import { Match } from '../shared/decorators/match-validator.decorator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ name: 'New Password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Match('passwordConfirm', { message: 'Password Confirm does not match' })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  passwordConfirm: string;
}

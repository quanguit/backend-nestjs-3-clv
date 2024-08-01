import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  username: string;

  @ApiProperty({ enum: Role })
  @IsOptional()
  @IsIn([Role.Admin, Role.User])
  role: Role.Admin | Role.User;

  @ApiProperty()
  @IsOptional()
  password: string;
}

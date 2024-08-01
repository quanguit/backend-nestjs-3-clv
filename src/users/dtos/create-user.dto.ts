import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ enum: [Role.Admin, Role.User] })
  @IsNotEmpty()
  @IsString()
  @IsIn([Role.Admin, Role.User])
  role: Role.Admin | Role.User;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

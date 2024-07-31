import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([Role.Admin, Role.User])
  role: Role.Admin | Role.User;

  @IsNotEmpty()
  @IsString()
  password: string;
}

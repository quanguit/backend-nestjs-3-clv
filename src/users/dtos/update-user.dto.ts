import { IsIn, IsOptional } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  username: string;

  @IsOptional()
  @IsIn([Role.Admin, Role.User])
  role: Role.Admin | Role.User;

  @IsOptional()
  password: string;
}

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, expiredIn } =
      await this.authService.login(body);

    // Set the access token in a cookie
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      path: '/api/v1',
    });

    return {
      access_token,
      refresh_token,
      expiredIn,
    };
  }

  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.headers.authorization);
  }
}

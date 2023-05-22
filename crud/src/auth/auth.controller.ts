import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Get,
  Req,
  Res,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AUTH_ENDPOINT,
  LOGIN_ENDPOINT,
  REFRESH_ENDPOINT,
  REGISTER_ENDPOINT,
} from 'common/constants';
import { JwtDto } from 'common/dto/jwt.dto';
import { PostUserDto } from 'common/dto/user.dto';
import { Request as RequestExpress, Response } from 'express';
import { LocalAuthGuard, RefreshAuthGuard } from 'guards/simple-guards.guard';
import { UserService } from 'user/user.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { AuthService } from './auth.service';
import ms from 'ms';

@Controller(AUTH_ENDPOINT)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post(LOGIN_ENDPOINT)
  async login(
    @Request() { user }: ExtendedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtDto> {
    // set refresh token
    const refreshToken = this.authService.getRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    res.cookie('refresh_token', refreshToken, { maxAge: ms('7d') });

    return this.authService.login(user);
  }

  @Post(REGISTER_ENDPOINT)
  async register(
    @Body() user: PostUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtDto> {
    const createdUser = await this.authService.register(user);
    if (!createdUser) {
      throw new BadRequestException('User with that email already exists.');
    }

    // set refresh token
    const refreshToken = this.authService.getRefreshToken(createdUser.id);
    await this.userService.setCurrentRefreshToken(refreshToken, createdUser.id);
    res.cookie('refresh_token', refreshToken, {
      maxAge: ms('7d'),
      secure: false,
      httpOnly: false,
    });

    return this.authService.login(createdUser);
  }

  @UseGuards(RefreshAuthGuard)
  @Get(REFRESH_ENDPOINT)
  async refresh(
    @Req() request: RequestExpress,
    @Request() { user }: ExtendedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(user);

    if (!user) {
      throw new UnauthorizedException();
    }

    const newRefreshToken = this.authService.getRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(newRefreshToken, user.id);
    res.cookie('refresh_token', newRefreshToken, { maxAge: ms('7d') });

    return this.authService.login(user);
  }
}

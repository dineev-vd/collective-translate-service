import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MY_PROFILE_ENDPOINT, USER_ENDPOINT } from 'common/constants';
import { ChangeUserDto } from 'common/dto/user.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'guards/simple-guards.guard';
import { ProjectService } from 'project/project.service';
import { ExtendedRequest } from 'util/ExtendedRequest';
import { UserService } from './user.service';

@Controller(USER_ENDPOINT)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(MY_PROFILE_ENDPOINT)
  getProfile(@Request() { user }: ExtendedRequest) {
    return user;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  changeUser(
    @Param('id') id: string,
    @Body() changes: ChangeUserDto,
    @Req() { user }: ExtendedRequest,
  ) {
    if (user.id.toString() !== id) {
      throw new ForbiddenException();
    }

    return this.userService.updateUser(id, changes);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/projects')
  getProjectsByUser(@Req() { user }: ExtendedRequest, @Param('id') id: string) {
    if (user && user.id == id)
      return this.projectService.findProjectsByUser(id, { withPrivate: true });

    return this.projectService.findProjectsByUser(id);
  }
}

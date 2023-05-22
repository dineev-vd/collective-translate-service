import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ChangeUserDto, PostUserDto } from 'common/dto/user.dto';
import User from 'entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  onApplicationBootstrap() {
    const simpleUser = new User();
    simpleUser.email = 'user@user.com';
    simpleUser.name = 'Обычный пользователь';
    simpleUser.password = 'user';
    simpleUser.refreshToken = '';

    this.userRepository.save(simpleUser);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'info', 'email', 'password', 'refreshToken', 'name'],
    });
  }

  async createUser(user: PostUserDto) {
    return this.userRepository.save(user);
  }

  async findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'info', 'email', 'password', 'refreshToken', 'name'],
    });
  }

  async updateUser(id: string, changes: ChangeUserDto) {
    return this.userRepository.update(id, changes);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
}

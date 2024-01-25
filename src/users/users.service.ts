import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDTO } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepositry: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(user: CreateUserDto) {
    // se comprueba si el usuario existe
    const userExist = await this.userRepositry.findOne({
      where: { username: user.username },
    });
    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.FOUND);
    }

    const newUser = this.userRepositry.create(user);
    return this.userRepositry.save(newUser);
  }

  getAllUsers() {
    return this.userRepositry.find({ relations: ['posts', 'profile']});
  }

  async deleteUser(id: number) {
    const userFound = await this.userRepositry.findOne({ where: { id: id } });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepositry.delete({ id });
  }

  async getUserById(id: number) {
    const userFound = await this.userRepositry.findOne({ where: { id: id }, relations: ['posts', 'profile'] });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  updateUser(id: number, user: UpdateUserDto) {
    const userFound = this.userRepositry.findOne({ where: { id } });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = Object.assign(userFound, user);
    return this.userRepositry.update(id, updatedUser);
  }

  async createProfile(id: number, profile: CreateProfileDTO) {
    const userFound = await this.userRepositry.findOne({ where: { id } });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newProfile = this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);
    userFound.profile = savedProfile;
    return this.userRepositry.save(userFound);
  }
}

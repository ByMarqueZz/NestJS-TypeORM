import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;
    const plainToHash = await hash(password, 10);

    const newUser = this.authRepository.create({
      username,
      password: plainToHash,
    });

    return this.authRepository.save(newUser);
  }

  async login(createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;
    const userFound = await this.authRepository.findOne({
      where: { username },
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const checkPassword = await compare(password, userFound.password);
    if (!checkPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { id: userFound.id };
    const token = this.jwtService.sign(payload);
    const data = {
      user: userFound,
      token: token,
    }
    return data;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

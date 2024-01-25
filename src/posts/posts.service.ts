import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        private userService: UsersService
    ) { }

    async createPost(post: CreatePostDTO) {
        const author = await this.userService.getUserById(post.authorId);
        if (!author) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const newPost = this.postsRepository.create(post);
        return this.postsRepository.save(newPost);
    }

    getAllPosts() {
        return this.postsRepository.find({ relations: ['author'] });
    }

    async getPostById(id: number) {
        const postFound = await this.postsRepository.findOne({ where: { id: id } });
        if (!postFound) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return postFound;
    }

    async deletePost(id: number) {
        const postFound = await this.postsRepository.findOne({ where: { id: id } });
        if (!postFound) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return this.postsRepository.delete({ id });
    }

    async updatePost(id: number, post: CreatePostDTO) {
        const postFound = await this.postsRepository.findOne({ where: { id } });
        if (!postFound) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        const updatedPost = Object.assign(postFound, post);
        return this.postsRepository.update(id, updatedPost);
    }

    async getPostByAuthorId(authorId: number) {
        const author = await this.userService.getUserById(authorId);
        if (!author) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return this.postsRepository.find({ where: { authorId } });
    }
}

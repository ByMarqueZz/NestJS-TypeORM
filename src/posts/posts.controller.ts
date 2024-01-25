import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) {}

    @Get()
    getPosts() {
        return this.postService.getAllPosts();
    }

    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) id: number){
        return this.postService.getPostById(id);
    }

    @Get('author/:authorId')
    getPostByAuthorId(@Param('authorId', ParseIntPipe) authorId: number){
        return this.postService.getPostByAuthorId(authorId);
    }

    @Post()
    createPost(@Body() newPost: CreatePostDTO) {
        return this.postService.createPost(newPost);
    }

    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) id: number){
        return this.postService.deletePost(id);
    }

    @Patch(':id')
    updatePost(@Param('id', ParseIntPipe) id: number, @Body() post: CreatePostDTO){
        return this.postService.updatePost(id, post);
    }
    
}

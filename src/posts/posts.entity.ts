import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';

@Entity({ name: 'posts' })
export class Post {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    content: string;

    @Column()
    authorId: number;

    @ManyToOne(() => User, user => user.posts)
    author: User;
}
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  age: number;
}

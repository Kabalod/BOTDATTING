import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: ['REGISTERED', 'PRESENT', 'MATCHED'],
    default: 'REGISTERED'
  })
  status: 'REGISTERED' | 'PRESENT' | 'MATCHED';

  @Column({ default: false })
  ready?: boolean;

  @Column({ default: false })
  paid?: boolean;

  @Column({ type: 'timestamp' })
  registeredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('simple-array', { nullable: true })
  eventIds?: string[];
}
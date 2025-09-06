import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum City {
  MOSCOW = 'MOSCOW',
  SAINT_PETERSBURG = 'SAINT_PETERSBURG'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

@Entity()
export class WaitlistEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  telegramUsername?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: City,
  })
  preferredCity: City;

  @Column({ nullable: true })
  contactInfo?: string;

  @Column({ default: false })
  contacted: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

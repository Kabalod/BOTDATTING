import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum City {
  MOSCOW = 'MOSCOW',
  SAINT_PETERSBURG = 'SAINT_PETERSBURG'
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column({
    type: 'enum',
    enum: City,
  })
  city: City;

  @Column()
  eventDate: string; // YYYY-MM-DD

  @Column()
  eventTime: string; // HH:mm

  @Column()
  roundDuration: number;

  @Column()
  maxParticipants: number;

  @Column({ default: 50 })
  malePercentage: number; // Процент мужчин (0-100)

  @Column({ default: 50 })
  femalePercentage: number; // Процент женщин (0-100)

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
import { Gender } from '../dto/create-participant.dto';

export class Participant {
  id: string;
  name?: string;
  bio?: string;
  gender: Gender;
  status: 'REGISTERED' | 'PRESENT' | 'MATCHED';
  ready?: boolean;
  paid?: boolean;
  registeredAt: Date;
  createdAt: Date;
}

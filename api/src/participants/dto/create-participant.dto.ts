import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export class CreateParticipantDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}

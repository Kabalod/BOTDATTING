import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsArray } from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export class CreateParticipantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsBoolean()
  @IsOptional()
  ready?: boolean;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  eventIds?: string[];
}

export class UpdateParticipantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsEnum(['REGISTERED', 'PRESENT', 'MATCHED'])
  @IsOptional()
  status?: 'REGISTERED' | 'PRESENT' | 'MATCHED';

  @IsBoolean()
  @IsOptional()
  ready?: boolean;

  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  eventIds?: string[];
}

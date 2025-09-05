import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsArray } from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
export class CreateParticipantDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsEnum(Gender)
  @IsNotEmpty()
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

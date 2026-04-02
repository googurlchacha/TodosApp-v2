import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;
}

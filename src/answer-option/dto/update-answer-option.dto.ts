import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerOptionDto } from './create-answer-option.dto';

export class UpdateAnswerOptionDto extends PartialType(CreateAnswerOptionDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateScrumTaskDto } from './create-scrum-task.dto';

export class UpdateScrumTaskDto extends PartialType(CreateScrumTaskDto) {}

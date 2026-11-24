import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityLevelDto } from './create-activity-level.dto';

export class UpdateActivityLevelDto extends PartialType(
  CreateActivityLevelDto,
) {}

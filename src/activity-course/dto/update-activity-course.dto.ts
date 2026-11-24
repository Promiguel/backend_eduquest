import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityCourseDto } from './create-activity-course.dto';

export class UpdateActivityCourseDto extends PartialType(
  CreateActivityCourseDto,
) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateThematicUnitDto } from './create-thematic-unit.dto';

export class UpdateThematicUnitDto extends PartialType(
  CreateThematicUnitDto,
) {}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ThematicUnit } from '../../thematic-unit/entities/thematic-unit.entity';

@Entity('temas')
export class Topic {
  @PrimaryGeneratedColumn({ name: 'id_tema' })
  id_tema: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ type: 'int' })
  orden: number;

  @ManyToOne(() => ThematicUnit, (unit) => unit.topics, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_unidad' })
  thematicUnit: ThematicUnit;
}

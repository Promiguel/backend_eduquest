import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';
import { Topic } from '../../topic/entities/topic.entity';

@Entity('unidades_tematicas')
export class ThematicUnit {
  @PrimaryGeneratedColumn({ name: 'id_unidad' })
  id_unidad: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ type: 'int' })
  orden: number;

  @ManyToOne(() => Subject, (subject) => subject.thematicUnits, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_asignatura' })
  subject: Subject;

  @OneToMany(() => Topic, (topic) => topic.thematicUnit)
  topics: Topic[];
}

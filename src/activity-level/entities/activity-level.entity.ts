import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';

@Entity('niveles_actividad')
export class ActivityLevel {
  @PrimaryGeneratedColumn({ name: 'id_nivel' })
  id_nivel: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'int' })
  numero_nivel: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: {
      to: (value: number | null | undefined) => value,
      from: (value: string | number | null) =>
        value === null ? null : Number(value),
    },
  })
  puntaje_nivel: number;

  @Column({ type: 'int' })
  orden: number;

  @ManyToMany(() => Activity, (activity) => activity.levels)
  activities: Activity[];
}

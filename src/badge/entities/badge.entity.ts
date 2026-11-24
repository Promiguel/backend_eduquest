import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudentBadge } from '../../student-badge/entities/student-badge.entity';

export type BadgeCriterion =
  | { tipo: 'PUNTOS_ACUMULADOS'; cantidad: number }
  | { tipo: 'ACTIVIDADES_COMPLETADAS'; cantidad: number }
  | { tipo: 'COMPETENCIA_NIVEL'; nivel: number; id_competencia: number };

@Entity('insignias')
export class Badge {
  @PrimaryGeneratedColumn({ name: 'id_insignia' })
  id_insignia: number;

  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'imagen_url', type: 'varchar', length: 500, nullable: true })
  imagen_url?: string;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ name: 'criterio_obtencion', type: 'json' })
  criterio_obtencion: BadgeCriterion;

  @Column({ name: 'puntos_asociados', type: 'int', default: 0 })
  puntos_asociados: number;

  @OneToMany(() => StudentBadge, (studentBadge) => studentBadge.badge)
  awards: StudentBadge[];
}

import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';

@Entity('locations')
export class Location extends DefaultEntity {
  @Column({ select: true, name: 'user_id' })
  userId: number;

  @Column({ select: true })
  latitude: string;

  @Column({ select: true })
  longitude: string;
}

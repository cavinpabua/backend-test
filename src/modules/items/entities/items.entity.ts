import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';

@Entity('items')
export class Item extends DefaultEntity {
  @Column({ select: true, unique: true })
  name: string;

  @Column({ select: true })
  description: string;
}

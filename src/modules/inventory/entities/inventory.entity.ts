import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';
import { Survivor } from '../../../modules/survivors/entities/survivor.entity';

@Entity('inventory')
export class Inventory extends DefaultEntity {
  @Column({ select: true, name: 'user_id' })
  userId: number;

  @Column({ select: true, name: 'item_id' })
  itemId: number;

  @Column({ select: true })
  quantity: number;

  @ManyToOne(() => Survivor, (survivor) => survivor.inventory)
  survivor: Survivor;
}

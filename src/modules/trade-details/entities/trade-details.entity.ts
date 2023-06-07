import { Column, Entity } from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';

@Entity('trade_details')
export class TradeDetails extends DefaultEntity {
  @Column({ select: true, name: 'request_id' })
  requestId: number;

  @Column({ select: true, name: 'user_id' })
  userId: number;

  @Column({ select: true, name: 'item_id' })
  itemId: number;
}

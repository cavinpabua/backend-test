import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';
import { Status } from '../models/status.model';
import { Survivor } from '../../../modules/survivors/entities/survivor.entity';

@Entity('trades_requests')
export class TradeRequest extends DefaultEntity {
  @Column({ select: true, name: 'user_id_1' })
  userId1: number;

  @Column({ select: true, name: 'user_id_2' })
  userId2: number;

  @ManyToOne(() => Survivor)
  @JoinColumn()
  user1?: Survivor;

  @ManyToOne(() => Survivor)
  @JoinColumn()
  user2?: Survivor;

  @Column({
    select: true,
    name: 'user_accept_1',
    default: Status.PENDING,
    type: 'enum',
    enum: Status,
  })
  userAccept1: Status;

  @Column({
    select: true,
    name: 'user_accept_2',
    type: 'enum',
    default: Status.PENDING,
    enum: Status,
  })
  userAccept2: Status;

  @Column({
    select: true,
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;
}

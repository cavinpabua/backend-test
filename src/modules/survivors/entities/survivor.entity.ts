import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from '../../../auth/models/roles.model';
import { DefaultEntity } from '../../../utils/entities/default.entity';
import { Gender } from '../models/genders.model';
import { Location } from '../../../modules/locations/entities/location.entity';
import { Inventory } from '../../../modules/inventory/entities/inventory.entity';

@Entity('survivors')
export class Survivor extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({
    select: true,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  // dont allow NaN and Infinity and Zero
  @Column()
  age: number;

  @Column({
    default: false,
  })
  infected: boolean;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHERS,
  })
  gender: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.SURVIVOR,
  })
  role: Role;

  @OneToOne(() => Location)
  @JoinColumn()
  lastLocation: Location;

  @OneToMany(() => Inventory, (inventory) => inventory.survivor)
  @JoinColumn()
  inventory: Inventory[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      // hash the password
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeInsert()
  async fullName() {
    // check if both first name and last name are present
    if (this.firstName && this.lastName) {
      this.name = `${this.firstName} ${this.lastName}`;
    } else if (this.firstName) {
      // if only first name is present
      this.name = this.firstName;
    } else if (this.lastName) {
      // if only last name is present
      this.name = this.lastName;
    } else {
      // if neither first name nor last name is present
      this.name = 'Anonymous';
    }
  }
}

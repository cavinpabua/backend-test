import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Role } from 'src/auth/models/roles.model';
import * as bcrypt from 'bcrypt';
import { Survivor } from '../../src/modules/survivors/entities/survivor.entity';

export default class SeedUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const table = 'survivors';
    const survivors = [
      {
        lastName: 'LAdmin',
        firstName: 'FAdmin',
        name: 'FAdmin LAdmin',
        email: 'admin@admin.com',
        age: 20,
        password: await bcrypt.hash('test1234', 10),
        role: Role.ADMIN,
      },
      {
        lastName: 'LSurvivor',
        firstName: 'FSurvivor',
        name: 'FSurvivor LSurvivor',
        age: 18,
        email: 'survivor@survivor.com',
        password: await bcrypt.hash('test1234', 10),
        role: Role.SURVIVOR,
      },
    ];

    // await connection.getRepository(table).save([...survivors], { chunk: 500 });
    // add user and catch error if exists
    await connection
      .createQueryBuilder()
      .insert()
      .into(table)
      .values(survivors)
      .orIgnore()
      .execute();

    await factory(Survivor)().createMany(15);
  }
}

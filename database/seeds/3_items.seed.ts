import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class SeedItems implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const table = 'items';
    const items = [
      {
        name: 'Water',
        description: 'Water is the most important item for survival',
      },
      {
        name: 'Food',
        description: 'Food is the second most important item for survival',
      },
      {
        name: 'Medication',
        description: 'Medication is needed for healing',
      },
      {
        name: 'C-Virus Vaccine',
        description: 'Vaccine is for immunization against the C-Virus',
      },
    ];
    // await connection.getRepository(table).save([...items], { chunk: 500 });
    await connection
      .createQueryBuilder()
      .insert()
      .into(table)
      .values(items)
      .orIgnore()
      .execute();
  }
}

import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
// import { Role } from 'src/auth/models/roles.model';
// import * as bcrypt from 'bcrypt';
import { Survivor } from '../../src/modules/survivors/entities/survivor.entity';
import { Inventory } from '../../src/modules/inventory/entities/inventory.entity';

export default class SeedInventory implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // get survivors and count
    const survivors = await connection.getRepository(Survivor).find();
    const survivorCount = survivors.length;

    await factory(Inventory)()
      .map(async (inventory) => {
        inventory.userId = Math.floor(Math.random() * survivorCount) + 1;
        inventory.survivor = survivors[inventory.userId - 1];
        // check if inventory already exists
        const inventoryExists = await connection
          .getRepository(Inventory)
          .findOne({
            where: {
              userId: inventory.userId,
              itemId: inventory.itemId,
            },
          });

        if (inventoryExists) {
          // if inventory exists, add quantity to existing quantity
          inventoryExists.quantity += inventory.quantity;
          await connection.getRepository(Inventory).save(inventoryExists);
          return inventoryExists;
        }

        return inventory;
      })
      .createMany(100);
  }
}

import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Inventory } from '../../src/modules/inventory/entities/inventory.entity';

define(Inventory, (faker: typeof Faker) => {
  const inventory = new Inventory();
  inventory.itemId = faker.random.number({ min: 1, max: 4 });
  inventory.quantity = faker.random.number({ min: 1, max: 100 });
  return inventory;
});

import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { Survivor } from '../../src/modules/survivors/entities/survivor.entity';

define(Survivor, (faker: typeof Faker) => {
  const survivor = new Survivor();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  survivor.name = `${firstName} ${lastName}`;
  survivor.firstName = firstName;
  survivor.lastName = lastName;
  survivor.email = faker.internet.email();
  survivor.age = faker.random.number({ min: 18, max: 100 });
  survivor.role = faker.random.arrayElement(['survivor', 'admin']);
  survivor.infected = faker.random.boolean();
  survivor.password =
    '$2b$10$4KXr.qChGtoo5b8aYQNuH.L5cWLDIXz/N2ollt5vttSSquHD9Ng2C'; //password = test123
  return survivor;
});

import { Gender } from '../../../src/modules/survivors/models/genders.model';
import { Role } from '../../../src/auth/models/roles.model';
import {
  CreateAdminDto,
  CreateSurvivorDto,
} from '../../../src/modules/survivors/dto/survivor.dto';

export const userAdmin: CreateAdminDto = {
  email: 'test@example.com',
  password: '$2b$10$4KXr.qChGtoo5b8aYQNuH.L5cWLDIXz/N2ollt5vttSSquHD9Ng2C', //password = test123
  firstName: 'Jordi',
  lastName: 'Cher',
  age: 30,
  infected: false,
  gender: Gender.OTHERS,
  role: Role.ADMIN,
};

export const userLogin = {
  ...userAdmin,
  password: 'test123',
};

export const userSurvivor: CreateSurvivorDto = {
  email: 'test@customer.com',
  password: 'test123',
  firstName: 'Jordi',
  lastName: 'Cher',
  age: 22,
  infected: false,
  gender: Gender.MALE,
};

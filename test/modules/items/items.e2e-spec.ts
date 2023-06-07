import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../../../src/app.module';
import {
  userAdmin,
  userSurvivor,
  sampleItem,
  userLogin,
  sampleItem2,
} from './utils';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let adminJwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();

    const connection = app.get(Connection);
    await connection.synchronize(true);

    await connection
      .createQueryBuilder()
      .insert()
      .into('survivors')
      .values([userAdmin, userSurvivor])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into('items')
      .values([sampleItem2])
      .execute();
  });

  afterAll(() => {
    app.close();
  });

  describe('Authentication', () => {
    it('authenticates user with valid credentials and provides a jwt token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userLogin.email, password: userLogin.password })
        .expect(200);

      adminJwtToken = response.body.accessToken;
      expect(adminJwtToken).toMatch(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      );
    });
  });

  describe('Items', () => {
    let itemId: number;
    it('should create an Item', async () => {
      const response = await request(app.getHttpServer())
        .post('/items')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .send({
          name: sampleItem.name,
          description: sampleItem.description,
        })
        .expect(201);

      itemId = response.body.id;
      expect(response.body.name).toBe(sampleItem.name);
      expect(response.body.description).toBe(sampleItem.description);
    });

    it('should not create an item with no description', async () => {
      await request(app.getHttpServer())
        .post('/items')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .send({
          name: sampleItem.name,
        })
        .expect(400);
    });

    it('should get a item', async () => {
      const response = await request(app.getHttpServer())
        .get(`/items/${itemId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);

      expect(response.body.name).toBe(sampleItem.name);
    });

    it('should list all items', async () => {
      const response = await request(app.getHttpServer())
        .get('/items')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);

      expect(response.body.length).toBe(2);
    });

    it('should update an item description', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/items/${itemId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .send({
          name: sampleItem.name,
          description: 'New description for water',
        })
        .expect(200);
      expect(response.body.name).toBe(sampleItem.name);
      expect(response.body.description).toBe('New description for water');
    });

    it('should delete an item', async () => {
      await request(app.getHttpServer())
        .delete(`/items/${itemId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);
    });

    it('should not delete an item with an invalid id', async () => {
      await request(app.getHttpServer())
        .delete('/items/0')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(404);
    });
  });
});

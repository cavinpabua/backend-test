import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';
import { AppModule } from '../../../src/app.module';
import { userAdmin, userSurvivor, userLogin } from './utils';

describe('SurvivorsController (e2e)', () => {
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
      .values([userAdmin])
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

    it('fails to authenticate user with an incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userLogin.email, password: 'wrong' })
        .expect(401);

      expect(response.body.accessToken).not.toBeDefined();
    });

    it('fails to authenticate user that does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'test' })
        .expect(401);

      expect(response.body.accessToken).not.toBeDefined();
    });
  });

  describe('Users', () => {
    let survivorId: number;
    it('should create a survivor user', async () => {
      const response = await request(app.getHttpServer())
        .post('/survivors')
        .send({
          email: userSurvivor.email,
          password: userSurvivor.password,
          firstName: userSurvivor.firstName,
          lastName: userSurvivor.lastName,
          age: userSurvivor.age,
          infected: userSurvivor.infected,
          gender: userSurvivor.gender,
        })
        .expect(201);

      survivorId = response.body.id;
      expect(response.body.email).toBe(userSurvivor.email);
      expect(response.body.firstName).toBe(userSurvivor.firstName);
      expect(response.body.lastName).toBe(userSurvivor.lastName);
      expect(response.body.age).toBe(userSurvivor.age);
      expect(response.body.infected).toBe(userSurvivor.infected);
      expect(response.body.gender).toBe(userSurvivor.gender);
    });

    it('should not create a survivor user with an invalid email', async () => {
      await request(app.getHttpServer())
        .post('/survivors')
        .send({
          email: 'invalid',
          password: userSurvivor.password,
          firstName: userSurvivor.firstName,
          lastName: userSurvivor.lastName,
          age: userSurvivor.age,
          infected: userSurvivor.infected,
          gender: userSurvivor.gender,
        })
        .expect(400);
    });

    it('should get a user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/survivors/${survivorId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);

      expect(response.body.email).toBe(userSurvivor.email);
    });

    it('should list all survivors', async () => {
      const response = await request(app.getHttpServer())
        .get('/survivors')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);

      expect(response.body.length).toBe(2);
    });

    it('should update a survivor user', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/survivors/admin/${survivorId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .send({
          email: userSurvivor.email,
          firstName: 'Jordi',
          lastName: 'test',
        })
        .expect(200);

      expect(response.body.email).toBe(userSurvivor.email);
      expect(response.body.firstName).toBe('Jordi');
      expect(response.body.lastName).toBe('test');
    });

    it('should delete a survivor user', async () => {
      await request(app.getHttpServer())
        .delete(`/survivors/admin/${survivorId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200);
    });

    it('should not delete a survivor user with an invalid id', async () => {
      await request(app.getHttpServer())
        .delete('/survivors/0')
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(404);
    });
  });
});

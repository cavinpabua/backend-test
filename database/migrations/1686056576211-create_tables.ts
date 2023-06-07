import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1686056576211 implements MigrationInterface {
    name = 'createTables1686056576211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "latitude" character varying NOT NULL, "longitude" character varying NOT NULL, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."survivors_gender_enum" AS ENUM('male', 'female', 'others')`);
        await queryRunner.query(`CREATE TYPE "public"."survivors_role_enum" AS ENUM('survivor', 'admin')`);
        await queryRunner.query(`CREATE TABLE "survivors" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "refresh_token" character varying, "name" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "age" integer NOT NULL, "infected" boolean NOT NULL DEFAULT false, "gender" "public"."survivors_gender_enum" NOT NULL DEFAULT 'others', "role" "public"."survivors_role_enum" NOT NULL DEFAULT 'survivor', "lastLocationId" integer, CONSTRAINT "UQ_e853edfa64a25b41ca8b79dd21b" UNIQUE ("email"), CONSTRAINT "REL_23d19d19d60ba1255c553176ed" UNIQUE ("lastLocationId"), CONSTRAINT "PK_fb7d83baad5445af854c76906f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "item_id" integer NOT NULL, "quantity" integer NOT NULL, "survivorId" integer, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_213736582899b3599acaade2cd1" UNIQUE ("name"), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."trades_requests_user_accept_1_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TYPE "public"."trades_requests_user_accept_2_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TYPE "public"."trades_requests_status_enum" AS ENUM('pending', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "trades_requests" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id_1" integer NOT NULL, "user_id_2" integer NOT NULL, "user_accept_1" "public"."trades_requests_user_accept_1_enum" NOT NULL DEFAULT 'pending', "user_accept_2" "public"."trades_requests_user_accept_2_enum" NOT NULL DEFAULT 'pending', "status" "public"."trades_requests_status_enum" NOT NULL DEFAULT 'pending', "user1Id" integer, "user2Id" integer, CONSTRAINT "PK_14374ef5b6de7e5e3c001040fcd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trade_details" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "request_id" integer NOT NULL, "user_id" integer NOT NULL, "item_id" integer NOT NULL, CONSTRAINT "PK_1cd25f1c097b6680a29543f5b55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "survivors" ADD CONSTRAINT "FK_23d19d19d60ba1255c553176ed9" FOREIGN KEY ("lastLocationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_ef553e9515d57b14a3ed2d3b733" FOREIGN KEY ("survivorId") REFERENCES "survivors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trades_requests" ADD CONSTRAINT "FK_573c9407d4a1ded7a7ecd9d0b6c" FOREIGN KEY ("user1Id") REFERENCES "survivors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "trades_requests" ADD CONSTRAINT "FK_e619588e2c362484134552702bd" FOREIGN KEY ("user2Id") REFERENCES "survivors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trades_requests" DROP CONSTRAINT "FK_e619588e2c362484134552702bd"`);
        await queryRunner.query(`ALTER TABLE "trades_requests" DROP CONSTRAINT "FK_573c9407d4a1ded7a7ecd9d0b6c"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_ef553e9515d57b14a3ed2d3b733"`);
        await queryRunner.query(`ALTER TABLE "survivors" DROP CONSTRAINT "FK_23d19d19d60ba1255c553176ed9"`);
        await queryRunner.query(`DROP TABLE "trade_details"`);
        await queryRunner.query(`DROP TABLE "trades_requests"`);
        await queryRunner.query(`DROP TYPE "public"."trades_requests_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."trades_requests_user_accept_2_enum"`);
        await queryRunner.query(`DROP TYPE "public"."trades_requests_user_accept_1_enum"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "survivors"`);
        await queryRunner.query(`DROP TYPE "public"."survivors_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."survivors_gender_enum"`);
        await queryRunner.query(`DROP TABLE "locations"`);
    }

}

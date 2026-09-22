import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790050055923 implements MigrationInterface {
    name = 'Migration1790050055923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bid" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "bid" DROP COLUMN "updatedAt"`);
    }

}

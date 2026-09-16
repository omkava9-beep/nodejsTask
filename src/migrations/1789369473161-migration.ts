import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789369473161 implements MigrationInterface {
    name = 'Migration1789369473161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bid" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bidPrice" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "productId" uuid, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_b0f254bd6d29d3da2b6a8af262b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_984420b02abbd6c64e46e55ba33" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_984420b02abbd6c64e46e55ba33"`);
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_b0f254bd6d29d3da2b6a8af262b"`);
        await queryRunner.query(`DROP TABLE "bid"`);
    }

}

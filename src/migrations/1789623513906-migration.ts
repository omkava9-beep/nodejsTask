import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789623513906 implements MigrationInterface {
    name = 'Migration1789623513906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "currentWinnerIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_0e6456fe61db0dd38f959e0a542" FOREIGN KEY ("currentWinnerIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_0e6456fe61db0dd38f959e0a542"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "currentWinnerIdId"`);
    }

}

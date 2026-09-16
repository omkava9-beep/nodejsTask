import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789360525645 implements MigrationInterface {
    name = 'Migration1789360525645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "approvedById" uuid`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_093ac83d74f803e7596542ef7ab" FOREIGN KEY ("approvedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_093ac83d74f803e7596542ef7ab"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "approvedById"`);
    }

}

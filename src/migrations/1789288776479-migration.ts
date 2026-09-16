import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1789288776479 implements MigrationInterface {
    name = 'Migration1789288776479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('pending', 'listed', 'sold')`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "imageUrls" character varying NOT NULL, "startingPrice" integer NOT NULL, "current_highest" integer NOT NULL, "status" "public"."product_status_enum" NOT NULL DEFAULT 'pending', "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
    }

}

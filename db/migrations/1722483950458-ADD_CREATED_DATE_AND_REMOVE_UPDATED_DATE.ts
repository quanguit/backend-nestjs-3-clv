import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDCREATEDDATEANDREMOVEUPDATEDDATE1722483950458
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Session" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "updated_date"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Session" DROP COLUMN "created_date"`);
    await queryRunner.query(
      `ALTER TABLE "User" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}

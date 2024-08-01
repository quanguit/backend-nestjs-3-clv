import { MigrationInterface, QueryRunner } from 'typeorm';

export class CHANGETABLENAME1722480044048 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" RENAME TO "User"`);
    await queryRunner.query(`ALTER TABLE "session_entity" RENAME TO "Session"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" RENAME TO "user_entity"`);
    await queryRunner.query(
      `ALTER TABLE "Session" RENAME TO "session_entity "`,
    );
  }
}

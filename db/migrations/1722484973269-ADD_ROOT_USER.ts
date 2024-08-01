import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ADDROOTUSER1722484973269 implements MigrationInterface {
  sampleUUID = '123e4567-e89b-12d3-a456-426614174000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashPassword = await bcrypt.hash('admin', 10);

    await queryRunner.query(
      `INSERT INTO "User" (id, username, password, role) VALUES ($1, $2, $3, $4)`,
      [this.sampleUUID, 'admin', hashPassword, 'admin'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "Session" WHERE user_id = $1`, [
      this.sampleUUID,
    ]);
    await queryRunner.query(`DELETE FROM "User" WHERE id = $1`, [
      this.sampleUUID,
    ]);
  }
}

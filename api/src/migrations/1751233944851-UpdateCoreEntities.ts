import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCoreEntities1751233944851 implements MigrationInterface {
  name = 'UpdateCoreEntities1751233944851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // tenant adjustments
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "status" character varying NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ALTER COLUMN "subdomain" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "UQ_tenant_name" UNIQUE ("name")`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "is_deleted"`);

    // company adjustments
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "company_id"`);
    await queryRunner.query(
      `ALTER TABLE "company" ADD "phone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "address" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "contact_email" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "is_owner" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "is_admin_user_created" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_company_tenant_name" ON "company" ("tenant_id", "name")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_company_owner" ON "company" ("tenant_id") WHERE is_owner = true`,
    );

    // department adjustments
    await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "tenant_id"`);
    await queryRunner.query(
      `ALTER TABLE "department" ALTER COLUMN "company_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_department_company_name" ON "department" ("company_id", "name")`,
    );

    // role adjustments
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "UQ_role_name"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "company_id"`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD "description" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "role" ADD "permissions" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD "is_system_role" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_role_tenant_name" ON "role" ("tenant_id", "name")`,
    );

    // user adjustments
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "last_name"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "department_id" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "role_id" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "full_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" character varying NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "auth0_user_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "company_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_email" ON "user" ("email")`,
    );

    // foreign keys
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_company_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD CONSTRAINT "FK_department_company" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_role_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_company" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_department" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_role" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop foreign keys
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_role"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_department"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_company"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_tenant"`);
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_role_tenant"`);
    await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_department_company"`);
    await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_company_tenant"`);

    await queryRunner.query(`DROP INDEX "IDX_user_email"`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "company_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "auth0_user_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_deleted"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "full_name"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role_id"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "department_id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "last_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "first_name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_user_roles" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(`DROP INDEX "IDX_role_tenant_name"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "is_system_role"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permissions"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "role" ADD "company_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "UQ_role_name" UNIQUE ("name")`,
    );
    await queryRunner.query(`DROP INDEX "IDX_department_company_name"`);
    await queryRunner.query(
      `ALTER TABLE "department" ALTER COLUMN "company_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "department" ADD "tenant_id" uuid NOT NULL`,
    );
    await queryRunner.query(`DROP INDEX "IDX_company_owner"`);
    await queryRunner.query(`DROP INDEX "IDX_company_tenant_name"`);
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "is_admin_user_created"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "is_owner"`);
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "contact_email"`,
    );
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "company" ADD "company_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "UQ_tenant_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ALTER COLUMN "subdomain" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "status"`);
  }
}

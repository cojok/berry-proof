import { AppDataSource } from './data-source';
import { Role } from './entities/role.entity';

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Role);
  const tenantId =
    process.env.SEED_TENANT_ID ?? '00000000-0000-0000-0000-000000000000';
  const roles = ['admin', 'user', 'auditor', 'super-user'];
  for (const name of roles) {
    const exists = await repo.findOne({ where: { name } });
    if (!exists) {
      await repo.save(repo.create({ name, tenantId }));
    }
  }
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

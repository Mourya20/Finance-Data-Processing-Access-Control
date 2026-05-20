const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SEED_USERS = [
  // 2 Admins
  { email: 'admin1@test.com', password: 'admin123', role: 'ADMIN' },
  { email: 'admin2@test.com', password: 'admin123', role: 'ADMIN' },
  
  // 5 Analysts
  { email: 'analyst1@test.com', password: 'analyst123', role: 'ANALYST' },
  { email: 'analyst2@test.com', password: 'analyst123', role: 'ANALYST' },
  { email: 'analyst3@test.com', password: 'analyst123', role: 'ANALYST' },
  { email: 'analyst4@test.com', password: 'analyst123', role: 'ANALYST' },
  { email: 'analyst5@test.com', password: 'analyst123', role: 'ANALYST' },
  
  // 50 Viewers
  ...Array.from({ length: 50 }, (_, i) => ({
    email: `viewer${i + 1}@test.com`,
    password: 'viewer123',
    role: 'VIEWER'
  }))
];

async function main() {
  console.log('🌱 Starting seed...');

  // Delete existing users
  await prisma.user.deleteMany();
  console.log('✓ Cleared existing users');

  // Create new users
  for (const userData of SEED_USERS) {
    const hash = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hash,
        role: userData.role,
        status: 'ACTIVE'
      }
    });
    console.log(`✓ Created ${userData.role}: ${user.email}`);
  }

  // Create sample records for testing
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (admin) {
    await prisma.record.deleteMany();
    
    const sampleRecords = [
      { amount: 5000, type: 'INCOME', category: 'Salary', notes: 'Monthly salary', userId: admin.id },
      { amount: 2000, type: 'INCOME', category: 'Freelance', notes: 'Project payment', userId: admin.id },
      { amount: 500, type: 'EXPENSE', category: 'Food', notes: 'Groceries and dining', userId: admin.id },
      { amount: 300, type: 'EXPENSE', category: 'Transport', notes: 'Gas and rides', userId: admin.id },
      { amount: 200, type: 'EXPENSE', category: 'Entertainment', notes: 'Movies and games', userId: admin.id }
    ];

    for (const record of sampleRecords) {
      await prisma.record.create({ data: record });
    }
    console.log(`✓ Created ${sampleRecords.length} sample records`);
  }

  // Create sample budgets
  await prisma.budget.deleteMany();
  const budgets = [
    { category: 'Food', limit: 3000 },
    { category: 'Transport', limit: 1000 },
    { category: 'Entertainment', limit: 500 }
  ];

  for (const budget of budgets) {
    await prisma.budget.create({ data: budget });
  }
  console.log(`✓ Created ${budgets.length} sample budgets`);

  console.log('\n✅ Seed completed successfully!\n');
  console.log('📝 Predefined Users:');
  console.log('\n👤 ADMINS (2):');
  console.log('   admin1@test.com / admin123');
  console.log('   admin2@test.com / admin123');
  console.log('\n👥 ANALYSTS (5):');
  console.log('   analyst1@test.com / analyst123');
  console.log('   analyst2@test.com / analyst123');
  console.log('   analyst3@test.com / analyst123');
  console.log('   analyst4@test.com / analyst123');
  console.log('   analyst5@test.com / analyst123');
  console.log('\n👨 VIEWERS (50):');
  console.log('   viewer1@test.com through viewer50@test.com / viewer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

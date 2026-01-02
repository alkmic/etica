import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo user only
  const hashedPassword = await hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin Test',
      password: hashedPassword,
    },
  })

  console.log('Created demo user:', user.email)
  console.log('')
  console.log('Database seeded successfully!')
  console.log('')
  console.log('Test account:')
  console.log('   Email: admin@test.com')
  console.log('   Password: password123')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

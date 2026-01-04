// Script to rename columns before prisma db push
// This preserves data by renaming instead of dropping/creating

const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log('Checking and renaming columns if needed...')

    // Check if 'domain' column exists and rename to 'sector'
    const domainExists = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'Sia' AND column_name = 'domain'
    `

    if (domainExists.length > 0) {
      console.log('Renaming column: domain -> sector')
      await prisma.$executeRawUnsafe(`ALTER TABLE "Sia" RENAME COLUMN "domain" TO "sector"`)
      console.log('✓ Renamed domain to sector')
    } else {
      console.log('Column "domain" not found (already renamed or new database)')
    }

    // Check if 'scale' column exists and rename to 'userScale'
    const scaleExists = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'Sia' AND column_name = 'scale'
    `

    if (scaleExists.length > 0) {
      console.log('Renaming column: scale -> userScale')
      await prisma.$executeRawUnsafe(`ALTER TABLE "Sia" RENAME COLUMN "scale" TO "userScale"`)
      console.log('✓ Renamed scale to userScale')
    } else {
      console.log('Column "scale" not found (already renamed or new database)')
    }

    console.log('Column migration completed successfully!')

  } catch (error) {
    console.error('Migration error:', error.message)
    // Don't fail the build if columns already renamed
    if (!error.message.includes('does not exist')) {
      throw error
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()

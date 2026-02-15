import { PrismaClient } from "@prisma/client"
import { SecurePassword } from "@blitzjs/auth/secure-password"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")
  const hashedPassword = await SecurePassword.hash("password123")

  // ---- Default User ----
  const user = await prisma.user.upsert({
    where: { email: "student@staple.local" },
    update: {},
    create: {
      email: "student@staple.local",
      username: "staple_translation",
      hashedPassword,
      role: "USER",
      firstName: "STAPLE",
      lastName: "Student",
      language: "de",
    },
  })

  console.log("✅ User created:", user.email)

  // ---- Default Project ----
  const project = await prisma.project.create({
    data: {
      name: "Translation Sandbox",
      description: "Project for student translation work",
    },
  })

  console.log("✅ Project created:", project.name)

  // ---- ProjectMember ----
  const projectMember = await prisma.projectMember.create({
    data: {
      projectId: project.id,
      name: "STAPLE Student",
      users: {
        connect: { id: user.id },
      },
    },
  })

  console.log("✅ ProjectMember created")

  // ---- Project Privilege ----
  await prisma.projectPrivilege.create({
    data: {
      userId: user.id,
      projectId: project.id,
      privilege: "PROJECT_MANAGER",
    },
  })

  console.log("✅ Project privilege assigned")

  console.log("🌱 Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

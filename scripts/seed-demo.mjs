import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const demoUser = {
  email: "demo@example.com",
  name: "Demo User",
  password: "password123",
};

async function main() {
  const passwordHash = await hash(demoUser.password, 12);

  const user = await prisma.user.upsert({
    where: { email: demoUser.email },
    update: {
      name: demoUser.name,
      passwordHash,
    },
    create: {
      email: demoUser.email,
      name: demoUser.name,
      passwordHash,
    },
  });

  const conversation = await prisma.conversation.upsert({
    where: { id: "demo-conversation" },
    update: {
      userId: user.id,
      title: "Demo conversation",
    },
    create: {
      id: "demo-conversation",
      userId: user.id,
      title: "Demo conversation",
      messages: {
        create: [
          {
            role: "user",
            content: "Explain what this starter app can do.",
          },
          {
            role: "assistant",
            content:
              "This starter includes authentication, persistent conversations, a generic AI agent, tool calling, streaming UI, and deployment-ready configuration.",
          },
        ],
      },
    },
  });

  console.log("Demo user ready:");
  console.log(`Email: ${demoUser.email}`);
  console.log(`Password: ${demoUser.password}`);
  console.log(`Conversation: ${conversation.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

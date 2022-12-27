import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

async function main() {
  const prisma = new PrismaClient();
  const xprisma = new PrismaClient().$extends({
    result: {
      user: {
        password: {
          needs: {},
          compute: () => {
            return undefined;
          },
        },
      },
    },
  });

  const user = await xprisma.user.upsert({
    where: {
      id: 1,
    },
    create: {
      username: "john",
      email: "john@test.com",
      password: await hash("somePassword", 10),
    },
    update: {
      password: await hash("somePassword", 10),
    },
  });
  const post = await xprisma.post.upsert({
    where: {
      id: 1,
    },
    create: {
      title: "Excludes using client extensions",
      content: "A proof of concept for how to exclude using prisma extensions",
      user: {
        connectOrCreate: {
          where: {
            id: 2,
          },
          create: {
            username: "jane",
            email: "jane@test.com",
            password: await hash("somePassword", 10),
          },
        },
      },
    },
    update: {},
    include: {
      user: true,
    },
  });
  const unsafeUser = await prisma.user.findFirst({ where: { id: 1 } });
  const unsafePost = await prisma.post.findFirst({
    where: { id: 1 },
    include: { user: true },
  });
  console.table([user, post.user, unsafeUser, unsafePost?.user]);
}

main();

import Fastify from "fastify";
import { prisma } from "./lib/prisma.js";

const app = Fastify({
  logger: true,
});

app.get("/", async (request, reply) => {
  request.log.info("A rota principal foi acessada");

  return reply.status(200).send({
    message: "API funcionando",
  });
});

app.get("/users", async (_request, reply) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return reply.status(200).send(users);
});

async function start() {
  try {
    await app.listen({
      port: 3333,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
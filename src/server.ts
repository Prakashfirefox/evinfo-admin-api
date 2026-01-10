import dotenv from "dotenv";
import bodyParser from "body-parser";
import express from "express";
import AdminRoutes from "./api/routes/v1/admin";
import SERVER from "./config/config";
import helmet from "helmet";
import prisma from "./db/client";
import cors from "cors";
import logger from "./api/utils/logger";

dotenv.config();

const app = express();
const server = require("http").createServer(app);

const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "*"
  ],
  credentials: true,
};



app.use(helmet());                // GOOD → only once
app.use(cors(corsOptions));
app.set("port", SERVER.SERVER.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.send("Welcome to EVinfo, API is Running successfully on Dev server....");
});

app.use("/api/v1/", AdminRoutes);

// Database connection and server start
async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Connected to the database successfully.");

    const port = app.get("port");
    server.listen(port, () => {
      logger.info(`Evinfo Api running on port ${port}!`);
    });
  } catch (error) {
    logger.error("Database connection failed: %o", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
startServer();

export default server;

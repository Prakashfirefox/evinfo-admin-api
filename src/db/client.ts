import { PrismaClient } from "@prisma/client";

// Instantiate PrismaClient using the generated client and default options.
// The client was regenerated to use the standard JS client engine, so no
// adapter descriptor is required.
const prisma = new PrismaClient();

export default prisma;

import dotenv from "dotenv";
import path from "path";
import { buildConfig } from "payload";

dotenv.config({
  path: path.resolve(process.cwd(), "apps/cms/.env"),
});

const projectRoot = path.resolve(process.cwd(), "apps/cms");

const config = buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  secret: process.env.PAYLOAD_SECRET ?? "set-a-secure-secret",
  db: {} as any,
  collections: [],
  typescript: {
    outputFile: path.resolve(projectRoot, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(projectRoot, "generated-schema.graphql"),
  },
} as any);

export default config;


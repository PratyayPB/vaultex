// lib/appwrite/client.ts
"use client";

import { Client, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";

const client = new Client()
  .setEndpoint(appwriteConfig.endpointURL)
  .setProject(appwriteConfig.projectID);

export const storage = new Storage(client);

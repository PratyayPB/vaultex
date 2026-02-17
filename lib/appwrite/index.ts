"use server";

import { Account, Client, Databases, Storage, Avatars } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";
export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL)
    .setProject(appwriteConfig.projectID);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    return null;
  }
  client.setSession(session.value);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL)
    .setProject(appwriteConfig.projectID)
    .setKey(appwriteConfig.secretkey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};

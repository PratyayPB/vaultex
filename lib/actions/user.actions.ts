"use server";

import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";
import { error } from "console";

export const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.usersCollectionID,
    [Query.equal("email", [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};

export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send email OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      ID.unique(),
      {
        fullname,
        email,
        avatar: "https://cdn-icons-png.flaticon.com/512/3541/3541871.png",
        accountId,
      }
    );
  }
  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const account = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify secret");
  }
};

export const signoutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to signout user");
  } finally {
    redirect("/sign-in");
  }
};

export const signinUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {}
};

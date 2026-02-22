"use server";

import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Query, ID, Models } from "node-appwrite";
import { AuthResult, CurrentUser } from "@/types";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { avatarPlaceholderUrl } from "@/constants";

export const getUserByEmail = async (email: string): Promise<unknown> => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.usersCollectionID,
    [Query.equal("email", [email])],
  );
  return result.total > 0 ? result.documents[0] : null;
};

export const handleError = async (
  error: unknown,
  message: string,
): Promise<never> => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({
  email,
}: {
  email: string;
}): Promise<string | undefined> => {
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
}): Promise<AuthResult | undefined> => {
  console.log("Creating account for:", fullname, email);
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
        fullName: fullname,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
      },
    );
  }
  return parseStringify({ accountId }) as AuthResult;
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}): Promise<unknown> => {
  try {
    const admin = await createAdminClient();
    const session = await admin.account.createSession(accountId, password);
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

export const signoutUser = async (): Promise<void> => {
  const sessionClient = await createSessionClient();
  if (!sessionClient) {
    redirect("/sign-in");
  }

  const { account } = sessionClient;
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to signout user");
  } finally {
    redirect("/sign-in");
  }
};

export const signinUser = async ({
  email,
}: {
  email: string;
}): Promise<AuthResult | undefined> => {
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return parseStringify({ accountId: null, error: "User not found" }) as AuthResult;
    }
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({
        accountId: (existingUser as Models.Document & { accountId: string }).accountId,
      }) as AuthResult;
    }
    return parseStringify({ accountId: null, error: "User not found" }) as AuthResult;
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  //If no session, return null
  const sessionClient = await createSessionClient();
  if (!sessionClient) {
    return null;
  }

  //getCUrrentUser
  const { databases, account } = sessionClient;
  const result = await account.get();
  const user = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.usersCollectionID,
    [Query.equal("accountId", [result.$id])],
  );

  if (user.total <= 0) {
    return null;
  }
  return parseStringify(user.documents[0]) as CurrentUser;
};

export const signOutUser = async (): Promise<void> => {
  const sessionClient = await createSessionClient();
  if (!sessionClient) {
    redirect("/sign-in");
  }

  const { account } = sessionClient;
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({
  email,
}: {
  email: string;
}): Promise<AuthResult | undefined> => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({
        accountId: (existingUser as Models.Document & { accountId: string }).accountId,
      }) as AuthResult;
    }
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};

export const appwriteConfig = {
  endpointURL: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT_URL!,
  projectID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersCollectionID: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  filesCollectionID: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  bucketID: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretkey: process.env.NEXT_APPWRITE_SECRET!,
};

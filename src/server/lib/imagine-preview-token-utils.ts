/**
 * @imagine-hidden
 * @imagine-readonly
 */
import { setAppwriteSessionCookiesFn } from '@/server/functions/auth'
import { Account, Client, Models, Users } from 'node-appwrite'

export async function handleEmbeddedPreview(
  imaginePreviewToken: string,
): Promise<Models.User | null> {
  // If it is, we generate a session token for the user.
  let userId: string
  // First, we check if the token is valid and obtain the user ID
  const tokenUser =
    await getAppwriteUserFromImaginePreviewToken(imaginePreviewToken)
  userId = tokenUser.$id
  // Then, we generate a session for the user
  const session = await createUserSession(userId)
  // Then, we attach the session to the cookie
  setAppwriteSessionCookiesFn({
    data: { id: session.$id, secret: session.secret },
  })
  return tokenUser
}

async function createUserSession(userId: string) {
  const adminClient = getProjectAdminClient()
  const users = new Users(adminClient)
  const session = await users.createSession({ userId })
  return session
}

function getProjectAdminClient() {
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT!)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID!)
    .setKey(import.meta.env.VITE_APPWRITE_API_KEY!)
  return client
}

async function getAppwriteUserFromImaginePreviewToken(
  imaginePreviewToken: string,
) {
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT!)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID!)
    .setJWT(imaginePreviewToken)
  const account = new Account(client)
  const tokenUser = await account.get()
  return tokenUser
}

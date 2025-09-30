/**
 * @imagine-readonly
 * These should only be imported in server-side actions (SSR, functions).
 */

import { Client, Account } from 'node-appwrite'
import { getAppwriteSession } from './functions/auth'

const getAppwriteClientCredentials = () => {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
  if (!endpoint) {
    throw new Error('VITE_APPWRITE_ENDPOINT is not set')
  }

  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
  if (!projectId) {
    throw new Error('VITE_APPWRITE_PROJECT_ID is not set')
  }

  const apiKey = import.meta.env.VITE_APPWRITE_API_KEY
  if (!apiKey) {
    throw new Error('VITE_APPWRITE_API_KEY is not set')
  }

  return {
    endpoint,
    projectId,
    apiKey,
  }
}

export async function getCurrentUser() {
  const session = await getAppwriteSession()

  if (!session) {
    return null
  } else {
    const client = await createSessionClient(session!)
    const currentUser = await client.account.get()
    return currentUser
  }
}

export async function createSessionClient(session: string) {
  const { endpoint, projectId } = getAppwriteClientCredentials()
  const client = new Client().setEndpoint(endpoint).setProject(projectId)

  client.setSession(session)

  return {
    get account() {
      return new Account(client)
    },
  }
}

export async function createAdminClient() {
  const { endpoint, projectId, apiKey } = getAppwriteClientCredentials()
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  return {
    get account() {
      return new Account(client)
    },
  }
}

// export const setSessionCookie = createServerFn().handler(async (ctx) => {
//   const body = await ctx.body;
//   setCookie("appwrite-session", body.session);
// })

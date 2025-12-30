/**
 * @imagine-readonly
 * These should only be imported in server-side actions (SSR, functions).
 */

import { Client, Account, Storage, Users } from 'node-appwrite'

export function getAppwriteConfig() {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
  if (!endpoint) {
    throw new Error('VITE_APPWRITE_ENDPOINT is not set')
  }

  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
  if (!projectId) {
    throw new Error('VITE_APPWRITE_PROJECT_ID is not set')
  }

  return {
    endpoint,
    projectId,
  }
}

const getAppwriteClientCredentials = () => {
  const { endpoint, projectId } = getAppwriteConfig()

  const apiKey = process.env.APPWRITE_API_KEY
  if (!apiKey) {
    throw new Error('APPWRITE_API_KEY is not set')
  }

  return {
    endpoint,
    projectId,
    apiKey,
  }
}

export function getCookieName() {
  const { projectId } = getAppwriteConfig()
  return `a_session_${projectId}`
}

export function createSessionClient(session: string = '') {
  const { endpoint, projectId } = getAppwriteConfig()
  const client = new Client().setEndpoint(endpoint).setProject(projectId)

  if (session) {
    client.setSession(session)
  }

  return {
    client: client,
    account: new Account(client),
    users: new Users(client),
    storage: new Storage(client),
  }
}

export function createAdminClient(): {
  client: Client
  account: Account
} {
  const { endpoint, projectId, apiKey } = getAppwriteClientCredentials()
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  return {
    client: client,
    account: new Account(client),
  }
}

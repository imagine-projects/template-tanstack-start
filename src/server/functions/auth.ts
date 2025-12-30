import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { redirect } from '@tanstack/react-router'
import {
  createAdminClient,
  createSessionClient,
  getCookieName,
} from '../lib/appwrite'
import { AppwriteException, ID } from 'node-appwrite'
import {
  deleteCookie,
  getCookie,
  setCookie,
  setResponseStatus,
} from '@tanstack/react-start/server'

export const getAppwriteSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const name = getCookieName()
    const session = getCookie(name)

    if (!session) {
      return null
    }

    return session
  },
)

export const setAppwriteSessionCookiesFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ secret: z.string(), expire: z.iso.datetime({ offset: true }) }),
  )
  .handler(async ({ data }) => {
    const { secret } = data
    const isProduction = process.env.NODE_ENV === 'production'
    const name = getCookieName()
    setCookie(name, secret, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(data.expire),
    })
  })

const signUpInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  redirect: z.string().optional(),
})

export const signUpFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data
    const { account } = createAdminClient()

    try {
      await account.create({ userId: ID.unique(), email, password })
      const session = await account.createEmailPasswordSession({
        email,
        password,
      })
      await setAppwriteSessionCookiesFn({
        data: { secret: session.secret, expire: session.expire },
      })
    } catch (_error) {
      const error = _error as AppwriteException
      setResponseStatus(error.code)
      throw {
        message: error.message,
        status: error.code,
      }
    }

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data

    try {
      const { account } = createAdminClient()
      const session = await account.createEmailPasswordSession({
        email,
        password,
      })
      await setAppwriteSessionCookiesFn({
        data: { secret: session.secret, expire: session.expire },
      })
    } catch (_error) {
      const error = _error as AppwriteException
      setResponseStatus(error.code)
      throw {
        message: error.message,
        status: error.code,
      }
    }

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signOutFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await getAppwriteSessionFn()

    if (session) {
      const client = await createSessionClient(session)
      client.account.deleteSession({ sessionId: 'current' })
    }

    const name = getCookieName()
    deleteCookie(name)
  },
)

export const authMiddleware = createServerFn({ method: 'GET' }).handler(
  async () => {
    const currentUser = await getCurrentUser()

    return {
      currentUser,
    }
  },
)

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getAppwriteSessionFn()

    if (!session) {
      return null
    } else {
      const client = await createSessionClient(session)
      const currentUser = await client.account.get()
      return currentUser
    }
  },
)

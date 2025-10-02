import { handleEmbeddedPreview } from '@/.imagine/imagine-preview-token'
import {
  createAdminClient,
  createSessionClient,
  getCurrentUser,
} from '@/server/appwrite'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  deleteCookie,
  getCookie,
  getRequest,
  setCookie,
  setResponseStatus,
} from '@tanstack/react-start/server'
import { AppwriteException, ID } from 'node-appwrite'
import z from 'zod'

const signUpInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  redirect: z.string().optional(),
})

export const getAppwriteSession = createServerFn().handler(async () => {
  const session = getCookie(`appwrite-session-secret`)

  if (!session) {
    return null
  }

  return session
})

export const setSessionCookies = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string(),
      secret: z.string(),
    }),
  )
  .handler(async (ctx) => {
    setCookie(`appwrite-session-secret`, ctx.data.secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    setCookie(`appwrite-session-id`, ctx.data.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
  })

async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const { account } = await createAdminClient()
  const session = await account.createEmailPasswordSession({
    email,
    password,
  })

  setSessionCookies({ data: { id: session.$id, secret: session.secret } })
}

export const signUpFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async (ctx) => {
    const { email, password } = ctx.data
    const { account } = await createAdminClient()

    try {
      await account.create({ userId: ID.unique(), email, password })
      await signIn({ email, password })
    } catch (_error) {
      const error = _error as AppwriteException
      setResponseStatus(error.code)
      throw {
        message: error.message,
        status: error.code,
      }
    }

    if (ctx.data.redirect) {
      throw redirect({ to: ctx.data.redirect })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async (ctx) => {
    const { email, password } = ctx.data

    try {
      await signIn({ email, password })
    } catch (_error) {
      const error = _error as AppwriteException
      setResponseStatus(error.code)
      throw {
        message: error.message,
        status: error.code,
      }
    }

    if (ctx.data.redirect) {
      throw redirect({ to: ctx.data.redirect })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signOutFn = createServerFn().handler(async () => {
  const session = getCookie(`appwrite-session-secret`)

  if (session) {
    const { account } = await createSessionClient(session)
    await account.deleteSession({ sessionId: 'current' })
    deleteCookie(`appwrite-session-secret`)
    deleteCookie(`appwrite-session-id`)
  }

  throw redirect({ to: '/' })
})

export const authMiddleware = createServerFn().handler(async () => {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return {
      currentUser,
    }
  }

  const request = getRequest()
  const imaginePreviewToken = request.headers.get('x-imagine-preview-token')

  if (imaginePreviewToken) {
    const previewUser = await handleEmbeddedPreview(imaginePreviewToken)
    return {
      currentUser: previewUser,
    }
  }

  return {
    currentUser: null,
  }
})

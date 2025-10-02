import { handleEmbeddedPreview } from '@/.imagine/imagine-preview-token'
import {
  createAdminClient,
  createSessionClient,
  getCurrentUser,
} from '@/server/appwrite'
import { redirect } from '@tanstack/react-router'
import { createServerOnlyFn } from '@tanstack/react-start'
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

export const getAppwriteSession = createServerOnlyFn(async () => {
  const session = getCookie(`appwrite-session-secret`)

  if (!session) {
    return null
  }

  return session
})

export const setSessionCookies = createServerOnlyFn(
  async ({ id, secret }: { id: string; secret: string }) => {
    setCookie(`appwrite-session-secret`, secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })

    setCookie(`appwrite-session-id`, id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
  },
)

// export const setSessionCookies = createServerFn({ method: 'POST' })
//   .inputValidator(
//     z.object({
//       id: z.string(),
//       secret: z.string(),
//     }),
//   )
//   .handler(async (ctx) => {
//     setCookie(`appwrite-session-secret`, ctx.data.secret, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//     })

//     setCookie(`appwrite-session-id`, ctx.data.id, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//     })
//   })

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

  setSessionCookies({ id: session.$id, secret: session.secret })
}


export const signUpFn = createServerOnlyFn(async ({ email, password, redirect: redirectUrl }: { email: string, password: string, redirect: string }) => {
// export const signUpFn = createServerOnlyFn({ method: 'POST' })
  // .inputValidator(signUpInSchema)
  // .handler(async (ctx) => {
    // const { email, password } = ctx.data
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

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signInFn = createServerOnlyFn(async ({ email, password, redirect: redirectUrl }: { email: string, password: string, redirect: string }) => {

// export const signInFn = createServerOnlyFn({ method: 'POST' })
  // .inputValidator(signUpInSchema)
  // .handler(async (ctx) => {
    // const { email, password } = ctx.data

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

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signOutFn = createServerOnlyFn(async () => {
  const session = getCookie(`appwrite-session-secret`)

  if (session) {
    const { account } = await createSessionClient(session)
    await account.deleteSession({ sessionId: 'current' })
    deleteCookie(`appwrite-session-secret`)
    deleteCookie(`appwrite-session-id`)
  }

  throw redirect({ to: '/' })
})

export const authMiddleware = createServerOnlyFn(async () => {
  const currentUser = await getCurrentUser()

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


import { createSessionClient } from '@/server/appwrite'
import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { getAppwriteSession } from '@/server/functions/auth'

export const Route = createFileRoute('/_protected')({
  loader: async ({ location }) => {
    const session = await getAppwriteSession()

    if (!session) {
      if (
        location.pathname !== '/sign-in' &&
        location.pathname !== '/sign-up'
      ) {
        throw redirect({ to: '/sign-in', search: { redirect: location.href } })
      }
    }

    const client = await createSessionClient(session!)
    const currentUser = await client.account.get()

    return {
      currentUser,
    }
  },
})

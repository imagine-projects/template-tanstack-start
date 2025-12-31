import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  loader: async ({ location, parentMatchPromise }) => {
    const root = await parentMatchPromise
    const currentUser = root.loaderData?.currentUser

    if (currentUser && location.pathname !== '/sign-out') {
      throw redirect({ to: '/' })
    }

    return {
      currentUser,
    }
  },
})

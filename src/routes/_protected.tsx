import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  loader: async ({ location, parentMatchPromise }) => {
    const root = await parentMatchPromise
    const currentUser = root.loaderData?.currentUser

    if (!currentUser) {
      if (
        location.pathname !== '/sign-in' &&
        location.pathname !== '/sign-up'
      ) {
        throw redirect({ to: '/sign-in', search: { redirect: location.href } })
      }
    }

    return {
      currentUser,
    }
  },
})

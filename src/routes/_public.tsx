import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  loader: async ({ parentMatchPromise }) => {
    const root = await parentMatchPromise
    const currentUser = root.loaderData?.currentUser

    return {
      currentUser,
    }
  },
})


import { getCurrentUser } from '@/server/appwrite'
import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  loader: async () => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      throw redirect({ to: '/' });
    }

    return {
      currentUser,
    }
  },
})

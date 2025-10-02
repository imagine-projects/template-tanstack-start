import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { authMiddleware } from '@/server/functions/auth'

export const doSomethingFn = createServerFn({
  method: 'POST',
})
  .inputValidator(
    z.object({
      name: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()

    console.log('currentUser', currentUser)

    if (!currentUser) {
      throw new Error('Unauthorized')
    }

    return `Hello, ${data.name}! From appwrite`
  })

export const preloadDataFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return 'this is preloaded data'
})

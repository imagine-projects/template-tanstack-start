import { authQueryKey } from '@/lib/react-query/query-keys'
import { authMiddleware, signOutFn } from '@/server/functions/auth'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

export function useAuth() {
  const { data } = useQuery({
    queryKey: authQueryKey(),
    queryFn: () => authMiddleware(),
    staleTime: 30000, // 30 seconds
  })
  const signOut = useServerFn(signOutFn)

  return {
    currentUser: data?.currentUser,
    signOut,
  }
}

import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authQueryKey } from '@/lib/react-query/query-keys'

export function ImaginePlaceholder() {
  const { currentUser, signOut } = useAuth()
  const queryClient = useQueryClient()
  const location = useLocation()
  const navigate = useNavigate()

  const { theme } = useTheme()

  const signOutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: async () => {
      // Invalidate auth state so it will be refetched
      await queryClient.invalidateQueries({ queryKey: authQueryKey() })
      // Navigate to the sign-in page
      await navigate({ to: '/sign-in' })
    },
  })

  return (
    <div className="flex-grow flex flex-col justify-center items-center gap-6 text-center">
      <img
        src={
          theme === 'dark'
            ? '/imagine-logo-dark.svg'
            : '/imagine-logo-light.svg'
        }
        alt="Imagine Logo"
        className="size-14"
      />

      {currentUser ? (
        <>
          <p className="text-foreground/70">
            You are signed in as{' '}
            <span className="font-medium">{currentUser.email}</span>
          </p>
          <Button
            size="sm"
            onClick={() => signOutMutation.mutate()}
            disabled={signOutMutation.isPending}
          >
            {signOutMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing out...
              </div>
            ) : (
              'Sign out'
            )}
          </Button>
        </>
      ) : (
        <>
          <p className="text-foreground/70">You are not signed in.</p>
          <Link
            to="/sign-in"
            search={{
              redirect: location.pathname,
            }}
            className="text-blue-500 underline"
          >
            <Button size="sm">Sign in</Button>
          </Link>
        </>
      )}
    </div>
  )
}

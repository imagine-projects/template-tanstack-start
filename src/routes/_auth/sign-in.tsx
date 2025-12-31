/**
 * @imagine-readonly
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { z } from 'zod'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthField } from '@/components/auth/auth-field'
import { signInFn } from '@/server/functions/auth'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authQueryKey } from '@/lib/react-query/query-keys'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInPage,
  validateSearch: searchSchema,
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

function SignInPage() {
  const search = useSearch({ from: '/_auth/sign-in' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const signIn = useServerFn(signInFn)
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signInMutation = useMutation({
    mutationFn: (data: z.infer<typeof signInSchema>) =>
      signIn({ data: { ...data } }),
    onSuccess: async () => {
      // Invalidate auth state so it will be refetched
      await queryClient.invalidateQueries({ queryKey: authQueryKey() })
      // Navigate to the redirect destination if provided
      if (search.redirect) {
        await navigate({ to: search.redirect })
      }
    },

    onError: async (error: {
      status: number
      redirect: boolean
      message: string
    }) => {
      console.error('Sign in error:', error)
      form.setError('root', { message: error.message || 'Failed to sign in' })
    },
  })

  return (
    <AuthCard
      title="Sign in"
      description="Enter your email and password to access your account"
    >
      <AuthForm
        schema={signInSchema}
        defaultValues={{
          email: '',
          password: '',
        }}
        onSubmit={(data) => signInMutation.mutate(data)}
        submitText="Sign in"
        loadingText="Signing in..."
        isLoading={signInMutation.isPending}
        form={form}
      >
        {(form) => (
          <>
            <AuthField
              control={form.control}
              name="email"
              label="Email"
              placeholder="john@doe.com"
              type="email"
            />

            <AuthField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
          </>
        )}
      </AuthForm>

      <div className="text-center text-sm text-muted-foreground mt-4 space-x-1">
        <div className="inline-block">Don't have an account? </div>
        <div className="inline-block">
          <Link
            to="/sign-up"
            search={search.redirect ? { redirect: search.redirect } : undefined}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthCard>
  )
}

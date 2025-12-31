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
import { signUpFn } from '@/server/functions/auth'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authQueryKey } from '@/lib/react-query/query-keys'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpPage,
  validateSearch: searchSchema,
})

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

function SignUpPage() {
  const search = useSearch({ from: Route.id })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const signUp = useServerFn(signUpFn)
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signUpMutation = useMutation({
    mutationFn: async (data: z.infer<typeof signUpSchema>) => {
      await signUp({
        data: { ...data },
      })
    },
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
      console.error('Sign up error:', error)
      form.setError('root', { message: error.message || 'Failed to sign up' })
    },
  })

  return (
    <AuthCard
      title="Sign up"
      description="Enter your details to create a new account"
    >
      <AuthForm
        schema={signUpSchema}
        defaultValues={{
          email: '',
          password: '',
        }}
        onSubmit={(data) => signUpMutation.mutate(data)}
        submitText="Sign up"
        loadingText="Signing up..."
        isLoading={signUpMutation.isPending}
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
        <div className="inline-block">Already have an account? </div>
        <div className="inline-block">
          <Link
            to="/sign-in"
            search={search.redirect ? { redirect: search.redirect } : undefined}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  )
}

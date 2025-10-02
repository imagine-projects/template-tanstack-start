import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/example-protected-route')({
  component: RouteComponent,
})

function RouteComponent({}) {
  const { currentUser } = useLoaderData({ from: '/_protected' })
  return <div>Protected {currentUser?.email}</div>
}

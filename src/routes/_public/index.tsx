import { ImaginePlaceholder } from '@/components/imagine-placeholder'
import { ClientOnly } from '@/components/client-only'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  component: Index,
})

function Index() {
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <ImaginePlaceholder />
    </ClientOnly>
  )
}

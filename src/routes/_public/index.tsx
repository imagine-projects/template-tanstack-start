import { ImaginePlaceholder } from '@/components/imagine-placeholder'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useServerFn } from '@tanstack/react-start'
import { doSomethingFn, preloadDataFn } from '@/server/functions/do-something'
import { useState } from 'react'

export const Route = createFileRoute('/_public/')({
  component: Index,
  loader: async () => {
    const preloadedData = await preloadDataFn()
    return {
      preloadedData,
    }
  },
})

function Index() {
  const [str, setStr] = useState('NOT YET DEFINED')
  const doSomething = useServerFn(doSomethingFn)
  const { preloadedData } = useLoaderData({ from: Route.id })

  const handleSomething = async () => {
    const result = await doSomething({ data: { name: 'John Doe' } })
    setStr(result)
  }

  return (
    <div className="min-h-screen flex flex-col p-8">
      <ImaginePlaceholder />
      <div>
        <Button onClick={handleSomething}>Do something</Button>
        <div>String: {str}</div>
        <div>Preloaded data: {preloadedData}</div>
      </div>
    </div>
  )
}

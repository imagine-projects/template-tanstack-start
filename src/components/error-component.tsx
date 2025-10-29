import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { SparklesIcon } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'

export function ErrorComponent({
  error,
  info,
}: {
  error: Error
  info?: { componentStack: string }
  reset: () => void
}) {
  const { theme } = useTheme()
  const location = useLocation()

  const handleFix = () => {
    const data = {
      href: location.href,
      errorMessage: error.message,
      errorStack: error.stack,
      errorCause: error.cause,
      errorComponentStack: info?.componentStack,
    }

    // Post message to parent
    window.parent.postMessage(
      {
        type: 'fix-error',
        data,
      },
      '*',
    ) as unknown as MessageEvent

    const fixErrorsFn = (window as any)?.imagineFixError

    if (fixErrorsFn) {
      fixErrorsFn(data)
    }
  }

  return (
    <div className="flex-grow flex flex-col justify-center items-center gap-6 text-center my-20">
      <img
        src={
          theme === 'dark'
            ? '/imagine-logo-dark.svg'
            : '/imagine-logo-light.svg'
        }
        alt="Imagine Logo"
        className="size-14"
      />

      <h1 className="text-2xl font-medium">Oops! Something went wrong.</h1>

      <div>
        <pre className="text-xs border border-red-500 p-2 text-red-500 overflow-auto rounded-md">
          {error.message ? <code>{error.message}</code> : null}
        </pre>
      </div>

      <Button onClick={handleFix} className="cursor-pointer">
        <SparklesIcon />
        Fix it!
      </Button>
    </div>
  )
}

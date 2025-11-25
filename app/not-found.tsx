import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold mb-4">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">
        Go back home
      </Link>
    </div>
  )
}

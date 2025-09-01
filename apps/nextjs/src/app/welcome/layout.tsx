import Link from "next/link"

import Logo from "~/components/svg/logo"

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <header className="flex h-16 items-center justify-center">
        <Link href="/">
          <Logo className="h-7 w-auto" />
        </Link>
      </header>
      <main className="flex w-full flex-1 items-center justify-center py-16">{props.children}</main>
    </div>
  )
}

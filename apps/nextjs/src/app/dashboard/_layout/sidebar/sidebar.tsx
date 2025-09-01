"use client"

import type { Dispatch, FC, ReactNode, SetStateAction } from "react"
import { createContext, Suspense, useContext, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useQuery } from "@tanstack/react-query"
import { ChevronsUpDown, Database, FileText, FolderOpen, LifeBuoy, LogOut, Megaphone, Menu, PlusCircle, Search, Settings } from "lucide-react"
import posthog from "posthog-js"

import type { RouterOutputs } from "@acme/api"
import { Avatar, avatarImageVariants, AvatarTextFallback } from "@acme/ui/avatar"
import * as Command from "@acme/ui/command"
import { Dialog, DialogOverlay, DialogPortal, DialogTrigger } from "@acme/ui/dialog"
import * as DropdownMenu from "@acme/ui/dropdown-menu"
import { Kbd } from "@acme/ui/kbd"
import { cn } from "@acme/ui/lib/utils"

import { authClient } from "~/auth/client"
import { useTRPC } from "~/trpc/react"
import { getInitials } from "~/utils/profile"
import { useDashboardContext } from "~/utils/zustand/dashboard-store"

type Organization = RouterOutputs["organization"]["me"][number]
type Profile = RouterOutputs["profile"]["me"]

type SidebarContextProps = {
  profile: Profile
  organizations: Organization[]
  showMobileSidebar: boolean
  setShowMobileSidebar: Dispatch<SetStateAction<boolean>>
  currentOrganization: Organization
  createOrganizationDialogOpen: boolean
  setCreateOrganizationDialogOpen: Dispatch<SetStateAction<boolean>>
}
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

type SidebarProviderProps = {
  organizations: Organization[]
  profile: Profile
  children: ReactNode
}
const SidebarProvider: FC<SidebarProviderProps> = ({ organizations, profile, children }) => {
  const trpc = useTRPC()

  const organizationMe = useQuery(trpc.organization.me.queryOptions(undefined, { initialData: organizations }))
  const profileMe = useQuery(trpc.profile.me.queryOptions(undefined, { initialData: profile }))

  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false)
  const [createOrganizationDialogOpen, setCreateOrganizationDialogOpen] = useState<boolean>(false)
  const currentOrganizationId = useDashboardContext((state) => state.currentOrganizationId)

  const currentOrganization = organizationMe.data.find((o) => o.id === currentOrganizationId)
  if (!currentOrganization) {
    throw new Error(`Organization with ID ${currentOrganizationId} not found.`)
  }

  useEffect(() => {
    if (profile.email) {
      void posthog.identify(profile.email)
    }
  }, [profile.email])

  return (
    <SidebarContext.Provider
      value={{
        organizations: organizationMe.data,
        profile: profileMe.data,
        showMobileSidebar,
        setShowMobileSidebar,
        currentOrganization,
        createOrganizationDialogOpen,
        setCreateOrganizationDialogOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext)

  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

type NagivationItem = {
  name: string
  href: string
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

const navigationTop: NagivationItem[] = [
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Documents", href: "/dashboard/documents", icon: Database },
  { name: "Snippets", href: "/dashboard/snippets", icon: FileText },
]

const navigationBottom: NagivationItem[] = [
  { name: "Support", href: "mailto:support@acme.com", icon: LifeBuoy },
  {
    name: "Feedback",
    href: "mailto:feedback@acme.com",
    icon: Megaphone,
  },
  // {
  //   name: "Changelog",
  //   href: "#",
  //   icon: Sparkle,
  // },
]

const SidebarContent: FC = () => {
  const pathname = usePathname()

  return (
    <>
      {/* Organization */}
      <OrganizationDropdown />

      {/* Searchbar */}
      <Searchbar />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col justify-between gap-1 pb-4">
        <ul role="list" className="flex flex-col gap-1 px-4">
          {navigationTop.map((item) => (
            <NavItem key={item.name} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </ul>

        <ul role="list" className="flex flex-col gap-1 px-4">
          {navigationBottom.map((item) => (
            <NavItem key={item.name} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </ul>
      </nav>

      {/* User */}
      <UserDropdown />
    </>
  )
}

const SidebarDesktop: FC = () => {
  return (
    <div
      className={cn(
        "hidden",
        "sm:flex sm:flex-1 sm:flex-col sm:overflow-y-auto",
        "sm:w-64 sm:max-w-64 sm:min-w-64",
        "sm:border-r sm:border-neutral-100",
      )}
    >
      <SidebarContent />
    </div>
  )
}

const SidebarMobile: FC = () => {
  const { showMobileSidebar, setShowMobileSidebar, createOrganizationDialogOpen, currentOrganization } = useSidebar()

  return (
    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2 sm:hidden">
      <Link href="/" className="group flex h-10 items-center gap-2.5 rounded-lg focus:outline-none">
        <Avatar size="sm" variant="rounded">
          {currentOrganization.logo ? (
            <Suspense fallback={<AvatarTextFallback>{getInitials(currentOrganization.name)}</AvatarTextFallback>}>
              <Image
                width={24 * 2}
                height={24 * 2}
                quality={100}
                src={currentOrganization.logo}
                alt={currentOrganization.name}
                style={{ objectFit: "cover" }}
                className={avatarImageVariants({ size: "sm", variant: "rounded" })}
              />
            </Suspense>
          ) : (
            <AvatarTextFallback>{getInitials(currentOrganization.name)}</AvatarTextFallback>
          )}
        </Avatar>

        <p className="truncate text-sm font-medium">{currentOrganization.name}</p>
        <span className="sr-only">{currentOrganization.name}</span>
      </Link>
      <Dialog open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group -mr-2.5 flex size-10 items-center justify-center text-gray-700 lg:hidden"
            onClick={() => setShowMobileSidebar(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="size-5 shrink-0 text-neutral-500 group-hover:text-neutral-900" aria-hidden="true" />
          </button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 bg-white shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
              "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full",
              "overflow-y-auto",
              "flex flex-1 flex-col",
              "w-64 max-w-64 min-w-0",
              "border-r border-neutral-200",
            )}
            hidden={createOrganizationDialogOpen}
            onCloseAutoFocus={(e) => {
              if (createOrganizationDialogOpen) {
                e.preventDefault()
              }
            }}
          >
            <SidebarContent />
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  )
}

type NavItemProps = {
  item: NagivationItem
  isActive: boolean
}
const NavItem: FC<NavItemProps> = ({ item, isActive }) => {
  const { setShowMobileSidebar } = useSidebar()

  return (
    <li onClick={() => setShowMobileSidebar(false)}>
      <Link
        href={item.href}
        className={cn(
          "group flex h-9 items-center gap-2.5 rounded-lg border border-transparent p-2 text-sm font-medium focus:outline-none focus-visible:outline-current",
          isActive ? "border-neutral-200 bg-neutral-50 text-neutral-900 shadow-xs" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-600",
        )}
      >
        <item.icon
          className={cn("size-4 shrink-0 transition", isActive ? "text-neutral-900" : "text-neutral-400 group-hover:text-neutral-500")}
          aria-hidden="true"
        />
        {item.name}
      </Link>
    </li>
  )
}

const OrganizationDropdown: FC = () => {
  const { organizations, setShowMobileSidebar, createOrganizationDialogOpen, setCreateOrganizationDialogOpen, currentOrganization } = useSidebar()
  const { updateCurrentOrganizationId } = useDashboardContext((state) => state)

  return (
    <div className="flex shrink-0 border-b border-neutral-100 p-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-neutral-100 focus:outline-none"
          >
            <Avatar size="sm" variant="rounded">
              {currentOrganization.logo ? (
                <Suspense fallback={<AvatarTextFallback>{getInitials(currentOrganization.name)}</AvatarTextFallback>}>
                  <Image
                    width={24 * 2}
                    height={24 * 2}
                    quality={100}
                    src={currentOrganization.logo}
                    alt="Organization logo"
                    style={{ objectFit: "cover" }}
                    className={avatarImageVariants({ size: "sm", variant: "rounded" })}
                  />
                </Suspense>
              ) : (
                <AvatarTextFallback>{getInitials(currentOrganization.name)}</AvatarTextFallback>
              )}
            </Avatar>

            <div className="flex w-full min-w-0 items-center justify-between gap-2">
              <p className="truncate text-sm font-medium">{currentOrganization.name}</p>
              <ChevronsUpDown strokeWidth={1.5} className="size-4 shrink-0 text-neutral-400 transition group-hover:text-neutral-600" />
            </div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          hidden={createOrganizationDialogOpen}
          onCloseAutoFocus={(e) => {
            if (createOrganizationDialogOpen) {
              e.preventDefault()
            }
          }}
        >
          <DropdownMenu.Group>
            <DropdownMenu.Item onSelect={(_e) => setShowMobileSidebar(false)} asChild>
              <Link href="/organization/general">
                <DropdownMenu.ItemIcon>
                  <Settings />
                </DropdownMenu.ItemIcon>
                <DropdownMenu.ItemLabel>Organization settings</DropdownMenu.ItemLabel>
                <DropdownMenu.ItemShortcut>⇧⌘P</DropdownMenu.ItemShortcut>
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <DropdownMenu.RadioGroup
            value={currentOrganization.id}
            onValueChange={(organizationId) => {
              updateCurrentOrganizationId(organizationId)
              window.location.href = "/"
            }}
          >
            {organizations.map((organization) => (
              <DropdownMenu.RadioItem key={organization.id} value={organization.id}>
                <Avatar size="xxs" variant="rounded">
                  {organization.logo ? (
                    <Suspense fallback={<AvatarTextFallback>{getInitials(organization.name)}</AvatarTextFallback>}>
                      <Image
                        width={16 * 2}
                        height={16 * 2}
                        quality={100}
                        src={organization.logo}
                        alt={organization.name}
                        style={{ objectFit: "cover" }}
                        className={avatarImageVariants({ size: "xxs", variant: "rounded" })}
                      />
                    </Suspense>
                  ) : (
                    <AvatarTextFallback>{getInitials(organization.name)}</AvatarTextFallback>
                  )}
                </Avatar>

                {organization.name}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator />

          <DropdownMenu.Group>
            <DropdownMenu.Item
              variant="primary"
              onSelect={(_e) => {
                setShowMobileSidebar(false)
                setCreateOrganizationDialogOpen(true)
              }}
            >
              <DropdownMenu.ItemIcon>
                <PlusCircle />
              </DropdownMenu.ItemIcon>
              <DropdownMenu.ItemLabel>Create organization</DropdownMenu.ItemLabel>
              <DropdownMenu.ItemShortcut>⇧⌘N</DropdownMenu.ItemShortcut>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

const Searchbar: FC = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="flex shrink-0 p-4">
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group h-9 w-full items-center rounded-lg p-2 shadow-xs transition",
          "flex justify-between gap-2",
          "text-sm text-neutral-400",
          "border border-neutral-200",
          "hover:bg-neutral-50",
          "focus-within:ring-3 focus-within:ring-neutral-900/[.04] focus:outline-none focus-visible:outline-current",
        )}
      >
        <div className="flex items-center gap-2">
          <Search aria-hidden className={cn("size-4 shrink-0 transition", "text-neutral-400 group-hover:text-neutral-500")} />
          Search...
        </div>
        <Kbd>⌘K</Kbd>
      </button>

      <Command.Root open={open} onOpenChange={setOpen}>
        <Command.Content>
          <Command.Command>
            <Command.Input placeholder="Type a command or search..." />
            <Command.List>
              <Command.Empty className="flex flex-col items-center gap-4">
                <Search className="size-5" />
                <span>No results found.</span>
              </Command.Empty>

              <Command.Group heading={"Navigate"}>
                {navigationTop.map((navigation) => (
                  <Command.Item key={navigation.href}>
                    <Command.ItemIcon>
                      <navigation.icon />
                    </Command.ItemIcon>
                    <Command.ItemLabel className="truncate">{navigation.name}</Command.ItemLabel>
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Separator />

              <Command.Group heading={"Help"}>
                {navigationBottom.map((navigation) => (
                  <Command.Item key={navigation.href}>
                    <Command.ItemIcon>
                      <navigation.icon />
                    </Command.ItemIcon>
                    <Command.ItemLabel className="truncate">{navigation.name}</Command.ItemLabel>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>

            <Command.Footer>
              <Command.FooterItem>
                <Command.FooterItemLabel>Close</Command.FooterItemLabel>
                <Kbd>ESC</Kbd>
              </Command.FooterItem>

              <Command.FooterItem className="ml-auto">
                <Command.FooterItemLabel>Navigate</Command.FooterItemLabel>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </Command.FooterItem>
              <Command.FooterItem>
                <Command.FooterItemLabel>Select</Command.FooterItemLabel>
                <Kbd>↵</Kbd>
              </Command.FooterItem>
            </Command.Footer>
          </Command.Command>
        </Command.Content>
      </Command.Root>
      {/*      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Taper une commande ou rechercher..." />
        <CommandList>
          <CommandEmpty className="flex flex-col items-center gap-4">
            <Search className="size-5" />
            <span>Aucun résultat trouvé.</span>
          </CommandEmpty>

          <CommandGroup heading={"Navigate"}>
            {navigationTop.map((navigation) => (
              <CommandItem key={navigation.href}>
                <CommandItemIcon>
                  <navigation.icon />
                </CommandItemIcon>
                <span className="truncate">{navigation.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading={"Help"}>
            {navigationBottom.map((navigation) => (
              <CommandItem key={navigation.href}>
                <CommandItemIcon>
                  <navigation.icon />
                </CommandItemIcon>
                <span className="truncate">{navigation.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>

        <CommandFooter>
          <CommandFooterItem>
            <span>Fermer</span>
            <Kbd>ESC</Kbd>
          </CommandFooterItem>

          <CommandFooterItem className="ml-auto">
            <span>Naviguer</span>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
          </CommandFooterItem>
          <CommandFooterItem>
            <span>Sélectionner</span>
            <Kbd>↵</Kbd>
          </CommandFooterItem>
        </CommandFooter>
      </CommandDialog> */}
    </div>
  )
}

const UserDropdown: FC = () => {
  const { setShowMobileSidebar, profile } = useSidebar()

  return (
    <div className="flex shrink-0 border-t border-neutral-100 p-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-neutral-100 focus:outline-none"
          >
            <Avatar size="md" variant="squared">
              {profile.avatar ? (
                <Suspense fallback={<AvatarTextFallback>{getInitials(`${profile.name}`)}</AvatarTextFallback>}>
                  <Image
                    width={32 * 2}
                    height={32 * 2}
                    quality={100}
                    src={profile.avatar}
                    alt={`${profile.name}`}
                    style={{ objectFit: "cover" }}
                    className={avatarImageVariants({ size: "md", variant: "squared" })}
                  />
                </Suspense>
              ) : (
                <AvatarTextFallback>{getInitials(`${profile.name}`)}</AvatarTextFallback>
              )}
            </Avatar>

            <div className="flex w-full min-w-0 items-center justify-between gap-2">
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">{`${profile.name}`}</p>
                <p className="truncate text-xs text-neutral-500">{profile.email}</p>
              </div>
              <ChevronsUpDown strokeWidth={1.5} className="size-4 shrink-0 text-neutral-400 transition group-hover:text-neutral-600" />
            </div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item onSelect={(_e) => setShowMobileSidebar(false)} asChild>
              <Link href="/account/my-details">
                <DropdownMenu.ItemIcon>
                  <Settings />
                </DropdownMenu.ItemIcon>
                <DropdownMenu.ItemLabel>Account settings</DropdownMenu.ItemLabel>
                <DropdownMenu.ItemShortcut>⇧⌘L</DropdownMenu.ItemShortcut>
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator />

          <DropdownMenu.Group>
            <DropdownMenu.Item
              variant="destructive"
              onSelect={async (_e) => {
                await authClient.signOut()
                window.location.href = "/signin"
              }}
            >
              <DropdownMenu.ItemIcon>
                <LogOut />
              </DropdownMenu.ItemIcon>
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export { SidebarProvider, SidebarDesktop, SidebarMobile }

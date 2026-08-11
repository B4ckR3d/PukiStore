"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronUp,
  Warehouse,
  ArrowDownToLine,
  Home,
  Shield,
} from "lucide-react";
import type { UserRole } from "@/types";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "SELLER", "CLIENT"],
  },
  {
    title: "Pesanan",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    roles: ["ADMIN", "SELLER", "CLIENT"],
  },
  {
    title: "Produk",
    href: "/dashboard/products",
    icon: Package,
    roles: ["ADMIN", "SELLER"],
  },
  {
    title: "Transaksi",
    href: "/dashboard/transactions",
    icon: CreditCard,
    roles: ["ADMIN", "SELLER", "CLIENT"],
  },
];

const adminItems: NavItem[] = [
  {
    title: "Pengguna",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Kategori",
    href: "/dashboard/admin/categories",
    icon: Tags,
    roles: ["ADMIN"],
  },
  {
    title: "Pembayaran",
    href: "/dashboard/admin/payments",
    icon: CreditCard,
    roles: ["ADMIN"],
  },
  {
    title: "Laporan",
    href: "/dashboard/admin/reports",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
];

const sellerItems: NavItem[] = [
  {
    title: "Toko Saya",
    href: "/dashboard/seller/store",
    icon: Store,
    roles: ["SELLER"],
  },
  {
    title: "Inventori",
    href: "/dashboard/seller/inventory",
    icon: Warehouse,
    roles: ["SELLER"],
  },
  {
    title: "Penarikan",
    href: "/dashboard/seller/withdraw",
    icon: ArrowDownToLine,
    roles: ["SELLER"],
  },
];

function NavSection({
  label,
  items,
  userRole,
  pathname,
}: {
  label: string;
  items: NavItem[];
  userRole: string;
  pathname: string;
}) {
  const filtered = items.filter((item) =>
    item.roles.includes(userRole as UserRole)
  );

  if (filtered.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {filtered.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                render={<Link href={item.href} />}
                isActive={
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                }
                tooltip={item.title}
              >
                <item.icon />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="ml-auto text-[10px] px-1.5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userRole = (session?.user?.role as string) || "CLIENT";

  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    SELLER: "Seller",
    CLIENT: "Client",
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-500/15 text-red-400",
    SELLER: "bg-blue-500/15 text-blue-400",
    CLIENT: "bg-emerald-500/15 text-emerald-400",
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Store className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold text-sm">PUKI STORE</span>
                <Badge
                  variant="outline"
                  className={`w-fit text-[10px] px-1.5 py-0 ${roleColors[userRole] || ""}`}
                >
                  <Shield className="mr-1 h-2.5 w-2.5" />
                  {roleLabels[userRole] || userRole}
                </Badge>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavSection
          label="Menu Utama"
          items={navItems}
          userRole={userRole}
          pathname={pathname}
        />

        {userRole === "ADMIN" && (
          <NavSection
            label="Admin Panel"
            items={adminItems}
            userRole={userRole}
            pathname={pathname}
          />
        )}

        {(userRole === "SELLER" || userRole === "ADMIN") && (
          <NavSection
            label="Seller Panel"
            items={sellerItems}
            userRole={userRole}
            pathname={pathname}
          />
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/dashboard/settings" />} tooltip="Pengaturan">
                  <Settings />
                  <span>Pengaturan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/" />} tooltip="Kembali ke Toko">
                  <Home />
                  <span>Kembali ke Toko</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left outline-none">
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none text-left">
                    <span className="text-sm font-medium truncate">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => window.location.href = "/dashboard/settings"}>
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/40 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}


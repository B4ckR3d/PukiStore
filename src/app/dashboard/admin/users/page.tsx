"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MoreHorizontal, Shield, UserPlus } from "lucide-react";

const mockUsers = [
  { id: "1", name: "Ahmad Rizki", email: "ahmad@example.com", role: "CLIENT", isActive: true, createdAt: "2026-08-01" },
  { id: "2", name: "Siti Nurhaliza", email: "siti@example.com", role: "SELLER", isActive: true, createdAt: "2026-07-15" },
  { id: "3", name: "Budi Santoso", email: "budi@example.com", role: "ADMIN", isActive: true, createdAt: "2026-06-20" },
  { id: "4", name: "Dewi Lestari", email: "dewi@example.com", role: "CLIENT", isActive: false, createdAt: "2026-08-05" },
  { id: "5", name: "Eko Prasetyo", email: "eko@example.com", role: "SELLER", isActive: true, createdAt: "2026-07-28" },
];

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-500/15 text-red-400 border-red-500/30",
  SELLER: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CLIENT: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengguna</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola semua pengguna platform
          </p>
        </div>
        <Button className="gradient-primary text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari pengguna..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${roleColors[user.role]}`}>
                      <Shield className="mr-1 h-3 w-3" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Ubah Role</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

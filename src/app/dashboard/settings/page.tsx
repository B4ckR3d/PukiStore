"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  const roleLabels: Record<string, string> = {
    ADMIN: "Administrator",
    SELLER: "Seller",
    CLIENT: "Client",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola akun dan preferensi Anda
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                <Shield className="mr-1 h-3 w-3" />
                {roleLabels[session?.user?.role || "CLIENT"]}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                defaultValue={session?.user?.name || ""}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={session?.user?.email || ""}
                disabled
              />
            </div>
          </div>

          <Button className="gradient-primary text-white">
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

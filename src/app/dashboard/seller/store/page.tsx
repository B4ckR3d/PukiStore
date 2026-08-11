"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Store, ShieldCheck, ImagePlus } from "lucide-react";

export default function SellerStorePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Toko Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi toko Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil Toko</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Store Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                <Store className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG max 2MB
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nama Toko</Label>
              <Input id="store-name" placeholder="Nama toko Anda" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-desc">Deskripsi</Label>
              <Textarea
                id="store-desc"
                placeholder="Ceritakan tentang toko Anda..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-400">
                Status Verifikasi
              </p>
              <p className="text-xs text-muted-foreground">
                Toko Anda belum diverifikasi. Hubungi admin untuk verifikasi.
              </p>
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

"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Store, Loader2, ArrowLeft } from "lucide-react";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Set initial countdown on mount
  useEffect(() => {
    setCountdown(60);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = useCallback(async () => {
    if (isSending || countdown > 0) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal mengirim OTP");
        return;
      }

      toast.success("Kode OTP berhasil dikirim ke email Anda");
      setCountdown(60);
    } catch {
      toast.error("Gagal mengirim OTP");
    } finally {
      setIsSending(false);
    }
  }, [email, isSending, countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    if (value.length > 1) {
      // Handle paste
      const digits = value.split("").slice(0, 6);
      digits.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(index + digits.length, 5);
      inputRefs.current[focusIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Auto-submit when all fields are filled
    const code = newOtp.join("");
    if (code.length === 6) {
      handleVerify(code);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Kode OTP tidak valid");
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      toast.success("Email berhasil diverifikasi!");
      router.push("/dashboard");
    } catch {
      toast.error("Gagal memverifikasi OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[420px]"
    >
      <Card className="border-border/50 shadow-2xl shadow-primary/5">
        <CardHeader className="text-center pb-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2.5 mb-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Store className="h-5 w-5 text-white" />
            </div>
          </Link>
          <h1 className="text-xl font-bold">Verifikasi Email</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan kode 6 digit yang dikirim ke
          </p>
          <p className="text-sm font-medium text-primary">{email}</p>
        </CardHeader>

        <CardContent className="pt-4">
          {/* OTP Input */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-14 w-11 sm:w-12 text-center text-lg font-bold rounded-lg border-border/60 focus:border-primary focus:ring-primary"
                disabled={isVerifying}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            className="w-full h-11 gradient-primary text-white mb-4"
            onClick={() => handleVerify(otp.join(""))}
            disabled={isVerifying || otp.join("").length !== 6}
          >
            {isVerifying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Verifikasi
          </Button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Tidak menerima kode?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendOTP}
              disabled={countdown > 0 || isSending}
            >
              {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {countdown > 0
                ? `Kirim ulang (${countdown}s)`
                : "Kirim Ulang OTP"}
            </Button>
          </div>

          {/* Back Link */}
          <div className="text-center mt-4 pt-4 border-t border-border/40">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Kembali ke Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}

"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";

type OTPModalProps = {
  email: string;
  accountId: string;
  onClose: () => void;
};

const OTPModal = ({ email, accountId, onClose }: OTPModalProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const sessionId = await verifySecret({ accountId, password });
      if (sessionId) router.push("/");
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <>
      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) onClose();
        }}
      >
        <AlertDialogContent className="shad-alert-dialog flex flex-col gap-4 ">
          <AlertDialogHeader className="relative flex justify-center">
            <AlertDialogTitle className="h2 text-center flex justify-start gap-30">
              <Image
                src="/assets/icons/close-dark.svg"
                alt="close"
                width={20}
                height={20}
                onClick={() => setIsOpen(false)}
                className="otp-close-button"
              />
              Enter your OTP
            </AlertDialogTitle>
            <AlertDialogDescription className="subtitle-2 text-center text-light-100">
              We&apos;ve sent a code to{" "}
              <span className="font-bold text-dark-100 text-md">{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup className="shad-otp mx-auto">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          <AlertDialogFooter className="px-4">
            <div className="flex w-full flex-col gap-2">
              <AlertDialogAction
                onClick={handleSubmit}
                className="shadcn-submit-btn h-12 cursor-pointer"
                type="button"
              >
                Submit
                {isLoading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </AlertDialogAction>
              <div className="subtitle-2 mb-1 text-center text-light-100">
                Didn&apos;t receive the code?{" "}
                <Button
                  onClick={handleResendOTP}
                  type="button"
                  variant="link"
                  className="pl-1 text-brand cursor-pointer"
                >
                  Resend
                </Button>
              </div>
              <AlertDialogCancel
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
                className="cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OTPModal;

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";

const OTPModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
    setIsLoading(false);
  };

  const handleResendOTP = () => {
    //API call to resend OTP
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="shad-alert-dialog">
          <AlertDialogHeader className="relative flex justify-center">
            <AlertDialogTitle className="h2 text-center">
              Enter your OTP
              <Image
                src="../public/assets/icons/close-dark.svg"
                alt="close"
                width={20}
                height={20}
                onClick={() => setIsOpen(false)}
                className="otp-close-button"
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="subtitle-2 text-center text-light-100">
              We&apos;ve sent a code to <span>{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          <AlertDialogFooter>
            <div className="flex w-full flex-col gap-4">
              <AlertDialogAction
                onClick={handleSubmit}
                className="shadcn-submit-btn h-12"
                type="button"
              >
                Submit
                {isLoading && (
                  <Image
                    src="../public/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </AlertDialogAction>
              <div className="subtitle-2 mt-2 text-center text-light-100">
                Didn&apos;t receive the code?{" "}
                <Button
                  onClick={handleResendOTP}
                  type="button"
                  variant="link"
                  className="pl-1 text-brand"
                >
                  Resend
                </Button>
              </div>
            </div>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OTPModal;

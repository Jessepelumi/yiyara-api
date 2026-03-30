"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

export default function Login() {
  const [showOtpField, setShowOtpField] = useState(false);
  const [email, setEmail] = useState("");

  const handleAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpField) {
      // TODO: implement logic to trigger Django OTP email
      setShowOtpField(true);
    } else {
      // TODO: implement logic to verify OTP
      console.log("Verifying code for email:", email);
    }
  };

  return (
    <div className="h-dvh w-full flex justify-center items-center flex-col">
      <form onSubmit={handleAuthentication} className="w-full px-5 md:px-0 max-w-md">
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="font-bold text-2xl!">Get Started</FieldLegend>
            <FieldDescription>Sign in or Sign up here</FieldDescription>
            <FieldGroup>
              <Button
                onClick={() => signIn("google", { callbackUrl: "/home" })}
                variant="outline"
                type="button"
              >
                <Image
                  src="/google-logo.png"
                  alt="google logo"
                  height={18}
                  width={18}
                />
                <span>Continue with Google</span>
              </Button>

              <div className="flex items-center space-x-3">
                <FieldSeparator className="flex grow" /> <span>OR</span>{" "}
                <FieldSeparator className="flex grow" />
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="productivedoe@zimna.com"
                  required
                  disabled={showOtpField}
                  className={
                    showOtpField
                      ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                      : ""
                  }
                />
              </Field>

              {showOtpField && (
                <Field>
                  <FieldLabel>Verification Code</FieldLabel>
                  <InputOTP maxLength={6} autoFocus>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>

                    <InputOTPSeparator />

                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <Button
                    onClick={() => setShowOtpField(false)}
                    variant="link"
                    type="button"
                  >
                    Edit Email Address
                  </Button>
                </Field>
              )}

              <Button
                variant="default"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                {showOtpField ? "Verify & Continue" : "Get OTP Code"}
              </Button>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  );
}

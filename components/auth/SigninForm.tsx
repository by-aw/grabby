"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SigninForm({
  signIn,
}: {
  signIn: (email: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    // Client-side email validation
    if (!EMAIL_REGEX.test(email)) {
      setMessage("Please enter a valid email address");
      setStatus("error");
      return;
    }

    try {
      const result = await signIn(email.toLowerCase().trim());
      if (result.error) {
        setMessage(result.error);
        setStatus("error");
      } else {
        setMessage("Check your email for a login link!");
        setStatus("success");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred");
      setStatus("error");
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error message when user starts typing again
    if (status === "error") {
      setStatus("idle");
      setMessage(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={cn(
            "p-4 rounded-md",
            status === "loading" && "bg-secondary",
            status === "success" &&
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
            status === "error" &&
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          )}
        >
          <p className="text-sm">{message}</p>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
          className="w-full"
          disabled={status === "loading" || status === "success"}
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          title="Please enter a valid email address"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" ? "Sending..." : "Continue with Email"}
      </Button>
    </form>
  );
}

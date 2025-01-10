"use client";

import { useEffect, useState } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "The authentication link is invalid or has expired.",
  invalid_code: "The authentication link is invalid or has expired.",
  server_error:
    "An error occurred while trying to sign you in. Please try again.",
  access_denied: "The authentication link is invalid or has expired.",
  otp_expired: "The email link has expired. Please request a new one.",
  unauthorized_email:
    "Your email is not authorized to access the admin area. Please use an authorized email address.",
  verification_failed:
    "Failed to verify your authentication. Please try signing in again.",
};

export default function LoginErrorHandler({
  queryError,
}: {
  queryError?: string;
}) {
  const [error, setError] = useState<string | null>(
    queryError ? ERROR_MESSAGES[queryError] || queryError : null
  );

  useEffect(() => {
    // Handle hash parameters on client side
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const hashError = hashParams.get("error");
      const errorCode = hashParams.get("error_code");
      const errorDescription = hashParams.get("error_description");

      if (hashError || errorCode) {
        const message =
          ERROR_MESSAGES[errorCode || hashError || ""] ||
          errorDescription ||
          "An error occurred during authentication";
        setError(message);
      }
    }
  }, []);

  if (!error) return null;

  return (
    <div className="mb-4 p-4 rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
      <p className="text-sm">{error}</p>
    </div>
  );
}

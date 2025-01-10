"use server";

// List of allowed email addresses or domains from environment variables
const ALLOWED_EMAILS = new Set(
  process.env.ALLOWED_EMAILS?.split(",").map((email) => email.trim()) ?? []
);

const ALLOWED_DOMAINS = new Set(
  process.env.ALLOWED_DOMAINS?.split(",").map((domain) => domain.trim()) ?? []
);

export async function isEmailAllowed(email: string): Promise<boolean> {
  if (!email) return false;

  const cleanEmail = email.toLowerCase().trim();

  // Check if the exact email is allowed
  if (ALLOWED_EMAILS.has(cleanEmail)) {
    return true;
  }

  // Check if the email domain is allowed
  const domain = cleanEmail.split("@")[1];
  if (ALLOWED_DOMAINS.has(domain)) {
    return true;
  }

  return false;
}

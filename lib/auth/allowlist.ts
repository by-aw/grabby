// List of allowed email addresses or domains
const ALLOWED_EMAILS = new Set([
  // Add specific email addresses
  "aw@byaw.xyz",
  // Add more emails as needed
]);

const ALLOWED_DOMAINS = new Set([
  // Add allowed domains (without @)
  "grabby.co",
  // Add more domains as needed
]);

export function isEmailAllowed(email: string): boolean {
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

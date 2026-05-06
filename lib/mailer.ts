// Email sending is deferred — leads are stored in DynamoDB.
// Swap this stub for a real transport (Resend, SendGrid, etc.) when ready.

export async function sendEmail(_opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  // no-op until email provider is configured
}

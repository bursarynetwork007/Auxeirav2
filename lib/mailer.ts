import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_ADDRESS ?? "Auxeira <info@auxeira.com>";

// Lazy-initialised so the module loads cleanly at build time without a key
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — email skipped");
    return;
  }

  const { error } = await getResend().emails.send({
    from: FROM,
    replyTo: opts.replyTo ?? "info@auxeira.com",
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

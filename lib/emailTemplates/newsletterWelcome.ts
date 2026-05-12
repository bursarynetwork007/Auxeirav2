const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auxeira.com";
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";

export function buildNewsletterWelcomeEmail({
  firstName,
  unsubscribeUrl = `${SITE_URL}/unsubscribe`,
}: {
  firstName?: string;
  unsubscribeUrl?: string;
}): string {
  const name = firstName ?? "there";
  // Next first Monday of next month (approximate — good enough for copy)
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dayOfWeek = nextMonth.getDay(); // 0=Sun, 1=Mon
  const daysUntilMonday = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;
  nextMonth.setDate(nextMonth.getDate() + daysUntilMonday);
  const firstMonday = nextMonth.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="format-detection" content="telephone=no">
<title>Auxeira Intelligence</title>
<style>
  body, table, td, p, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
  body { margin:0 !important; padding:0 !important; background-color:#F0EBE3; font-family:Georgia,'Times New Roman',serif; }
  @media screen and (max-width:600px) {
    .email-container { width:100% !important; }
    .pad { padding:24px 20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#F0EBE3;">

<!-- PREHEADER -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  You are subscribed to Auxeira Intelligence. First edition: ${firstMonday}. &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#F0EBE3;">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;">

  <!-- HEADER -->
  <tr>
    <td style="background-color:#0A1628;padding:28px 36px 24px;border-radius:8px 8px 0 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr><td style="background-color:#C9A84C;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="padding-top:20px;">
        <tr>
          <td>
            <span style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#C9A84C;letter-spacing:0.03em;">Auxeira</span><br>
            <span style="font-family:Arial,sans-serif;font-size:9px;color:rgba(201,168,76,0.6);letter-spacing:0.18em;text-transform:uppercase;">Intelligence</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td class="pad" style="background-color:#FDFAF6;padding:36px 36px 32px;">
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#1A1A2A;line-height:1.75;margin:0 0 16px;">${name} — you are subscribed to Auxeira Intelligence. The first edition arrives on ${firstMonday}.</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#1A1A2A;line-height:1.75;margin:0 0 16px;">Each edition goes to people doing serious evidence and impact work across Africa's social sector. Expect it to be specific to your world, not generic.</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#1A1A2A;line-height:1.75;margin:0 0 32px;">If you have a question before then, reply to this email.</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#1A1A2A;line-height:1.75;margin:0 0 4px;">Lante</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#1A1A2A;line-height:1.75;margin:0 0 4px;">Auxeira</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#C9A84C;line-height:1.75;margin:0;">
        <a href="mailto:info@auxeira.com" style="color:#C9A84C;text-decoration:none;">info@auxeira.com</a>
      </p>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background-color:#0A1628;padding:20px 36px;border-radius:0 0 8px 8px;">
      <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(245,240,232,0.4);line-height:1.7;margin:0;text-align:center;">
        <a href="${SITE_URL}" style="color:rgba(201,168,76,0.6);text-decoration:none;">auxeira.com</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:info@auxeira.com" style="color:rgba(201,168,76,0.6);text-decoration:none;">info@auxeira.com</a>
        &nbsp;&middot;&nbsp;
        <a href="${unsubscribeUrl}" style="color:rgba(245,240,232,0.3);text-decoration:none;">Unsubscribe</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

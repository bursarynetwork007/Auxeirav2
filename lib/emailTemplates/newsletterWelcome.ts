const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auxeira.com";
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";

export function buildNewsletterWelcomeEmail({
  firstName,
  unsubscribeUrl = `${SITE_URL}/unsubscribe`,
}: {
  firstName?: string;
  unsubscribeUrl?: string;
}): string {
  const greeting = firstName ? firstName : "there";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="format-detection" content="telephone=no">
<title>Auxeira Intelligence</title>
<style>
  body, table, td, p, a, li, blockquote { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
  body { margin:0 !important; padding:0 !important; background-color:#F0EBE3; font-family:Georgia,'Times New Roman',serif; }
  @media screen and (max-width:600px) {
    .email-container { width:100% !important; }
    .mobile-padding { padding:20px 16px !important; }
    .mobile-hero-text { font-size:22px !important; line-height:1.3 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#F0EBE3;">

<!-- PREHEADER -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  Welcome to Auxeira Intelligence — monthly evidence, behavioural science, and sector analysis. &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#F0EBE3;">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;">

  <!-- HEADER -->
  <tr>
    <td style="background-color:#0A1628;padding:28px 36px 0;border-radius:8px 8px 0 0;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr><td style="background-color:#C9A84C;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="padding-top:20px;">
        <tr>
          <td style="vertical-align:bottom;">
            <span style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#C9A84C;letter-spacing:0.03em;">Auxeira</span><br>
            <span style="font-family:Arial,sans-serif;font-size:9px;color:rgba(201,168,76,0.6);letter-spacing:0.18em;text-transform:uppercase;">Evidence Intelligence</span>
          </td>
          <td align="right" style="vertical-align:bottom;">
            <span style="font-family:Arial,sans-serif;font-size:9px;color:rgba(245,240,232,0.35);letter-spacing:0.12em;text-transform:uppercase;">Welcome Edition</span>
          </td>
        </tr>
      </table>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:16px;">
        <tr><td style="background-color:rgba(201,168,76,0.25);height:1px;font-size:0;">&nbsp;</td></tr>
      </table>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="padding:20px 0 24px;">
        <tr>
          <td>
            <p style="font-family:Arial,sans-serif;font-size:9px;color:#C9A84C;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 10px;">You're in</p>
            <h1 class="mobile-hero-text" style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;color:#F5F0E8;line-height:1.3;margin:0 0 12px;">Welcome to Auxeira Intelligence</h1>
            <p style="font-family:Arial,sans-serif;font-size:13px;color:rgba(245,240,232,0.65);line-height:1.6;margin:0;">Monthly. Free. No noise. Evidence, behavioural science, and sector analysis for leaders who want to stay ahead.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- OPENING -->
  <tr>
    <td class="mobile-padding" style="background-color:#FDFAF6;padding:28px 36px 20px;">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#1A1A2A;line-height:1.7;margin:0 0 12px;">Dear ${greeting},</p>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#1A1A2A;line-height:1.7;margin:0 0 12px;">
        You're now subscribed to Auxeira Intelligence. Each month you'll receive one edition — a focused look at the evidence, behavioural science, and sector dynamics shaping decisions across Africa and beyond.
      </p>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#1A1A2A;line-height:1.7;margin:0;">
        No pitch. No noise. Just the thinking that matters.
      </p>
    </td>
  </tr>

  <!-- GOLD RULE -->
  <tr>
    <td style="background-color:#FDFAF6;padding:0 36px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr><td style="background-color:#C9A84C;height:1px;font-size:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>

  <!-- WHAT TO EXPECT — NAVY -->
  <tr>
    <td class="mobile-padding" style="background-color:#0A1628;padding:24px 36px;">
      <p style="font-family:Arial,sans-serif;font-size:9px;color:#C9A84C;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 10px;">What to expect</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#F5F0E8;line-height:1.75;margin:0 0 10px;">
        Each edition covers one theme in depth: a sector insight, a methodology note from Auxeira's Evidence Intelligence Framework, a proof point from the field, and what it means for organisations like yours.
      </p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:rgba(245,240,232,0.65);line-height:1.75;margin:0;">
        One edition. Once a month. Always worth reading.
      </p>
    </td>
  </tr>

  <!-- CAPABILITY DOWNLOAD -->
  <tr>
    <td class="mobile-padding" style="background-color:#FDF8EE;border-top:1px solid #C9A84C;border-bottom:1px solid #C9A84C;padding:24px 36px;">
      <p style="font-family:Arial,sans-serif;font-size:9px;color:#8B6914;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 10px;">While you wait for the first edition</p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#4A3000;line-height:1.75;margin:0 0 16px;">
        Download the Auxeira Capability Overview — 2 pages covering what we do, what we've delivered, and what a partnership looks like.
      </p>
      <a href="${SITE_URL}/capability-overview.html"
         style="display:inline-block;background:#0A1628;color:#C9A84C;padding:12px 24px;font-family:Arial,sans-serif;font-size:12px;font-weight:600;text-decoration:none;letter-spacing:0.08em;border-radius:2px;">
        Download Capability Overview →
      </a>
    </td>
  </tr>

  <!-- SOFT CTA -->
  <tr>
    <td class="mobile-padding" style="background-color:#FDFAF6;padding:20px 36px 24px;">
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:13px;color:#1A1A2A;line-height:1.7;margin:0 0 16px;">
        If your organisation has evidence that deserves to move decisions, <a href="${CALENDLY_URL}" style="color:#C9A84C;text-decoration:none;">let's talk</a>.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="vertical-align:top;">
            <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#0A1628;margin:0 0 2px;">Lante</p>
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#666;margin:0 0 2px;">Founder, Auxeira</p>
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#C9A84C;margin:0;">
              <a href="mailto:lante@auxeira.com" style="color:#C9A84C;text-decoration:none;">lante@auxeira.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- INSIGHTS TEASER -->
  <tr>
    <td style="background-color:#F5F0E8;border-top:1px solid #E0D8CC;padding:20px 36px;">
      <p style="font-family:Arial,sans-serif;font-size:9px;color:#8B6914;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;">From Auxeira Intelligence</p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-right:8px;vertical-align:top;" width="50%">
            <p style="font-family:Arial,sans-serif;font-size:8px;color:#C9A84C;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Long-form</p>
            <p style="font-family:Georgia,serif;font-size:12px;color:#0A1628;line-height:1.4;margin:0 0 4px;">The Translation Gap: Why Strong Evidence Does Not Drive Strong Decisions</p>
            <a href="${SITE_URL}/insights/translation-gap" style="font-family:Arial,sans-serif;font-size:10px;color:#C9A84C;text-decoration:none;">Read on auxeira.com</a>
          </td>
          <td style="padding-left:8px;vertical-align:top;border-left:1px solid #DDD6CA;" width="50%">
            <p style="font-family:Arial,sans-serif;font-size:8px;color:#C9A84C;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Evidence Health Check</p>
            <p style="font-family:Georgia,serif;font-size:12px;color:#0A1628;line-height:1.4;margin:0 0 4px;">How strong is your organisation's evidence? 8 questions. 90 seconds. A personalised report.</p>
            <a href="${SITE_URL}/#health-check" style="font-family:Arial,sans-serif;font-size:10px;color:#C9A84C;text-decoration:none;">Take the Health Check</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background-color:#0A1628;padding:20px 36px;border-radius:0 0 8px 8px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="vertical-align:middle;">
            <span style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#C9A84C;">Auxeira</span>
          </td>
          <td align="right" style="vertical-align:middle;">
            <a href="https://za.linkedin.com/in/emmanuel-luthuli-193194146" style="display:inline-block;margin-left:8px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr><td style="background:#C9A84C;width:18px;height:18px;border-radius:3px;text-align:center;vertical-align:middle;">
                  <span style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#0A1628;">in</span>
                </td></tr>
              </table>
            </a>
          </td>
        </tr>
      </table>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:12px;">
        <tr><td style="background-color:rgba(201,168,76,0.2);height:1px;font-size:0;">&nbsp;</td></tr>
      </table>
      <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(245,240,232,0.4);line-height:1.7;margin:12px 0 0;text-align:center;">
        Johannesburg · London · New York — Global from Africa<br>
        <a href="${SITE_URL}" style="color:rgba(201,168,76,0.6);text-decoration:none;">auxeira.com</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:lante@auxeira.com" style="color:rgba(201,168,76,0.6);text-decoration:none;">lante@auxeira.com</a>
        &nbsp;&middot;&nbsp;
        <a href="${unsubscribeUrl}" style="color:rgba(245,240,232,0.3);text-decoration:none;">Unsubscribe</a>
      </p>
      <p style="font-family:Arial,sans-serif;font-size:9px;color:rgba(245,240,232,0.2);margin:8px 0 0;text-align:center;">
        You subscribed at auxeira.com. We send one edition monthly. No third-party sharing.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

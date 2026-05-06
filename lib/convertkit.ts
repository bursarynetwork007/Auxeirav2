const CK_API = "https://api.convertkit.com/v3";

export async function subscribeToForm({
  formId,
  email,
  firstName,
  fields,
}: {
  formId: string;
  email: string;
  firstName?: string;
  fields?: Record<string, string>;
}) {
  const res = await fetch(`${CK_API}/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.CONVERTKIT_API_KEY,
      email,
      first_name: firstName,
      fields,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ConvertKit error ${res.status}: ${body}`);
  }
  return res.json();
}

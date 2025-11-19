const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResponse {
  success: boolean;
  action?: string;
  cdata?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }

  if (!token) {
    return false;
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!res.ok) {
      console.error("Turnstile verification HTTP error", res.status);
      return false;
    }

    const data = (await res.json()) as TurnstileVerifyResponse;
    if (data.success) {
      return true;
    }
    console.warn("Turnstile verification failed", data["error-codes"]);
    return false;
  } catch (error) {
    console.error("Turnstile verification threw", error);
    return false;
  }
}



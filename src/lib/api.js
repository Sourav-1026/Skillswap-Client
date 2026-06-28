import { authClient } from "@/lib/auth-client";

export async function authFetch(url, options = {}) {
  let token = null;

  try {
    const { data } = await authClient.token();
    token = data?.token ?? null;
  } catch (err) {
    console.error("Token fetch failed:", err);
  }

  const { headers: optionHeaders, ...restOptions } = options;

  return fetch(url, {
    ...restOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...optionHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

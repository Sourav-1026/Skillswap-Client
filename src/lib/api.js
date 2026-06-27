import { authClient } from "@/lib/auth-client";

export async function authFetch(url, options = {}) {
  let token = null;

  try {
    const { data } = await authClient.token();
    console.log("Full token response:", data);
    token = data?.token ?? null;
    console.log("Token:", token ? token.slice(0, 20) + "..." : "NULL");
  } catch (err) {
    console.error("Token fetch failed:", err);
  }

  const { headers: optionHeaders, ...restOptions } = options;
  console.log(
    "Sending Authorization:",
    token ? "Bearer present ✅" : "No token ❌",
  );

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

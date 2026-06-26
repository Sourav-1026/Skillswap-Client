export async function authFetch(url, options = {}) {
  let token = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/auth/token`,
      { credentials: "include" },
    );

    if (res.ok) {
      const data = await res.json();
      token = data.token;
    }
  } catch (err) {
    console.error("Token fetch failed:", err);
  }

  // ✅ Destructure headers out of options so we can merge safely
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
      ...optionHeaders, // spread caller's headers first
      ...(token // ✅ Authorization always goes last, never overwritten
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  });
}

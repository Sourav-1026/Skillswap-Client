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

    console.log("Token from /api/auth/token:", token); // what does this print?
  } catch (err) {
    console.error("Token fetch failed:", err);
  }

  return fetch(url, {
    ...options,
    credentials: "include", // ✅ always send cookies too
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

import paths from "@/routes/paths";

interface DecodedToken {
  exp: number;
  iat: number;
  sub: string | number;
}

// ----------------------------------------------------------------------

let expiredTimer: NodeJS.Timeout;

function jwtDecode(token: string): DecodedToken {
  const base64Url = token.split(".")[1];
  const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64 ?? "")
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string): boolean => {
  if (!accessToken) return false;

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  if (!decoded?.exp) return false;

  return decoded.exp > currentTime;
};

export const tokenExpired = (exp: number) => {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  // Clear any existing timeout
  if (expiredTimer) {
    clearTimeout(expiredTimer);
  }

  // Set new timeout
  expiredTimer = setTimeout(() => {
    alert("Token expired");
    localStorage.removeItem("token");
    window.location.href = paths.auth.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);

    const { exp } = jwtDecode(token);
    tokenExpired(exp);
  } else {
    localStorage.removeItem("token");
  }
};

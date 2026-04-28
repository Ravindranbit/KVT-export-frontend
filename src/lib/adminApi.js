const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const ADMIN_TOKEN_KEY = "admin-token";

function getAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getAdminToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

const adminApi = {
  get: (path, options = {}) => request(path, { method: "GET", ...options }),
  post: (path, body, options = {}) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),
  patch: (path, body, options = {}) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),
  put: (path, body, options = {}) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),
};

export { ADMIN_TOKEN_KEY, getAdminToken };
export default adminApi;

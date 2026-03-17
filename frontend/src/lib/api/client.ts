// Core API Client

const BASE_URL = "/api";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { auth = true, ...rest } = options;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  });

  // Only attach auth if needed
  if (auth && process.env.NEXT_PUBLIC_ZIMNA_AUTH) {
    headers.set("Authorization", `Basic ${process.env.NEXT_PUBLIC_ZIMNA_AUTH}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("API ERROR:", {
      endpoint,
      status: response.status,
      body: text,
    });

    throw new Error(`Error ${response.status}: ${text}`);
  }

  return response.json();
}

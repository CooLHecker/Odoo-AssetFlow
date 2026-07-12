/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_URL = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} on ${path}: ${body}`);
  }
  // DELETE responses may be empty
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  patch: <T,>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
};

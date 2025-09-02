// lib/apiClient.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_DRAFT_BACKEND|| "http://localhost:8000";
 // Change for production

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`GET request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
  },

  async post<T, B>(path: string, body: B): Promise<T> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`POST request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
  },

  async upload<T>(path: string, file: File): Promise<T> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Upload request failed with status ${res.status}`);
    }
    return res.json() as Promise<T>;
  },
};

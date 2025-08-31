// lib/apiClient.ts
const API_BASE_URL = "http://localhost:8000"; // Change for production

export const apiClient = {
  async get(path: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  async post(path: string, body: any) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async upload(path: string, file: File) {
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

    return res.json();
  },
};

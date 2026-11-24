export type DiaryEntry = {
  id: number;
  title: string;
  diary_date: string;
  preview: string;
  body: string;
  mood: string;
  liked: boolean | number;
  created_at: string;
};

export type NewDiary = {
  title: string;
  diary_date: string;
  body: string;
  mood: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function getBaseUrl() {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL belum diatur");
  }
  return API_URL;
}

async function checkResponse(response: Response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Request gagal");
  }
  return response.json();
}

export async function apiGetDiaries(search = "") {
  const query = search.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";
  const response = await fetch(`${getBaseUrl()}/api/diaries${query}`);
  return checkResponse(response);
}

export async function apiCreateDiary(data: NewDiary) {
  const response = await fetch(`${getBaseUrl()}/api/diaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return checkResponse(response);
}

export async function apiUpdateDiary(id: number, data: Partial<DiaryEntry>) {
  const response = await fetch(`${getBaseUrl()}/api/diaries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return checkResponse(response);
}

export async function apiDeleteDiary(id: number) {
  const response = await fetch(`${getBaseUrl()}/api/diaries/${id}`, {
    method: "DELETE",
  });
  return checkResponse(response);
}

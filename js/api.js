// On your laptop the frontend talks to the local backend.
// On Netlify it talks to the Render backend (put your Render link below).
const LOCAL_BACKEND = "http://localhost:8080/api";
const RENDER_BACKEND = "https://YOUR-BACKEND-NAME.onrender.com/api";

const runningLocally = location.protocol === "file:" ||
                       location.hostname === "localhost" ||
                       location.hostname === "127.0.0.1";
const BASE_URL = runningLocally ? LOCAL_BACKEND : RENDER_BACKEND;

// one place for fetch, so a stopped backend gives a clear message
async function send(path, options) {
  try {
    return await fetch(BASE_URL + path, options);
  } catch (e) {
    throw new Error("Cannot reach the server. Make sure the backend is running.");
  }
}

async function apiGet(path) {
  const res = await send(path);
  return res.json();
}

async function apiPost(path, data) {
  const res = await send(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Something went wrong");
  return result;
}

async function apiPut(path, data) {
  const res = await send(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Something went wrong");
  return result;
}

async function apiDelete(path) {
  const res = await send(path, { method: "DELETE" });
  if (!res.ok) throw new Error("Could not delete. It may be linked to other records.");
}
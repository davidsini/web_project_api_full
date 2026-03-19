export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const register = async (name, about, avatar, email, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, about, avatar, email, password }),
  });
  return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
};

export const authorize = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
};

export const getUserInfoAuth = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  }
  const data = await res.json();
  return data;
};

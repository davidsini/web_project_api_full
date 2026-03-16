const TOKEN_KEY = "jwt";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// getToken recupera y devuelve el valor asociado a
// TOKEN_KEY desde localStorage.
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// removeToken elimina el token del almacenamiento local.
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const nameToken = "token";

export const guardarToken = (token) => localStorage.setItem(nameToken, token);

export const obtenerToken = () => localStorage.getItem(nameToken);

export const eliminarToken = () => localStorage.removeItem(nameToken);
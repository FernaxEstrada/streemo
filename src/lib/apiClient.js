import { eliminarToken, obtenerToken } from "@/utils/tokenManager";
import varEntorno from "@/helpers/varEntorno"

export async function apiClient(url, options) {
  try {
    const token = obtenerToken();
    const env = varEntorno();

    const res = await fetch(`${env.BASE_API_URL}/${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    if (url !== "/auth/login" && res.status === 401) {
      eliminarToken();
      window.location.href = "/login"
    }

    return await res.json();
  } catch (error) {
    return { data: null, error: error.message, msg: 'Error interno del servidor' };
  }
}
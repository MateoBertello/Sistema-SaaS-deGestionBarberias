/// <reference types="vite/client" />
import { toast } from 'sonner';

// Si VITE_API_URL no está definido, usa localhost por defecto
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface FetchOptions extends RequestInit {
  successMessage?: string;
}

// Renombramos apiFetch a apiClient para que coincida con tus componentes
export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { successMessage, ...customOptions } = options;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...customOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...customOptions.headers,
      },
    });

    // Manejo de Errores Global
    if (!response.ok) {
      if (response.status === 401) {
         localStorage.clear(); // Borramos todo (token, rol, userId)
         window.location.href = '/'; // Redirigimos
         throw new Error("Sesión expirada");
      }

      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || 'Error en la operación.';
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Si es un 204 (No Content), devolvemos vacío
    if (response.status === 204) {
      if (successMessage) toast.success(successMessage);
      return {} as T;
    }

    // Parseamos el JSON aquí, para no hacerlo en cada componente
    const data = await response.json();

    if (successMessage) toast.success(successMessage);
    return data;

  } catch (error) {
    if (error instanceof TypeError) {
      toast.error('No se pudo conectar con el servidor.');
    }
    throw error;
  }
}
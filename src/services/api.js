// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Interceptor para añadir Token automáticamente ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ===========================
// 🔐 LOGIN
// ===========================
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const data = response.data;

    // Normalizamos token → access_token
    if (data.token && !data.access_token) {
      data.access_token = data.token;
    }

    return data;
  } catch (error) {
    console.error(
      'Error en el login:',
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
  }
};

// ===========================
// 👤 SIGNUP / LOGOUT / USUARIOS
// ===========================
export const signup = async (nombre_usuario, email, password) => {
  try {
    const response = await apiClient.post('/auth/signup', {
      nombre_usuario,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error en el registro:',
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || 'Error al registrarse');
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error(
      'Error en el logout:',
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || 'Error al cerrar sesión');
  }
};

export const getUsuarios = async () => {
  try {
    const response = await apiClient.get('/usuarios');
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener usuarios:',
      error.response?.data?.error || error.message
    );
    throw new Error(
      error.response?.data?.error || 'No se pudo cargar los usuarios'
    );
  }
};

export const deleteUsuario = async (id) => {
  try {
    const response = await apiClient.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error al eliminar usuario:',
      error.response?.data?.error || error.message
    );
    throw new Error(
      error.response?.data?.error || 'No se pudo eliminar el usuario'
    );
  }
};

// ===========================
// 🕹 PARTIDAS
// ===========================
export const createGame = async () => {
  try {
    const response = await apiClient.post('/partidas');
    return response.data;
  } catch (error) {
    console.error(
      'Error al crear partida:',
      error.response?.data?.details || error.message
    );
    throw new Error(
      error.response?.data?.details || 'No se pudo crear la partida'
    );
  }
};

export const joinGameByCode = async (codigo) => {
  try {
    const response = await apiClient.post(`/partidas/${codigo}/join`);
    return response.data;
  } catch (error) {
    console.error(
      'Error al unirse a partida:',
      error.response?.data?.details || error.message
    );
    throw new Error(
      error.response?.data?.details || 'No se pudo unir a la partida'
    );
  }
};

export const leaveGame = async () => {
  try {
    const response = await apiClient.delete('/partidas/leave');
    return response.data;
  } catch (error) {
    console.error(
      'Error al salir de partida:',
      error.response?.data?.details || error.message
    );
    throw new Error(
      error.response?.data?.details || 'No se pudo salir de la partida'
    );
  }
};

export const getGameState = async (partidaId) => {
  try {
    const response = await apiClient.get(`/partidas/${partidaId}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener estado de partida:',
      error.response?.data?.error || error.message
    );
    throw new Error(
      error.response?.data?.error || 'No se pudo cargar la partida'
    );
  }
};

// ===========================
// 🎮 JUGADORES - EVOLUCIONAR
// ===========================
export const evolucionarJugador = async (partidaId, jugadorId) => {
  try {
    const response = await apiClient.post(
      `/jugadores/${partidaId}/${jugadorId}/evolucionar`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al evolucionar:',
      error.response?.data?.error || error.message
    );
    throw new Error(
      error.response?.data?.error || 'No se pudo realizar la evolución'
    );
  }
};

// ===========================
// 🎮 JUGADORES - CONSTRUIR ESCALERA
// ===========================
export const construirEscalera = async (partidaId, jugadorId) => {
  try {
    const response = await apiClient.post(
      `/jugadores/${partidaId}/${jugadorId}/construir-escalera`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al construir escalera:',
      error.response?.data?.error || error.message
    );
    throw new Error(
      error.response?.data?.error || 'No se pudo construir la escalera'
    );
  }
};


// ===========================
// 📜 HISTORIAL
// ===========================
export const getMyGames = async () => {
  try {
    const response = await apiClient.get('/partidas/mis_partidas');
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener historial:',
      error.response?.data?.error || error.message
    );
    throw new Error(
      error.response?.data?.error || 'No se pudo cargar el historial de partidas'
    );
  }
};
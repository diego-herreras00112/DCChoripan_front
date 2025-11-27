// src/services/socket.js
import { io } from 'socket.io-client';

// Usamos la variable de entorno VITE_API_URL que ya tienes configurada
// Si no existe, usa localhost:3000 por defecto.
const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://dcchoripan-api.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Importante: No conectar automáticamente al importar
  reconnection: true, // Intentar reconectar si se cae
});
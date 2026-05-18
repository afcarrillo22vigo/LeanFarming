import axios from "axios";

// Configuración de la instancia para conectar con el backend de tu TFM
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Ajusta esto a la URL de tu servidor
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

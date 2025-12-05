import { Hono } from "hono";
import {
  iniciarSesionHandler,
  registrarPersonaHandler,
  obtenerPersonasHandler,
  actualizarPersonaHandler,
  registrarUsuarioHandler,
  obtenerUsuariosHandler,
  actualizarUsuarioHandler,
  actualizarPasswordUsuarioHandler,
} from "../helpers/auth.handler";

const authRouter = new Hono();

// Login
authRouter.post("/login", iniciarSesionHandler);

// Personas (solo superAdmin)
authRouter.post("/personas", registrarPersonaHandler);
authRouter.get("/personas", obtenerPersonasHandler);
authRouter.put("/personas", actualizarPersonaHandler);

// Usuarios (solo superAdmin)
authRouter.post("/usuarios", registrarUsuarioHandler);
authRouter.get("/usuarios", obtenerUsuariosHandler);
authRouter.put("/usuarios", actualizarUsuarioHandler);
authRouter.put(
  "/usuarios/:personaId/contrasena",
  actualizarPasswordUsuarioHandler
);

export default authRouter;

import express from "express";
// --- ¡IMPORTACIONES DE SEGURIDAD AÑADIDAS! ---
import { 
    verifyToken, 
    canRead, 
    canWrite,
    isSuperusuario
} from '../../middlewares/AuthMiddleware'; // <-- Asegúrate que la ruta sea correcta

// --- Tus imports de controladores (sin cambios) ---
import {
    getStatsController,
    getAllServiciosController,
    addServicioController,
    updateServicioController,
    deleteServicioController,
    getCatalogosController,
    getPdfController,
    getAllTipoServicioController,
    getAllTipoActividadController,
    getAllEstadoServicioController,
    getServicioParaFormularioController
} from "./dependencies";

// --- Import del controlador de fotos (sin cambios) ---
import { photoUploadController } from "./controllers/PhotoUploadController";

// --- Creación del Router (sin cambios) ---
export const servicioRouter = express.Router();


// ===============================================
// RUTAS PRINCIPALES DEL CRUD
// ===============================================
// POST (Crear servicio: Solo S y N)
servicioRouter.post(
    "/", 
    verifyToken, // <-- Seguridad
    canWrite,    // <-- Seguridad (S y N)
    addServicioController.run.bind(addServicioController)
);

// GET (Leer lista detallada: Todos)
servicioRouter.get(
    "/detallados", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getAllServiciosController.run.bind(getAllServiciosController)
);

// GET (Leer uno detallado por ID: Todos)
servicioRouter.get(
    "/detallados/:id", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getServicioParaFormularioController.run.bind(getServicioParaFormularioController) // <-- ¡EL NUEVO!
);

// PATCH (Actualizar servicio: Solo S y N)
servicioRouter.patch(
    "/:id", 
    verifyToken, // <-- Seguridad
    canWrite,    // <-- Seguridad (S y N)
    updateServicioController.run.bind(updateServicioController)
);


// ===============================================
// RUTAS DE UTILIDADES
// ===============================================
// POST (Subir fotos: Solo S y N, ya que es parte de crear/editar)
servicioRouter.post(
    "/upload-photos", 
    verifyToken, // <-- Seguridad
    canWrite,    // <-- Seguridad (S y N)
    photoUploadController.uploadMiddleware, 
    photoUploadController.uploadPhotos.bind(photoUploadController)
);

// GET (Generar reporte PDF: Todos)
servicioRouter.get(
    "/reporte/:id", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getPdfController.run.bind(getPdfController)
);

// GET (Obtener estadísticas: Todos)
servicioRouter.get(
    "/estadisticas", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getStatsController.run.bind(getStatsController)
);


// ===============================================
// RUTAS DE CATÁLOGOS (Todos pueden leer)
// ===============================================
servicioRouter.get(
    "/catalogos/ubicaciones", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getCatalogosController.getUbicaciones.bind(getCatalogosController)
);

servicioRouter.get(
    "/catalogos/tipos-envio", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getCatalogosController.getTiposEnvio.bind(getCatalogosController)
);

servicioRouter.get(
    "/tipos/servicio", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getAllTipoServicioController.run.bind(getAllTipoServicioController)
);

servicioRouter.get(
    "/tipos/actividad", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getAllTipoActividadController.run.bind(getAllTipoActividadController)
);

servicioRouter.get(
    "/tipos/estados-servicio", 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getAllEstadoServicioController.run.bind(getAllEstadoServicioController)
);

servicioRouter.delete(
    '/:id', 
    verifyToken, 
    isSuperusuario,
    deleteServicioController.run.bind(deleteServicioController)
)
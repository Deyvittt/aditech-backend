import express from 'express';
// --- ¡IMPORTACIONES DE SEGURIDAD AÑADIDAS! ---
import { 
    verifyToken, 
    canRead, 
    canWrite, 
    isSuperusuario 
} from '../../middlewares/AuthMiddleware'; // <-- Asegúrate que la ruta sea correcta

// --- Tus imports de controladores (sin cambios) ---
import {
    addEnlaceController,
    getEnlaceByIdController,
    getEnlacesByEstatusController,
    getEnlacesController,
    getEnlaceCompletoByIdController,
    getAllEnlaceDetalladoController,
    updateEnlaceController,
    deleteEnlaceController,
    getEnlaceByDireccionController
} from './dependencies';

// --- Creación del Router (sin cambios) ---
export const enlaceRouter = express.Router();

// ===============================================
// Rutas generales
// ===============================================
// GET (Leer lista general: Todos)
enlaceRouter.get(
    '/', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getEnlacesController.run.bind(getEnlacesController)
);

// POST (Crear enlace: Solo S y N)
enlaceRouter.post(
    '/', 
    verifyToken, // <-- Seguridad
    canWrite,    // <-- Seguridad (S y N)
    addEnlaceController.run.bind(addEnlaceController)
);

// GET (Leer lista detallada: Todos)
enlaceRouter.get(
    '/detallados', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getAllEnlaceDetalladoController.run.bind(getAllEnlaceDetalladoController)
);

// GET (Leer por estatus: Todos)
enlaceRouter.get(
    '/estatus/:estatusId', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getEnlacesByEstatusController.run.bind(getEnlacesByEstatusController)
);

// ===============================================
// Rutas para buscar por ID o relación (Todos pueden leer)
// ===============================================
enlaceRouter.get(
    '/completo/:id', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getEnlaceCompletoByIdController.run.bind(getEnlaceCompletoByIdController)
);

enlaceRouter.get(
    '/direccion/:id', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getEnlaceByDireccionController.run.bind(getEnlaceByDireccionController)
);

enlaceRouter.get(
    '/:id', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad (S, N, L)
    getEnlaceByIdController.run.bind(getEnlaceByIdController)
);

// ===============================================
// Rutas para modificar/eliminar
// ===============================================
// PATCH (Actualizar enlace: Solo S y N)
enlaceRouter.patch(
    '/:id', 
    verifyToken, // <-- Seguridad
    canWrite,    // <-- Seguridad (S y N)
    updateEnlaceController.run.bind(updateEnlaceController)
);

// DELETE (Borrar enlace: ¡Solo S!)
enlaceRouter.delete(
    '/:id', 
    verifyToken,    // <-- Seguridad
    isSuperusuario, // <-- Seguridad (¡Solo S!)
    deleteEnlaceController.run.bind(deleteEnlaceController)
);
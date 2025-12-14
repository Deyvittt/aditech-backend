import express from 'express';
// --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ( '../../middleware/...' ) ---
import { 
    verifyToken, 
    canRead, 
    canWrite, 
    isSuperusuario 
} from '../../middlewares/AuthMiddleware'; // <-- Ruta corregida (singular)

// --- El resto de tus imports originales ---
import {
    addContratoController,
    getContratoByEnlaceController,
    getContratosController,
    getAllContratoDetalladoController,
    getContratoByIdController, // Unificamos el get by id a esta
    getAllContratoDetalladoByEnlaceController,
    deleteContratoController,
    updateContratoController,
    getAllTipoInstalacionController,
    getAllTipoContratoController,
    getAllVersionContratoController,
    getVersionesByTipoContratoIdController
} from './dependencies';

// --- Tu router original ---
export const contratoRouter = express.Router();

// --- Rutas de Tipos (con seguridad añadida) ---
contratoRouter.get(
    '/tipos-instalacion', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getAllTipoInstalacionController.run.bind(getAllTipoInstalacionController)
);
contratoRouter.get(
    '/tipos-contrato', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getAllTipoContratoController.run.bind(getAllTipoContratoController)
);
contratoRouter.get(
    '/versiones', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getAllVersionContratoController.run.bind(getAllVersionContratoController)
);
contratoRouter.get(
    '/versiones/:tipoContratoId', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getVersionesByTipoContratoIdController.run.bind(getVersionesByTipoContratoIdController)
);

// --- Rutas de Contratos (con seguridad añadida) ---
contratoRouter.post(
    '/', 
    verifyToken, // <-- Seguridad
    canWrite,    // <-- Seguridad (Solo S y N)
    addContratoController.run.bind(addContratoController)
);
contratoRouter.get(
    '/', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getContratosController.run.bind(getContratosController)
);
contratoRouter.get(
    '/detallados', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getAllContratoDetalladoController.run.bind(getAllContratoDetalladoController)
);
contratoRouter.get(
    '/detallados/enlaces/:enlaceId', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getAllContratoDetalladoByEnlaceController.run.bind(getAllContratoDetalladoByEnlaceController)
);
contratoRouter.get(
    '/enlaces/:enlaceId', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getContratoByEnlaceController.run.bind(getContratoByEnlaceController)
);
// --- Rutas para un contrato específico por ID (con seguridad añadida) ---
contratoRouter.get(
    '/:id', 
    verifyToken, // <-- Seguridad
    canRead,     // <-- Seguridad
    getContratoByIdController.run.bind(getContratoByIdController)
);
contratoRouter.patch(
    '/:id', 
    verifyToken, // <-- Seguridad
    canWrite,    // <-- Seguridad (Solo S y N)
    updateContratoController.run.bind(updateContratoController)
); // Usamos /:id para consistencia
contratoRouter.delete(
    '/:id', 
    verifyToken,    // <-- Seguridad
    isSuperusuario, // <-- Seguridad (¡Solo S!)
    deleteContratoController.run.bind(deleteContratoController)
); // Usamos /:id para consistencia
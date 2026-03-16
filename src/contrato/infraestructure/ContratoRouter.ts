import express from 'express';
import { 
    verifyToken, 
    canRead, 
    canWrite, 
    isSuperusuario 
} from '../../middlewares/AuthMiddleware';

import {
    addContratoController,
    getContratoByEnlaceController,
    getContratosController,
    getAllContratoDetalladoController,
    getContratoByIdController,
    getAllContratoDetalladoByEnlaceController,
    deleteContratoController,
    updateContratoController,
    getAllTipoInstalacionController,
    getAllTipoContratoController,
    getAllVersionContratoController,
    getVersionesByTipoContratoIdController
} from './dependencies';

export const contratoRouter = express.Router();

//Rutas de Tipos (con seguridad)
contratoRouter.get(
    '/tipos-instalacion', 
    verifyToken,
    canRead,
    getAllTipoInstalacionController.run.bind(getAllTipoInstalacionController)
);
contratoRouter.get(
    '/tipos-contrato', 
    verifyToken,
    canRead,
    getAllTipoContratoController.run.bind(getAllTipoContratoController)
);
contratoRouter.get(
    '/versiones', 
    verifyToken,
    canRead,
    getAllVersionContratoController.run.bind(getAllVersionContratoController)
);
contratoRouter.get(
    '/versiones/:tipoContratoId', 
    verifyToken,
    canRead,
    getVersionesByTipoContratoIdController.run.bind(getVersionesByTipoContratoIdController)
);

contratoRouter.post(
    '/', 
    verifyToken,
    canWrite,
    addContratoController.run.bind(addContratoController)
);
contratoRouter.get(
    '/', 
    verifyToken,
    canRead,
    getContratosController.run.bind(getContratosController)
);
contratoRouter.get(
    '/detallados', 
    verifyToken,
    canRead,
    getAllContratoDetalladoController.run.bind(getAllContratoDetalladoController)
);
contratoRouter.get(
    '/detallados/enlaces/:enlaceId', 
    verifyToken,
    canRead,
    getAllContratoDetalladoByEnlaceController.run.bind(getAllContratoDetalladoByEnlaceController)
);
contratoRouter.get(
    '/enlaces/:enlaceId', 
    verifyToken,
    canRead,
    getContratoByEnlaceController.run.bind(getContratoByEnlaceController)
);
//Rutas para un contrato específico por ID (con seguridad)
contratoRouter.get(
    '/:id', 
    verifyToken,
    canRead,
    getContratoByIdController.run.bind(getContratoByIdController)
);
contratoRouter.patch(
    '/:id', 
    verifyToken,
    canWrite,
    updateContratoController.run.bind(updateContratoController)
);
contratoRouter.delete(
    '/:id', 
    verifyToken,
    isSuperusuario,
    deleteContratoController.run.bind(deleteContratoController)
);
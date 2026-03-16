import express from 'express';

import { 
    verifyToken, 
    canRead, 
    canWrite, 
    isSuperusuario 
} from '../../middlewares/AuthMiddleware';


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

export const enlaceRouter = express.Router();

//Rutas generales
//GET (Leer lista general)
enlaceRouter.get(
    '/', 
    verifyToken,
    canRead,
    getEnlacesController.run.bind(getEnlacesController)
);

//POST (Crear enlace)
enlaceRouter.post(
    '/', 
    verifyToken,
    canWrite,
    addEnlaceController.run.bind(addEnlaceController)
);

//GET (Leer lista detallada)
enlaceRouter.get(
    '/detallados', 
    verifyToken,
    canRead,
    getAllEnlaceDetalladoController.run.bind(getAllEnlaceDetalladoController)
);

//GET (Leer por estatus)
enlaceRouter.get(
    '/estatus/:estatusId', 
    verifyToken,
    canRead,
    getEnlacesByEstatusController.run.bind(getEnlacesByEstatusController)
);

//Rutas para buscar por ID o relación
enlaceRouter.get(
    '/completo/:id', 
    verifyToken,
    canRead,
    getEnlaceCompletoByIdController.run.bind(getEnlaceCompletoByIdController)
);

enlaceRouter.get(
    '/direccion/:id', 
    verifyToken,
    canRead,
    getEnlaceByDireccionController.run.bind(getEnlaceByDireccionController)
);

enlaceRouter.get(
    '/:id', 
    verifyToken,
    canRead,
    getEnlaceByIdController.run.bind(getEnlaceByIdController)
);

//Rutas para modificar/eliminar
//PATCH (Actualizar enlace)
enlaceRouter.patch(
    '/:id', 
    verifyToken,
    canWrite,
    updateEnlaceController.run.bind(updateEnlaceController)
);

//DELETE (Borrar enlace)
enlaceRouter.delete(
    '/:id', 
    verifyToken,
    isSuperusuario,
    deleteEnlaceController.run.bind(deleteEnlaceController)
);
import express from "express";

import { photoUploadController } from '../infraestructure/controllers/PhotoUploadController';

import { 
    verifyToken, 
    canRead, 
    canWrite,
    isSuperusuario
} from '../../middlewares/AuthMiddleware'; 

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

export const servicioRouter = express.Router();

// RUTAS PRINCIPALES DEL CRUD

// POST (Crear servicio)
servicioRouter.post(
    "/",
    verifyToken,
    canWrite,
    addServicioController.run.bind(addServicioController)
);

// GET (Leer lista detallada)
servicioRouter.get(
    "/detallados",
    verifyToken,
    canRead,
    getAllServiciosController.run.bind(getAllServiciosController)
);

// GET (Leer uno detallado por ID)
servicioRouter.get(
    "/detallados/:id",
    verifyToken,
    canRead,
    getServicioParaFormularioController.run.bind(getServicioParaFormularioController)
);

// PATCH (Actualizar servicio)
servicioRouter.patch(
    "/:id",
    verifyToken,
    canWrite,
    updateServicioController.run.bind(updateServicioController)
);

// RUTAS DE FOTOS

// POST (Subir fotos)
servicioRouter.post(
    '/upload-photos',
    verifyToken,
    canWrite,
    photoUploadController.uploadMiddleware,
    photoUploadController.uploadPhotos.bind(photoUploadController)
);

// DELETE (Eliminar una foto del disco)
servicioRouter.delete(
    '/fotos/:filename',
    verifyToken,
    canWrite,
    photoUploadController.deletePhoto.bind(photoUploadController)
);

// RUTAS DE REPORTES Y ESTADÍSTICAS

// GET (Generar reporte PDF)
servicioRouter.get(
    "/reporte/:id",
    verifyToken,
    canRead,
    getPdfController.run.bind(getPdfController)
);

// GET (Obtener estadísticas del dashboard)
servicioRouter.get(
    "/estadisticas",
    verifyToken,
    canRead,
    getStatsController.run.bind(getStatsController)
);

// RUTAS DE CATÁLOGOS

servicioRouter.get(
    "/catalogos/ubicaciones",
    verifyToken,
    canRead,
    getCatalogosController.getUbicaciones.bind(getCatalogosController)
);

servicioRouter.get(
    "/catalogos/tipos-envio",
    verifyToken,
    canRead,
    getCatalogosController.getTiposEnvio.bind(getCatalogosController)
);

servicioRouter.get(
    "/tipos/servicio",
    verifyToken,
    canRead,
    getAllTipoServicioController.run.bind(getAllTipoServicioController)
);

servicioRouter.get(
    "/tipos/actividad",
    verifyToken,
    canRead,
    getAllTipoActividadController.run.bind(getAllTipoActividadController)
);

servicioRouter.get(
    "/tipos/estados-servicio",
    verifyToken,
    canRead,
    getAllEstadoServicioController.run.bind(getAllEstadoServicioController)
);

// DELETE (Borrado lógico)
servicioRouter.delete(
    '/:id',
    verifyToken,
    isSuperusuario,
    deleteServicioController.run.bind(deleteServicioController)
);
// En: src/dependencia/infrastructure/DependenciaRouter.ts

import express from 'express';
import { getDependenciasController } from './dependencies';

export const dependenciaRouter = express.Router();

dependenciaRouter.get(
    '/', 
    getDependenciasController.run.bind(getDependenciasController)
);

// Aquí puedes añadir más rutas para dependencias en el futuro
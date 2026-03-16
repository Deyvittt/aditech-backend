import express from 'express';
import { getDependenciasController } from './dependencies';

export const dependenciaRouter = express.Router();

dependenciaRouter.get(
    '/', 
    getDependenciasController.run.bind(getDependenciasController)
);


import express from 'express';
import {
    getDireccionesController,
    getDireccionesByDependenciaController
} from './dependencies';

const direccionRouter = express.Router();

direccionRouter.get('/', (req, res) => getDireccionesController.run(req, res));
direccionRouter.get('/dependencias/:dependenciaId', (req, res) => getDireccionesByDependenciaController.run(req, res));

export { direccionRouter };
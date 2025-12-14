import express from 'express';
import { getCargosController } from './dependencies';

const cargoRouter = express.Router();

cargoRouter.get('/', (req, res) => getCargosController.run(req, res));

export { cargoRouter };
import { GetDireccionesByDependenciaUseCase } from "../application/GetDireccionesByDependenciaUseCase";
import { GetDireccionesUseCase } from "../application/GetDireccionesUseCase";

import { GetDireccionesByDependenciaController } from "./controllers/GetDireccionesByDependenciaController";
import { GetDireccionesController } from "./controllers/GetDireccionesController";

import { MysqlDireccionRepository } from "./MysqlDireccionRepository";

const mysqlDireccionRepository = new MysqlDireccionRepository();

const getDireccionesUseCase = new GetDireccionesUseCase(mysqlDireccionRepository);
const getDireccionesByDependenciaUseCase = new GetDireccionesByDependenciaUseCase(mysqlDireccionRepository);

export const getDireccionesController = new GetDireccionesController(getDireccionesUseCase);
export const getDireccionesByDependenciaController = new GetDireccionesByDependenciaController(getDireccionesByDependenciaUseCase);
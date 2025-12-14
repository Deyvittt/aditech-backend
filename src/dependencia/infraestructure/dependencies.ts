import { GetDependenciasUseCase } from "../application/GetDependenciasUseCase";

import { GetDependenciasController } from "./controllers/GetDependenciasController";

import { MysqlDependenciaRepository } from "./MysqlDependenciaRepository";

const mysqlDependenciaRepository = new MysqlDependenciaRepository();

const getDependenciasUseCase = new GetDependenciasUseCase(mysqlDependenciaRepository);

export const getDependenciasController = new GetDependenciasController(getDependenciasUseCase);
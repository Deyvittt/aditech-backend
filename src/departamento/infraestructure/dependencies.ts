import { GetDepartamentosByDireccionIdUseCase } from "../application/GetDepartamentosByDireccionIdUseCase";
import { GetDepartamentosUseCase } from "../application/GetDepartamentosUseCase";

import { GetDepartamentosByDireccionIdController } from "./controllers/GetDepartamentosByDireccionIdController";
import { GetDepartamentosController } from "./controllers/GetDepartamentosController";

import { MysqlDepartamentoRepository } from "./MysqlDepartamentoRepository";

const mysqlDepartamentoRepository = new MysqlDepartamentoRepository();

const getDepartamentosUseCase = new GetDepartamentosUseCase(mysqlDepartamentoRepository);
const getDepartamentosByDireccionIdUseCase = new GetDepartamentosByDireccionIdUseCase(mysqlDepartamentoRepository);

export const getDepartamentosController = new GetDepartamentosController(getDepartamentosUseCase);
export const getDepartamentosByDireccionIdController = new GetDepartamentosByDireccionIdController(getDepartamentosByDireccionIdUseCase);
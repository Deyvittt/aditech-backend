import { AddContratoUseCase } from "../application/AddContratoUseCase";
import { GetContratosByEnlaceUseCase } from "../application/GetContratosByEnlaceUseCase";
import { GetContratosUseCase } from "../application/GetContratosUseCase";
import { GetAllContratoDetalladoUseCase } from "../application/GetAllContratoDetalladoUseCase";
import { GetAllContratoDetalladoByEnlaceUseCase } from "../application/GetAllContratoDetalladoByEnlaceUseCase";
import { GetContratoDetalladoByIdUseCase } from "../application/GetContratoDetalladoByIdUseCase";
import { UpdateContratoUseCase } from "../application/UpdateContratoUseCase";
import { DeleteContratoUseCase } from "../application/DeleteContratoUseCase";
import { GetAllTipoInstalacionUseCase } from "../application/GetAllTipoInstalacionUseCase";
import { GetAllTipoContratoUseCase } from "../application/GetAllTipoContratoUseCase";
import { GetAllVersionContratoUseCase } from "../application/GetAllVersionContratoUseCase";
import { GetVersionesByTipoContratoIdUseCase } from "../application/GetVersionesByTipoContratoIdUseCase";

import { AddContratoController } from "./controllers/AddContratoController";
import { GetContratosByEnlaceController } from "./controllers/GetContratosByEnlaceController";
import { GetContratosController } from "./controllers/GetContratosController";

import { GetAllContratoDetalladoController } from "./controllers/GetAllContratoDetalladoController"; 
import { GetAllContratoDetalladoByEnlaceController } from "./controllers/GetAllContratoDetalladoByEnlaceController";
import { GetContratoByIdController } from "./controllers/GetContratoByIdController";
import { UpdateContratoController } from "./controllers/UpdateContratoController";
import { DeleteContratoController } from "./controllers/DeleteContratoController";
import { GetAllTipoInstalacionController } from "./controllers/GetAllTipoInstalacionController";
import { GetAllTipoContratoController } from "./controllers/GetAllTipoContratoController";
import { GetAllVersionContratoController } from "./controllers/GetAllVersionContratoController";
import { GetVersionesByTipoContratoIdController } from "./controllers/GetVersionesByTipoContratoIdController";


import { MysqlContratoRepository } from "./adapters/MysqlContratoRepository";

//Instancia del Repositorio
const mysqlContratoRepository = new MysqlContratoRepository();

//Instancias de Casos de Uso
const addContratoUseCase = new AddContratoUseCase(mysqlContratoRepository);
const getContratoByEnlaceUseCase = new GetContratosByEnlaceUseCase(mysqlContratoRepository);
const getContratosUseCase = new GetContratosUseCase(mysqlContratoRepository);
const getAllContratoDetalladoUseCase = new GetAllContratoDetalladoUseCase(mysqlContratoRepository);
const getAllContratoDetalladoByEnlaceUseCase = new GetAllContratoDetalladoByEnlaceUseCase(mysqlContratoRepository);
const getContratoDetalladoByIdUseCase = new GetContratoDetalladoByIdUseCase(mysqlContratoRepository);
const updateContratoUseCase = new UpdateContratoUseCase(mysqlContratoRepository);
const deleteContratoUseCase = new DeleteContratoUseCase(mysqlContratoRepository);
const getAllTipoInstalacionUseCase = new GetAllTipoInstalacionUseCase(mysqlContratoRepository);
const getAllTipoContratoUseCase = new GetAllTipoContratoUseCase(mysqlContratoRepository);
const getAllVersionContratoUseCase = new GetAllVersionContratoUseCase(mysqlContratoRepository);
const getVersionesByTipoContratoIdUseCase = new GetVersionesByTipoContratoIdUseCase(mysqlContratoRepository);

//Instancias de Controladores
export const addContratoController = new AddContratoController(addContratoUseCase);
export const getContratoByEnlaceController = new GetContratosByEnlaceController(getContratoByEnlaceUseCase);
export const getContratosController = new GetContratosController(getContratosUseCase);
export const getAllContratoDetalladoController = new GetAllContratoDetalladoController(getAllContratoDetalladoUseCase);
export const getAllContratoDetalladoByEnlaceController = new GetAllContratoDetalladoByEnlaceController(getAllContratoDetalladoByEnlaceUseCase);
export const updateContratoController = new UpdateContratoController(updateContratoUseCase);
export const deleteContratoController = new DeleteContratoController(deleteContratoUseCase);
export const getAllTipoInstalacionController = new GetAllTipoInstalacionController(getAllTipoInstalacionUseCase);
export const getAllTipoContratoController = new GetAllTipoContratoController(getAllTipoContratoUseCase);
export const getAllVersionContratoController = new GetAllVersionContratoController(getAllVersionContratoUseCase);
export const getVersionesByTipoContratoIdController = new GetVersionesByTipoContratoIdController(getVersionesByTipoContratoIdUseCase);
export const getContratoByIdController = new GetContratoByIdController(getContratoDetalladoByIdUseCase);
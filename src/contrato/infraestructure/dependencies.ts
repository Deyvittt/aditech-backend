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
// CORRECCIÓN 1: El nombre de la clase aquí era incorrecto
import { GetAllContratoDetalladoController } from "./controllers/GetAllContratoDetalladoController"; 
import { GetAllContratoDetalladoByEnlaceController } from "./controllers/GetAllContratoDetalladoByEnlaceController";
import { GetContratoByIdController } from "./controllers/GetContratoByIdController"; // Importamos el nuevo
import { UpdateContratoController } from "./controllers/UpdateContratoController";
import { DeleteContratoController } from "./controllers/DeleteContratoController";
import { GetAllTipoInstalacionController } from "./controllers/GetAllTipoInstalacionController";
import { GetAllTipoContratoController } from "./controllers/GetAllTipoContratoController";
import { GetAllVersionContratoController } from "./controllers/GetAllVersionContratoController";
import { GetVersionesByTipoContratoIdController } from "./controllers/GetVersionesByTipoContratoIdController";

// CORRECCIÓN 2: La ruta a tu repositorio estaba mal
import { MysqlContratoRepository } from "./adapters/MysqlContratoRepository";

// 1. Instancia del Repositorio (No necesita ser exportado si solo se usa aquí)
const mysqlContratoRepository = new MysqlContratoRepository();

// 2. Instancias de Casos de Uso
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

// 3. Instancias de Controladores (Estos sí se exportan para el Router)
export const addContratoController = new AddContratoController(addContratoUseCase);
export const getContratoByEnlaceController = new GetContratosByEnlaceController(getContratoByEnlaceUseCase);
export const getContratosController = new GetContratosController(getContratosUseCase);
// CORRECCIÓN 3: El nombre de la clase aquí también era incorrecto
export const getAllContratoDetalladoController = new GetAllContratoDetalladoController(getAllContratoDetalladoUseCase);
export const getAllContratoDetalladoByEnlaceController = new GetAllContratoDetalladoByEnlaceController(getAllContratoDetalladoByEnlaceUseCase);
export const updateContratoController = new UpdateContratoController(updateContratoUseCase);
export const deleteContratoController = new DeleteContratoController(deleteContratoUseCase);
export const getAllTipoInstalacionController = new GetAllTipoInstalacionController(getAllTipoInstalacionUseCase);
export const getAllTipoContratoController = new GetAllTipoContratoController(getAllTipoContratoUseCase);
export const getAllVersionContratoController = new GetAllVersionContratoController(getAllVersionContratoUseCase);
export const getVersionesByTipoContratoIdController = new GetVersionesByTipoContratoIdController(getVersionesByTipoContratoIdUseCase);
// Se añade el nuevo controlador que necesitamos
export const getContratoByIdController = new GetContratoByIdController(getContratoDetalladoByIdUseCase);
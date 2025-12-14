// Casos de Uso
import { AddEnlaceUseCase } from "../application/AddEnlaceUseCase";
import { GetEnlaceByIdUseCase } from "../application/GetEnlaceByIdUseCase";
import { GetEnlacesByEstatusUseCase } from "../application/GetEnlacesByEstatusUseCase";
import { GetAllEnlaceDetalladoUseCase } from "../application/GetAllEnlaceDetalladoUseCase";
import { GetEnlaceCompletoByIdUseCase } from "../application/GetEnlaceCompletoByIdUseCase";
import { GetEnlacesUseCase } from "../application/GetEnlacesUseCase";
import { UpdateEnlaceUseCase } from "../application/UpdateEnlaceUseCase";
import { DeleteEnlaceUseCase } from "../application/DeleteEnlaceUseCase";
import { GetEnlaceByDireccionUseCase } from "../application/GetEnlaceByDireccionUseCase";

// Controladores
import { AddEnlaceController } from "./controllers/AddEnlaceController";
import { GetEnlaceByIdController } from "./controllers/GetEnlaceByIdController";
import { GetEnlacesByEstatusController } from "./controllers/GetEnlacesByEstatusController";
import { GetAllEnlaceDetalladoController } from "./controllers/GetAllEnlaceDetalladoController";
import { GetEnlacesController } from "./controllers/GetEnlacesController";
import { GetEnlaceCompletoByIdController } from "./controllers/GetEnlaceCompletoByIdController";
import { UpdateEnlaceController } from "./controllers/UpdateEnlaceController";
import { DeleteEnlaceController } from "./controllers/DeleteEnlaceController";
import { GetEnlaceByDireccionController } from "./controllers/GetEnlaceByDireccionController";

// Repositorio
import { MysqlEnlaceRepository } from "./MysqlEnlaceRepository"; // <-- RUTA CORREGIDA

// INSTANCIAS
export const mysqlEnlaceRepository = new MysqlEnlaceRepository();

export const addEnlaceUseCase = new AddEnlaceUseCase(mysqlEnlaceRepository);
export const getEnlaceByIdUseCase = new GetEnlaceByIdUseCase(mysqlEnlaceRepository);
export const getEnlacesByEstatusUseCase = new GetEnlacesByEstatusUseCase(mysqlEnlaceRepository);
export const getEnlacesUseCase = new GetEnlacesUseCase(mysqlEnlaceRepository);
export const getEnlaceCompletoByIdUseCase = new GetEnlaceCompletoByIdUseCase(mysqlEnlaceRepository);
export const getAllEnlaceDetalladoUseCase = new GetAllEnlaceDetalladoUseCase(mysqlEnlaceRepository);
export const updateEnlaceUseCase = new UpdateEnlaceUseCase(mysqlEnlaceRepository);
export const deleteEnlaceUseCase = new DeleteEnlaceUseCase(mysqlEnlaceRepository);
export const getEnlaceByDireccionUseCase = new GetEnlaceByDireccionUseCase(mysqlEnlaceRepository);

export const addEnlaceController = new AddEnlaceController(addEnlaceUseCase);
export const getEnlaceByIdController = new GetEnlaceByIdController(getEnlaceByIdUseCase);
export const getEnlacesByEstatusController = new GetEnlacesByEstatusController(getEnlacesByEstatusUseCase);
export const getEnlacesController = new GetEnlacesController(getEnlacesUseCase);
export const getEnlaceCompletoByIdController = new GetEnlaceCompletoByIdController(getEnlaceCompletoByIdUseCase);
export const getAllEnlaceDetalladoController = new GetAllEnlaceDetalladoController(getAllEnlaceDetalladoUseCase);
export const updateEnlaceController = new UpdateEnlaceController(updateEnlaceUseCase);
export const deleteEnlaceController = new DeleteEnlaceController(deleteEnlaceUseCase);
export const getEnlaceByDireccionController = new GetEnlaceByDireccionController(getEnlaceByDireccionUseCase);
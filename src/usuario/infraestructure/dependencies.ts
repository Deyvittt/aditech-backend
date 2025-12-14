import { AddUsuarioUseCase } from "../application/AddUsuarioUseCase";
import { ValidateLoginUseCase } from "../application/ValidateLoginUseCase";
// 1. IMPORTAMOS EL NUEVO CASO DE USO
import { GetAllUsuariosUseCase } from "../application/GetAllUsuariosUseCase"; 

import { LoginController } from "./controllers/LoginController";
import { RegisterController } from "./controllers/RegisterController";
// 2. IMPORTAMOS EL NUEVO CONTROLADOR
import { GetAllUsuariosController } from "./controllers/GetAllUsuariosController";

import { UpdateUsuarioController } from "./controllers/UpdateUsuarioController";
import { DeleteUsuarioController } from "./controllers/DeleteUsuarioController";

import { MysqlUsuarioRepository } from "./MysqlUsuarioRepository"; // Asegúrate que este archivo tenga la función getAllUsuarios()

import { EncryptService } from "./services/EncryptService";
import { TokenService } from "../../shared/infraestructure/services/TokenService";

const mysqlUsuarioRepository = new MysqlUsuarioRepository();

const encryptService = new EncryptService();
const tokenService = new TokenService();

const addUsuarioUseCase = new AddUsuarioUseCase(mysqlUsuarioRepository, encryptService);
const validateLoginUseCase = new ValidateLoginUseCase(mysqlUsuarioRepository, encryptService);
// 3. INSTANCIAMOS EL NUEVO CASO DE USO
const getAllUsuariosUseCase = new GetAllUsuariosUseCase(mysqlUsuarioRepository);

const registerController = new RegisterController(addUsuarioUseCase);
const loginController = new LoginController(validateLoginUseCase, tokenService);
// 4. INSTANCIAMOS EL NUEVO CONTROLADOR
const getAllUsuariosController = new GetAllUsuariosController(getAllUsuariosUseCase);
export const updateUsuarioController = new UpdateUsuarioController(mysqlUsuarioRepository);
export const deleteUsuarioController = new DeleteUsuarioController(mysqlUsuarioRepository);
// 5. LO EXPORTAMOS
export { 
    registerController, 
    loginController, 
    getAllUsuariosController 
};
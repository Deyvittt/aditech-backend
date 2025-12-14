import express from 'express';

import { 
    verifyToken, 
    isSuperusuario,
} from '../../middlewares/AuthMiddleware'; 

import {
    loginController,
    registerController,
    getAllUsuariosController,
    updateUsuarioController,
    deleteUsuarioController
} from './dependencies';

const usuarioRouter = express.Router();

// --- NUEVA RUTA GET (LISTAR USUARIOS) ---
// Esta ruta responde a GET /usuarios
usuarioRouter.get(
    '/', 
    verifyToken, 
    isSuperusuario,
    (req, res) => getAllUsuariosController.run(req, res)
);

// --- RUTAS EXISTENTES ---
usuarioRouter.post(
    '/auth/register', 
    verifyToken,    
    isSuperusuario,
    (req, res) => registerController.run(req, res) 
);

usuarioRouter.post(
    '/auth/login', 
    (req, res) => loginController.run(req, res) 
);

usuarioRouter.patch(
    '/:id', verifyToken, isSuperusuario, 
    (req, res) => updateUsuarioController.run(req, res)
);

usuarioRouter.delete(
    '/:id', verifyToken, isSuperusuario,
    (req, res) => deleteUsuarioController.run(req, res)
);

export { usuarioRouter };
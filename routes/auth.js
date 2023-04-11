// rutas de usuarios / auth
// host + /api/auth

const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt')

router.post(
    '/new',
    [
        //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'el email es obligatorio').isEmail(),
        check('password', ' el password debe de ser 6 caracteres').isLength({min:6}),
        validarCampos
    ],
     crearUsuario );

router.post(
    '/',
    [
        check('email', 'el email es obligatorio').isEmail(),
        check('password', ' el password debe de ser 6 caracteres').isLength({min:6}),
        validarCampos
    ],
     loginUsuario);

router.get('/renew',validarJWT ,revalidarToken);

module.exports = router;
// /api/events

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {getEventos,crearEvento,actualizarEvento,eliminarEvento} = require ('../controllers/events');
const {check} = require('express-validator');
const {validarCampos} = require ('../middlewares/validar-campos');
const {isDate} = require ('../helpers/isDate')
const router = Router();

//todas tienen que pasarpor la validacion del jwt

// obtener eventos

router.use(validarJWT);

router.get('/',getEventos);


//crear evento

router.post(
    '/',
    [
        check('title','el titulo es obligatorio').not().isEmpty(),
        check('start','fecha de inicio es obligatoria').custom(isDate),
        check('end','fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento);

//actualizar evento

router.put('/:id', actualizarEvento);

//actualizar evento

router.delete('/:id', eliminarEvento);

module.exports = router;
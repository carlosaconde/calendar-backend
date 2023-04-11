const express = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require("../models/Usuario");
const {generarJWT} = require ('../helpers/jwt')

const crearUsuario = async (req, res = express.response) => {
  
  const { email, password } = req.body;
  
  try {

    let usuario = await Usuario.findOne({email});
    if ( usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'un usuario ya existe con ese correo'
      });
    }

     usuario = new Usuario(req.body);
    
    // encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password  = bcrypt.hashSync(password, salt);

    await usuario.save();
    
    //Generar JWT

    const token = await generarJWT(usuario.id, usuario.name);
    console.log(token);

    //manejo de errores

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    res.status(500).json({
        ok: false,
        msg: 'por favor hable con el administrador'
    })
  }
};

const loginUsuario = async (req, res = express.response) => {
  const { email, password } = req.body;
  // console.log('se requiere el slash');


  try {
    
    const usuario = await Usuario.findOne({email});
    if ( !usuario ) {
      return res.status(400).json({
        ok: false,
        msg: 'el usuario no existe con ese mail'
      });
    }

    //confirmar los passwords

    const validPassword = bcrypt.compareSync(password,usuario.password);

    if(!validPassword){
      return res.status(400).json({
        ok: false,
        msg: 'password incorrecto'
      });
    }

    //Generar nuestro JWT

    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    })


  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'por favor hable con el administrador'
  })
  }


 
};

const revalidarToken = async (req, res = express.response) => {
  // console.log("se requiere el slash");

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT(uid,name);

  res.json({
    ok: true,
    token
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};


    const {response} = require('express');
    const Evento = require('../models/Evento')

    const getEventos = async (req,res=response)=>{

        const eventos = await Evento.find()
                                    .populate('user','name');

        res.json({
            ok:true,
            eventos
        });
    }

    const crearEvento = async (req,res=response)=>{
        // verificar que tiene el evento
        const evento = new Evento(req.body);

        try {
            evento.user = req.uid;
            
           const eventoGuardado=await evento.save()
            res.json({
                ok: true,
                evento: eventoGuardado
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'hable con el admin'
            });
        }


        res.json({
            ok:true,
        msg: 'crearEvento'
        });
    }

    const actualizarEvento = async(req,res=response)=>{
        
        const eventoId = req.params.id;
        const uid = req.uid;

        try {
            const evento = await Evento.findById(eventoId);
            if(!evento){
                return res.status(400).json({
                    ok: false,
                    msg: ' evento no existe por ese id '
                });
            }

            if(evento.user.toString() !== uid){
                return res.status(401).json({
                    ok: false,
                    msg: ' no tiene privilegio de editar este evento'
                });
            }

            const nuevoEvento = {
                ...req.body,
                user: uid
            }

            const eventoActualizado = await Evento.findByIdAndUpdate( eventoId,nuevoEvento);
            

            res.json({
                ok: true,
                evento: eventoActualizado
            });



        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'hable con el admin'
            });
        }

    }
    const eliminarEvento = async (req,res=response)=>{
        const eventoId = req.params.id;
        const uid = req.uid;

        try {
            const evento = await Evento.findById(eventoId);
            if(!evento){
                return res.status(400).json({
                    ok: false,
                    msg: ' evento no existe por ese id '
                });
            }

            if(evento.user.toString() !== uid){
                return res.status(401).json({
                    ok: false,
                    msg: ' no tiene privilegio de eliminar este evento'
                });
            }


            await Evento.findByIdAndRemove( eventoId );
            

            res.json({
                ok: true
                
            });



        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'hable con el admin'
            });
        }
    }

    module.exports = {


        getEventos,
        crearEvento,
        actualizarEvento,
        eliminarEvento
    }
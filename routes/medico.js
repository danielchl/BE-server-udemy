var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ***************************
// OBTENER TODOS LOS MEDICOS
// ***************************
app.get('/', (req, res, next) => {

    var desde =  req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email') // busca la info del campo especificado del cual tenemos el id
        .populate('hospital')
        .exec(
            ( err, hospitales) => {
                if ( err ){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count( (err, conteo) => {
                    
                    res.status(200).json({
                        ok: true,
                        hospitales,
                        total: conteo
                    })
                } )

            }
        )
});

// ***************************
// Actualizar Medico
// ***************************
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;

    var body = req.body;

    Medico.findById( id, ( err, medico ) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if( !medico ){
            return res.status(400).json({
                ok: false,
                mensaje: `No existe el medico con el id ${id}`,
                errors: err
            })
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( ( err, medicoGuardado) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se puedo actualizar el medico',
                    errors: err
                })
            }

            res.status(200).json({
                ok:true,
                medicoGuardado
            })
        } );

    });

})


// ***************************
// CREAR TODOS  MEDICO
// ***************************
app.post('/', mdAutenticacion.verificaToken, ( req, res, next) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( ( err, medicoGuardado ) => {
        if( err ){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear medico',
                errors: err
            })
        }

        res.status(200).json({
            ok:true,
            medicoGuardado
        });

    } );

});

// ***************************
// BORRAR  HOSPITAL
// ***************************

app.delete('/:id', mdAutenticacion.verificaToken, (req, res, next) => {
    var id = req.params.id;
    
    Medico.findByIdAndRemove( id, ( err, medicoBorrado ) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el medico',
                errors: err
            });
        }

        if( !medicoBorrado ){
            return res.status(400).json({
                ok: false,
                mensaje: `No existe el medico con el id ${id}`,
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            medicoBorrado
        })
    });

})

module.exports = app;
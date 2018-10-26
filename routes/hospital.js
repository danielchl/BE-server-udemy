var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// Rutas
// ***************************
// OBTENER TODOS LOS HOSPITALES
// ***************************
app.get('/', (req, res, next)=>{

    var desde =  req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({ })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec(
        ( err, hospitales ) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                })
            }

            Hospital.count( (err, conteo) => {
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
// Actualizar HOSPITAL
// ***************************
app.put('/:id', (req, res, next) =>{

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, (err, hospital) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            })
        }

        if( !hospital ){
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' +  id + 'no existe',
                errors: { message: 'No existe un hospital con ese id' }
            })
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( ( err, hospitalGuardado ) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al guardar hospital',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                hospitalGuardado
            })
        }  );
    } );
});

// ***************************
// Crear HOSPITAL
// ***************************
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( ( err ,  hospitalGuardado) => {
        if( err ){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok:true,
            hospitalGuardado
        })

    });
    
});

// ***************************
// BORRAR  HOSPITAL
// ***************************
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            })
        }

        if( !hospitalBorrado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            }) 
        }

        res.status(200).json({
            ok: true,
            hospitalBorrado
        })
    })

});


module.exports = app;
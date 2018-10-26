var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());


// Rutas
app.put('/:tipo/:id', (req, res, next) => { 

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    
    if( tiposValidos.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok:false,
            mensaje: 'Tipo no valida',
            error: {message: 'Los tipos validos son ' + tiposValidos.join(', ')}
        })
    }

    if( !req.files ){
        return res.status(400).json({
            ok:false,
            mensaje: 'No seleccion nada',
            error: {message: 'No selecciono imagen'}
        })
    }

    //Obtener nombre de archivo
    var archivo = req.files.imagen;
    var splittedFile = archivo.name.split('.');
    var fileExtention = splittedFile[ splittedFile.length - 1 ];


    //Validación de extenciones
    var extentions = ['png', 'jpg', 'jpeg', 'gif'];

    if ( extentions.indexOf(fileExtention) < 0 ){
        return res.status(400).json({
            ok:false,
            mensaje: 'Extención no valida',
            error: {message: 'Las extenciones validas son ' + extentions.join(', ')}
        })
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${fileExtention}`


    // Mover archivo temporal a un path 
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv( path, ( err ) => {
        if( err ){
            return res.status(400).json({
                ok:false,
                mensaje: 'Error a mover archivo',
                error: err
            })
        }

        subirPorTipo( tipo, id, nombreArchivo, res )

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido'
        // })
    
    }  );

 } );

 function subirPorTipo( tipo, id, nombreArchivo, res ){

    if( tipo === 'usuarios' ){

        Usuario.findById( id, (err, usuario) => {

            if( !usuario ){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Usuario no existe',
                    error: err
                })
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe elimana la imagen anterior
            if (  fs.existsSync(pathViejo) ){
                fs.unlink(pathViejo)
            }

            usuario.img = nombreArchivo;


            usuario.save( (err, usuarioActualizado) => {
                usuarioActualizado.password = 'xxx';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizado',
                    usuario: usuarioActualizado
                })
            } );


        })

    }

    if( tipo === 'hospitales' ){

        Hospital.findById(id , (err, hospital) => {

            if( !hospital ){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Hospital no existe',
                    error: err
                })
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe elimana la imagen anterior
            if (  fs.existsSync(pathViejo) ){
                fs.unlink(pathViejo)
            }
            
            hospital.img = nombreArchivo;

            hospital.save( (err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                })
            } );

        })
        
    }

    if( tipo === 'medicos' ){
        Medico.findById(id , (err, medico) => {

            if( !medico ){
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Medico no existe',
                    error: err
                })
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // si existe elimana la imagen anterior
            if (  fs.existsSync(pathViejo) ){
                fs.unlink(pathViejo)
            }
            
            medico.img = nombreArchivo;

            medico.save( (err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                })
            } );

        })
    }

 }


 module.exports = app;
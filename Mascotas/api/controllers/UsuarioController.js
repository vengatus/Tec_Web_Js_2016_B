/**
 * UsuarioController
 *
 * @description :: Server-side logic for managing Usuarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {

    crearUsuario: function (req, res) {
        if (req.method == "POST") {
            var parametros = req.allParams();

            if (parametros.nombres && parametros.apellidos) {
                var usuarioCrear = {
                    nombres: parametros.nombres,
                    apellidos: parametros.apellidos,
                    correo: parametros.correo
                }
                Usuario.create(usuarioCrear).exec(function (err, usuarioCreado) {
                    if (err) {
                        return res.view('vistas/Error', {
                            error: {
                                desripcion: "Fallo al crear el Usuario",
                                rawError: err,
                                url: "/CrearUsuario"
                            }
                        });
                    }
                    return res.redirect('/login?correo='+usuarioCreado.correo);

                })

            } else {
                return res.view('vistas/Error', {
                    error: {
                        desripcion: "Llena todos los parametros, apellidos y nombres",
                        rawError: "Fallo en envio de parametros",
                        url: "/CrearUsuario"
                    }

                });
            }
        } else {
            return res.view('vistas/Error', {
                error: {
                    desripcion: "Error en el uso del Metodo HTTP",
                    rawError: "HTTP Invalido",
                    url: "/CrearUsuario"
                }
            });

        }
    },
    borrarUsuario: function (req, res) {
        var param = req.allParams()
        if (param.id) {
            Usuario.destroy({
                id: param.id
            }).exec(function (errorInesperado, UsuarioRemovido) {
                if (errorInesperado) {
                    return res.view('vistas/Error', {
                        error: {
                            desripcion: "Se tuvo un error",
                            rawError: "Error inesperado",
                            url: "/listarUsuarios"
                        }
                    });
                }

                if(UsuarioRemovido[0].id==req.session.credencialSegura.id){
                  return res.redirect('/auth/logout');
                }
                return res.redirect('/ListarUsuarios');
            })
        } else {
            return res.view('vistas/Error', {
                error: {
                    desripcion: "Se necesita un ID para borrar al usuario",
                    rawError: "No envia ID",
                    url: "/listarUsuarios"
                }
            });
        }
    },
    editarUsuario: function (req, res) {
        var param = req.allParams()
        if (param.idUsuario && (param.nombres || param.apellidos || param.correo)) {

            var usuarioEditar={
                nombres:param.nombres,
                apellidos:param.apellidos,
                correo:param.correo
            }

            if(usuarioEditar.nombres==""){
                delete usuarioEditar.nombres
            }
            if(usuarioEditar.apellidos==""){
                delete usuarioEditar.apellidos
            }
            if(usuarioEditar.correo==""){
                delete usuarioEditar.correo
            }


            Usuario.update({
                id: param.idUsuario
            },usuarioEditar).exec(function (errorInesperado, UsuarioRemovido) {
                if (errorInesperado) {
                    return res.view('vistas/Error', {
                        error: {
                            desripcion: "Se tuvo un error",
                            rawError: "Error inesperado",
                            url: "/listarUsuarios"
                        }
                    });
                }
                Usuario.find()
                    .exec(function (errorIndefinido, usuariosEncontrados) {

                        if (errorIndefinido) {
                            res.view('vistas/Error', {
                                error: {
                                    desripcion: "Hubo un problema cargando los Usuarios",
                                    rawError: errorIndefinido,
                                    url: "/listarUsuarios"
                                }
                            });
                        }

                        res.view('vistas/Usuario/listarUsuarios', {
                            usuarios: usuariosEncontrados
                        });
                    })
            })
        } else {
            return res.view('vistas/Error', {
                error: {
                    desripcion: "Es necesario llenar los campos",
                    rawError: "No envia ID",
                    url: "/listarUsuarios"
                }
            });
        }
    }

};

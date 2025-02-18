const jwt = require("jwt-simple");
const moment = require("moment");

//importar clave secreta

const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//Autenticacion.

exports.auth = (req, res, next) => {
  // comprobar si llega la cabecera de autenticacion

  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: " la peticion  no tiene  la cebecera  de autenticacion",
    });
  }

  //limpiar  el token

  let token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    let payload = jwt.decode(token, secret);

    if (payload.exp <= moment().unix()) {
      res.status(401).send({
        status: "error",
        message: "token expirado",
        error,
      });
    }

    //agregar datos de usuario  a request
    req.user = payload;

    next();
  } catch (error) {
    res.status(404).send({
      status: "error",
      message: "token invalido",
      error,
    });
  }
};

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");
const { matches } = require("validator");

const register = async (req, res) => {
  try {
    // Capturar los datos de la petición
    let params = req.body;

    // Validar los datos
    if (!params.name || !params.email || !params.password || !params.nick) {
      return res.status(400).json({
        message: "Faltan datos por enviar",
        status: "error",
      });
    }

    // Convertir email y nick a minúsculas antes de la consulta
    const email = params.email.toLowerCase();
    const nick = params.nick.toLowerCase();

    // Buscar usuarios duplicados

    const users = await User.find({
      $or: [{ email: email }, { nick: nick }],
    });

    if (users.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "El usuario ya existe",
      });
    }

    // Cifrar la contraseña correctamente con `bcrypt`
    const hashedPassword = await bcrypt.hash(params.password, 10);

    // Crear un objeto de usuario con la contraseña cifrada
    let user_to_save = new User({
      name: params.name,
      email: email,
      nick: nick,
      password: hashedPassword,
    });

    // Guardar usuario en la base de datos con `await`

    const userStored = await user_to_save.save();

    return res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente",
      user: userStored,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el registro de usuario",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // Capturar los datos que llegan en la petición

    const params = req.body;

    if (!params.email || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    // Verificar en la BD si existe el usuario

    const user = await User.findOne({ email: params.email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "El usuario no existe",
      });
    }

    // Verificar la contraseña

    const passwordMatch = await bcrypt.compare(params.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Contraseña incorrecta",
      });
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Crear respuesta con solo los campos necesarios

    const userResponse = {
      id: userWithoutPassword._id,
      name: userWithoutPassword.name,
      nick: userWithoutPassword.nick,
    };

    const token = jwt.createToken(user);

    // Respuesta con los datos del usuario

    res.status(200).json({
      status: "success",
      message: "Login exitoso",
      user: userResponse,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

const profile = async (req, res) => {
  try {
    // Recibir el ID de la petición.

    const id = req.params.id;

    // Consultar los datos del usuario
    const userProfile = await User.findById(id).select(
      "id name nick email __v  create_at "
    );

    // Si no se encuentra el usuario
    if (!userProfile) {
      return res.status(404).send({
        status: "error",
        message: "El usuario no existe",
      });
    }

    // Devolver los datos consultados si es correcto.

    return res.status(201).send({
      status: "success",
      user: userProfile,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en la petición",
      error,
    });
  }
};

const ListProfiles = async (req, res) => {
  try {
    let page = parseInt(req.params.page) || 1;

    let itemsPerPage = 5;

    const users = await User.find()
      .sort("_id")
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    const total = await User.countDocuments();

    if (!users.length) {
      return res.status(404).send({
        status: "error",
        message: "No hay usuarios disponibles",
      });
    }

    return res.status(200).send({
      status: "success",
      users,
      page,
      itemsPerPage,
      total,
      pages: Math.ceil(total / itemsPerPage),
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en la consulta",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { email, nick, password, ...otherData } = req.body;

    // Copia segura de los datos del usuario autenticado
    let userToUpdate = { ...otherData };

    // Convertir email y nick a minúsculas si existen
    if (email) userToUpdate.email = email.toLowerCase();
    if (nick) userToUpdate.nick = nick.toLowerCase();

    // Verificar si el email o nick ya existen en otro usuario
    const existingUser = await User.findOne({
      $or: [{ email: userToUpdate.email }, { nick: userToUpdate.nick }],
      _id: { $ne: req.user._id }, // Excluir el usuario actual
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "El email o el nick ya están en uso",
      });
    }

    // Cifrar la nueva contraseña solo si se proporciona
    if (password) {
      userToUpdate.password = await bcrypt.hash(password, 10);
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      userToUpdate,
      {
        new: true, // Devuelve el usuario actualizado
        runValidators: true, // Aplica validaciones del esquema
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "No se pudo actualizar el usuario",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno en la actualización del usuario",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  profile,
  ListProfiles,
  update,
};

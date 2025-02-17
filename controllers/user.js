const User = require("../models/user");
const bcrypt = require("bcrypt");

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

    // Cifrar la contraseña correctamente con `await`
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

    // Retornar token (si usas JWT, por ejemplo)
    // const token = generateToken(user); // Implementar generateToken()

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

module.exports = {
  register,
  login,
};

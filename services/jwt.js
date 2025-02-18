const jwt = require("jwt-simple");
const moment = require("moment");

//clave para proteger tokend

const secret= "CLAVE_SECRETA_DE_LA_RED_SOCIAL_981236237890#"; 

//Funcion  para generar tokend

const createToken = (user)=>{
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat:moment().unix(),
        exp:moment().add(1,"days").unix(),
    };

    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken,
}

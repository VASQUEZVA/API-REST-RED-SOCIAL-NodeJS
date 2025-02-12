
const pruebaPublication = (req, res)=> {

    return res.status(200).send({
        message: "mensaje enviado desde: controller(/publication"
    });
}

 module.exports ={
    pruebaPublication
 }
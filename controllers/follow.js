
const pruebafollow = (req, res)=> {

    return res.status(200).send({
        message: "mensaje enviado desde: controller(/follow"
    });
}

 module.exports ={
    pruebafollow
 }
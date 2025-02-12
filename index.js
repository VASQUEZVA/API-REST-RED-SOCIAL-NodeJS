// conexion a la base de datos

const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("red social arrancada correctamente");

// conxino a db

connection();

// crear  servidor

const app = express();
const port = 3000;

// configurar cors
app.use(cors());

// Convertir los datos del body a objetos js

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// cargar rutas de prueba

const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use("/api", UserRoutes);
app.use("/api", PublicationRoutes);
app.use("/api", FollowRoutes)

// Poner servidor a escuchar http



app.listen(port,()=>{
    console.log("Servidor de  node corriendo en el puerto:",port)
})
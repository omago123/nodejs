import express from "express";
import router from "./routes/user.js"
import dotenv from "dotenv"

dotenv.config({path:'.env-local'}); 

const PORT = process.env.PORT 

const app = express();  


/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({extended:false}));


/**
 *  Routes
 */
app.get('/', (request, response) =>{
    response.status(200).send("This is not why you`re here. Head to /user/:id and replace :id with your user id")  
})


app.use('/user', router);

/**Start listening */
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`)
})
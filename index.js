import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectMongoose } from "./src/config/db.js";
import {authRouter} from "./src/routes/index.js"
import { errorHanlder } from "./src/middlewares/errorHandler.js";
import { responseClient } from "./src/middlewares/responseClient.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.get("/", (req,res)=>{
    responseClient({ req, res, message:" Server is live."})
})

app.use("/api/v1/auth", authRouter)


app.use(errorHanlder);
const startServer = async () =>{
    try{
        const con = await connectMongoose();
        if(con){
            app.listen(port, (error) => {
                error
                  ? console.log(error)
                  : console.log("Server is up and running at: http://localhost:" + port);
              })
        } else{
            console.log("Error in database connection.");
        }
        
    } catch(error){
        console.log(error.message);
        process.exit(1);
    }

}
startServer();


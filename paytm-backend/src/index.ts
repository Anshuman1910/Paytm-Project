
import  express  from "express";
import cors from "cors";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { MONGO_URI,PORT,JWT_SECRET} from "./config";
import { router as mainRouter } from "./routes";
const app = express();

app.use(cors())
app.use(express.json())

declare global {
    namespace Express {
      export interface Request {
        userId:string|JwtPayload
      }
    }
  }

app.use("/api/v1",mainRouter)


async function startServer(){
     await mongoose.connect(MONGO_URI).then(()=>{
      app.listen(PORT,()=>{
         console.log(`Server is running on port ${PORT}`)
      })
   })
}

startServer()
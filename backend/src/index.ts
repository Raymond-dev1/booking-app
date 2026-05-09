import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import routes from "./routes/index.routes.js"

dotenv.config()



const app =express()
const  server =http.createServer(app) 

app.use(express.json())
app.use(routes)


app.get("/",function(req, res){
    res.send("this route works")
})

app.get('/health',function(req, res){
  res.json({ status: 'ok', timestamp: new Date() });
});



const PORT = process.env.PORT

server.listen(PORT , () => {
    console.log(`Server is running on ${PORT}` )
})
import express from "express"
import { MongoClient } from "mongodb";
const app = express();
app.use(express.json())
import cors from "cors"
app.use(cors())
const PORT = process.env.PORT || 5000
console.log(PORT)
import * as dotenv from "dotenv"
dotenv.config()

//Mongo connection
const MONGO_URL = process.env.MONGO_URL
// console.log(MONGO_URL)
async function createConnection() {
    let client = new MongoClient(MONGO_URL)
    await client.connect()
    console.log("MongoDB is connected")
    return client
}

const client = await createConnection()

app.get("/", (req, res) => {
    res.send({
        message: `Welcome to products`
    })
})

app.get("/products", async (req, res) => {
    const products = await client.db("B46_Products").collection("Product").find().toArray()
    res.send({
        message:"Successfull",
        products
    })
})

app.get("/products/:id", async (req, res) => {
    const id = req.params.id
    const product = await client.db("B46_Products").collection("Product").findOne({id:id})
    res.send({
        message:"Successfull",
        product
    })
})

app.delete("/products/:id", async (req, res) => {
    const id = req.params.id
    const product = await client.db("B46_Products").collection("Product").deleteOne({id:id})
    res.send({
        message:"Successfull",
        product
    })
})

app.post("/addprod",async(req,res)=>{
    let newProd = req.body
    let final = await client.db("B46_Products").collection("Product").insertMany(newProd)
    res.send({
        message:"Added successfully",
        final
    })
}) 

app.put('/editprod/:id',async(req,res)=>{
    let editProd = req.body
    // let id
    let update=await client.db('B46_Products').collection('Product').updateOne({id:req.params.id},{ $set:editProd})
    res.send({
        message:'Updated Successfully',
        update

    })
})

app.listen(PORT, () => console.log(`Server  listening in ${PORT}`))
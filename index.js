const express=require('express')
const app=express()
const dotEnv=require('dotenv')


const mongoose=require('mongoose')
const TodoTask = require("./models/TodoTask");
dotEnv.config()

app.use("/static",express.static("public"))
app.use(express.urlencoded({ extended: true }));


const mongoString=mongoose.connect(process.env.DB_CONNECT )
.then(()=>
{
    console.log("Database connected Succesfully..")
})
.catch((error)=>{
    console.log("Error",error)
}
)

const PORT=4000
app.listen(PORT,()=>
{
    console.log(`server runing with ${PORT}`)
})

//view engine Configuration
app.set("view engine","ejs")

//POST METHOD
app.post("/",async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    console.log("todoTask=",todoTask)
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });
// GET METHOD
app.get("/",async (req, res) => {
   try{
   let a =await TodoTask.find()
    res.render("todo.ejs", { todoTasks: a });
   }
   catch(err)
   {
    res.send(err)
   }
});
//UPDATE
app.route("/edit/:id")
.get(async (req, res) => {
    const id = req.params.id;

    try {
        const tasks = await TodoTask.find();
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (err) {
        res.status(500).send(err);
    }
})
.post(async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
        res.redirect("/");
    } catch (err) {
        res.status(500).send(err);
    }
});
//Delete 

app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndDelete(id);
        res.redirect("/");
    } catch (err) {
        res.status(500).send(err);
    }
});




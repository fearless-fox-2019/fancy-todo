if(!process.env.NODE_ENV || process.env.NODE_ENV === "development"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const route = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const port = 3000;


mongoose.connect("mongodb://localhost/todo-db", {useNewUrlParser: true}, function(err){
    if(err) throw err;
    else console.log("database OK");
});


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


app.use("/", route);
app.use(errorHandler);


app.listen(port, () => console.log(`run on port ${port}`));
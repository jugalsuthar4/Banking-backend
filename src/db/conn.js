

const mongoose=require('mongoose')
mongoose.connect("mongodb+srv://jugal:jugal@cluster0.ncj1n.mongodb.net/Customers_database?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>console.log("connection successful"))
.catch((err)=>console.log(err))


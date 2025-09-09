const mongoose = require("mongoose");
const initData = require ("./data.js");
const Listing = require("../MODELS/listing.js");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';

main().then(()=>{
console.log("connection to Db")
}).catch((err)=>{
console.log(err)
});

async function main(){
    await mongoose.connect(MONGO_URL)
};
const intDb = async()=>{
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=> ({...obj , owner:"68b1ed20329d6407ba15b241"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
};
intDb();

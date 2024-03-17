import mongoose from 'mongoose'
import  colors  from 'colors';
 

//mongodb connection 

const connection = async() => {
   try{
      
      console.log(process.env.MONGO_URL)
    const connection=await mongoose.connect("mongodb+srv://imankushroy:AjZSXKoTycBjn64U@alikeminds-cluster.8jbqt0y.mongodb.net/alikemindsDB?retryWrites=true&w=majority")
    console.log(`connected to MongoDB database ${connection.connection.host}`.bgGreen.white)
   }catch(error){
    console.log(`error in mongodb ${error}`.bgRed.white)
   }
}
export default connection;
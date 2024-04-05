import mongoose from "mongoose";
const connect = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB Atlas");
      return;
    }
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
    process.exit(1);
  }
};

export default connect;

import mongoose from "mongoose";
import colors from "colors";

//mongodb connection

const connection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `connected to MongoDB database ${connection.connection.host}`.bgGreen
        .white
    );
  } catch (error) {
    console.log(`error in mongodb ${error}`.bgRed.white);
  }
};
export default connection;

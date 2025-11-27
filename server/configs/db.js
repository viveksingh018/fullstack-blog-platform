import mongoose from "mongoose";

// MongoDB connection function
const connectDB = async () => {
  try {
    // Log once connection is established
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );

    // Connect to MongoDB database
    await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`);

  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;

import mongoose from "mongoose";

export const connectMongoose = async () => {
  try {
   const con =  await mongoose.connect(process.env.MONGODB_URI);
    return con;
  } catch (error) {
    throw new Error("Unable to connect with database.")
  }
};

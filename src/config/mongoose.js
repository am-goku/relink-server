import mongoose from "mongoose"; //importing mongoose


// @desc    Mongoose configuration
// @file   < Config >
// @access  Private
export const connect = () => {
  mongoose.connect(
    process.env.MONGODB_SERVER,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // Check for database connection errors
  const db = mongoose.connection;
  db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
  db.once("open", () => {
    console.log("Connected to MongoDB database");
  });
};


export default connect;
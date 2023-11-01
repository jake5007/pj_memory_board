import dotenv from "dotenv";
import users from "./samples/users.js";
import posts from "./samples/posts.js";
import User from "./models/UserModel.js";
import Post from "./models/PostModel.js";
import connectDB from "./config/connectDB.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();

    const createdUsers = await User.insertMany(users);

    const samplePosts = posts.map((p, idx) => {
      const creator = createdUsers[idx + 1]._id;

      return {
        ...p,
        user: creator,
      };
    });

    await Post.insertMany(samplePosts);

    console.log("Data imported!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();

    console.log("Data destroyed");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

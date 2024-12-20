// const mongoose = require("mongoose");
// async function main() {

//   await mongoose.connect(
//     "mongodb+srv://arjuncvinod:gdozFKJP7i12I87s@cluster0.yjxy0xp.mongodb.net/todoListDB",
//     { useNewUrlParser: true }
//   );
//   // mongoose.connect("mongodb://127.0.0.1:27017/myblog") for local DB
//   console.log("post connected");
// }
// main()
const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myblog", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Post database connected successfully");
  } catch (err) {
    console.error("Post database connection error:", err);
  }
}

main();
const postSchema = new mongoose.Schema({
    author: String,
    title: String,
    content: String,
    thumbnail:String,
    date:Number,
    like:Number,
    likedby:[String],
    categories: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category'
        }],
        default: []  // Initialize as empty array by default
    }
});
  
const PosT = mongoose.model("post", postSchema);
module.exports = PosT
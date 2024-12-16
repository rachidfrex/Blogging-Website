const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const ejs = require("ejs");
const sessions = require("express-session");
// const collection = require("./mongodb");
const PosT = require("./postdb");
const Profile = require("./profiledb");
const Category = require("./models/categorydb");
// const conn = require("./connection")
let imagename
const multer = require("multer");
const { send, title } = require("process");
const { profile } = require("console");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/thumbnails");
  },
  filename: (req, file, cb) => {
    // console.log(file);

    cb(null, file.originalname);
    imagename = file.originalname;
  },
});
const upload = multer({ storage: storage });
let user;
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(
  sessions({
    secret: "secret key",
    saveUninitialized: true,
    resave: false,
  })
);

const visitSchema = new mongoose.Schema({
  visits: Number
});

const visits = mongoose.model("visits", visitSchema);
async function createAdminIfNotExists() {
  try {
    const adminExists = await Profile.findOne({ email: "admin@admin.com" });
    
    if (!adminExists) {
      const adminProfile = {
        username: "admin",
        email: "admin@admin.com",
        password: "admin",
        type: "admin",
        fullname: "Administrator",
        dp: "",
        bio: "Site Administrator",
        weblink: "",
        facebook: "",
        whatsapp: "",
        twitter: "",
        instagram: "",
        phoneno: "",
      };

      await Profile.create(adminProfile);
      console.log("Admin account created successfully");
    }
  } catch (err) {
    console.error("Error creating admin account:", err);
  }
}

createAdminIfNotExists();

// Middleware to fetch categories for all routes
app.use(async (req, res, next) => {
  try {
    res.locals.categories = await Category.find().lean();
    next();
  } catch (err) {
    next(err);
  }
});

// Category Routes - Note the order is important!
// 1. New Category Page (most specific)
// app.get("/categories/new", async (req, res) => {
//   if (req.session.type === "admin") {
//     try {
//       const categories = await Category.find().lean();
//       res.render("categories-new", { 
//         user: req.session.username,
//         categories: categories
//       });
//     } catch (err) {
//       res.status(500).render("error", { error: "Error loading categories" });
//     }
//   } else {
//     res.redirect("/");
//   }
//   });
app.get("/categories/new", async (req, res) => {
  console.log("Session type:", req.session.type);
  if (req.session.type === "admin") {
      try {
          const categories = await Category.find().lean();
          console.log("Found categories:", categories);
          res.render("categories-new", { 
              user: req.session.username,
              categories: categories
          });
      } catch (err) {
          console.error("Category error:", err);
          res.status(500).render("error", { error: "Error loading categories" });
      }
  } else {
      res.redirect("/");
  }
});
// 2. Delete Category
app.get("/categories/delete/:id", async (req, res) => {
  if (req.session.type === "admin") {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.redirect("/categories");
    } catch (err) {
      res.status(500).render("error", { error: "Error deleting category" });
    }
  }
});

// 3. List Categories
app.get("/categories", async (req, res) => {
  if (req.session.type === "admin") {
    try {
      const categories = await Category.find().lean();
      res.render("categories", { 
        categories, 
        user: req.session.username 
      });
    } catch (err) {
      res.status(500).render("error", { error: "Error loading categories" });
    }
  } else {
    res.redirect("/");
  }
});

// 4. Create Category
app.post("/categories", async (req, res) => {
  if (req.session.type === "admin") {
    try {
      const newCategory = new Category({
        name: req.body.name,
        description: req.body.description
      });
      await newCategory.save();
      res.redirect("/categories"); // Make sure this matches your categories list route
    } catch (err) {
      console.error("Error creating category:", err);
      res.status(500).render("error", { error: "Error creating category" });
    }
  } else {
    res.redirect("/");
  }
});

app.get("/home", async (req, res) => {
  if (req.session.useremail) {
    try {
      const [posts, sortedPosts] = await Promise.all([
        PosT.find().populate('categories').lean(),
        PosT.find().sort({ like: "desc" }).populate('categories').lean()
      ]);

      // Initialize empty categories array if undefined
      posts.forEach(post => {
        if (!post.categories) post.categories = [];
      });
      
      sortedPosts.forEach(post => {
        if (!post.categories) post.categories = [];
      });

      res.render("home", {
        user: req.session.username,
        posts: posts,
        date: Date.now(),
        sposts: sortedPosts
      });
    } catch (err) {
      console.log(err);
      res.render("error", { error: "Error fetching posts" });
    }
  } else {
    res.redirect("/");
  }
});
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  req.session.destroy(); 
  imagename=null
  res.redirect("/");
});
app.get("/signup",(req,res)=>{
  res.redirect("/")
})
app.post("/signup", async (req, res) => {
  try {
    const userExists = await Profile.exists({ username: req.body.name });
    
    if(!userExists) {
      const profileData = {
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: "user",
        fullname: req.body.name,
        dp: "",
        bio: "",
        weblink: "",
        facebook: "",
        whatsapp: "",
        twitter: "",
        instagram: "",
        phoneno: "",
      };

      await Profile.insertMany(profileData);
      req.session.useremail = req.body.email;
      req.session.username = req.body.name;
      res.redirect("home");
    } else {
      res.render("login", { error: "Username already exists" });
    }
  } catch (err) {
    res.render("login", { error: "Error creating account" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await Profile.findOne({ email: req.body.email });
    if (check.password === req.body.password) {
      if (check.type === "admin") {
        req.session.useremail = check.email;
        req.session.username = check.username;
        req.session.type = "admin"
        res.redirect("admin")
      } else {
        visits.findOneAndUpdate(
          { _id: "640cb99cd1ab2ecb248598b4" },
          { $inc: { visits: 1 } },
          (err) => {});
        req.session.useremail = check.email;
        req.session.username = check.username;
        req.session.type = "user"
        res.redirect("home");
      }
    } else {
      res.render("login", { error: "Invalid password" });
    }
  } catch {
    res.render("login", { error: "Invalid email or password" });
  }
});

app.get("/compose", async (req, res) => {
  if(!req.session.username) {
    return res.redirect("/");
  }
  
  try {
    const categories = await Category.find().lean();
    res.render("compose", { 
      user: req.session.username,
      categories: categories || [] // Ensure categories is always defined
    });
  } catch (err) {
    console.error("Error loading categories:", err);
    res.render("compose", {
      user: req.session.username,
      categories: [],
      error: "Error loading categories"
    });
  }
});

app.post("/compose", upload.single("image"), async (req, res) => {
  const postData = {
    author: req.session.username,
    title: req.body.postTitle,
    content: req.body.postBody,
    thumbnail: imagename,
    date: Date.now(),
    like: 0,
    categories: req.body.categories || []
  };
  await PosT.insertMany(postData);
  res.redirect("/home");
});

// app.get("/posts/:custom", (req, res) => {
//    if(req.session.username){
//   PosT.find((err, results) => {
//     res.render("posts", {
//       user: req.session.username,
//       posts: results,
//       date: Date.now(),
//       id: req.params.custom,
//     });
//   });
// }else{
//   res.render("notfound")
// }
// });
// app.get("/posts/:custom", async (req, res) => {
//   if (!req.session.username) {
//     return res.render("notfound");
//   }

//   try {
//     // Find the specific post and populate its categories
//     const currentPost = await PosT.findById(req.params.custom).populate('categories').lean();
    
//     if (!currentPost) {
//       return res.render("notfound");
//     }

//     // Get related posts with similar categories
//     const relatedPosts = await PosT.find({
//       _id: { $ne: currentPost._id }, // Exclude current post
//       categories: { $in: currentPost.categories || [] } // Find posts with similar categories
//     })
//     .populate('categories')
//     .limit(5)
//     .lean();

//     // Initialize arrays if undefined
//     currentPost.likedby = currentPost.likedby || [];
//     currentPost.categories = currentPost.categories || [];

//     res.render("posts", {
//       user: req.session.username,
//       currentPost: currentPost,
//       posts: relatedPosts, // Keep this for backward compatibility
//       date: Date.now(),
//       id: req.params.custom
//     });
//   } catch (err) {
//     console.error("Error loading post:", err);
//     res.render("error", { error: "Error loading post" });
//   }
// });

app.get("/posts/:custom", async (req, res) => {
  if (!req.session.username) {
    return res.render("notfound");
  }

  try {
    // Find the specific post and populate its categories
    const currentPost = await PosT.findById(req.params.custom).populate('categories').lean();
    
    if (!currentPost) {
      return res.render("notfound");
    }

    // Get related posts with similar categories
    const relatedPosts = await PosT.find({
      _id: { $ne: currentPost._id }, // Exclude current post
      categories: { $in: currentPost.categories || [] } // Find posts with similar categories
    })
    .populate('categories')
    .limit(5)
    .lean();

    // Initialize arrays if undefined
    currentPost.likedby = currentPost.likedby || [];
    currentPost.categories = currentPost.categories || [];

    // Pass the data to the template
    res.render("posts", {
      user: req.session.username,
      currentPost: currentPost,
      posts: relatedPosts,
      date: Date.now(),
      id: req.params.custom
    });
  } catch (err) {
    console.error("Error loading post:", err);
    res.render("error", { error: "Error loading post" });
  }
});

app.post("/posts/:custom", (req, res) => {
  const id = req.params.custom;
  var userid = req.session.username;

  PosT.findOne({ _id: { $eq: id } }, (err, result) => {
    if (result.likedby.includes(userid)) {
      PosT.findOneAndUpdate(
        { _id: id },
        { $pull: { likedby: userid } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("user disliked");

          PosT.findOneAndUpdate({ _id: id }, { $inc: { like: -1 } }, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("updated");
            }
          });
        }
      });
    } else {
      PosT.findOneAndUpdate(
        { _id: id },
        { $push: { likedby: userid } },
        { new: true }
      ).exec((err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("user liked");
          PosT.findOneAndUpdate({ _id: id }, { $inc: { like: 1 } }, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("updated");
            }
          }); //
        }
      });
    }
    if (err) {
      console.log(err);
    }
  });
});

app.get("/update/:custom", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    const [post, categories] = await Promise.all([
      PosT.findById(req.params.custom).populate('categories').lean(),
      Category.find().lean()
    ]);

    if (!post) {
      return res.render("notfound");
    }

    if (req.session.username === post.author || req.session.username === "admin") {
      res.render("edit-post", {
        user: req.session.username,
        post: post,
        categories: categories || [] // Ensure categories is always defined
      });
    } else {
      res.render("notfound");
    }
  } catch (err) {
    console.error("Error in /update/:custom:", err);
    res.render("error", { error: "Error loading post" });
  }
});

// Update the POST route to handle categories
app.post('/update/:custom', upload.single('thumbnail'), async (req, res) => {
  try {
    const post = await PosT.findById(req.params.custom);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Keep existing thumbnail if no new one is uploaded
    const thumbnail = req.file ? req.file.filename : post.thumbnail;

    const updatedPost = await PosT.findByIdAndUpdate(
      req.params.custom,
      {
        title: req.body.postTitle,
        content: req.body.postBody,
        thumbnail: thumbnail,  // Use either new or existing thumbnail
        categories: req.body.categories || []
      },
      { new: true }
    );

    res.redirect('/posts/' + updatedPost._id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating post');
  }
});

app.get("/delete/:custom", (req, res) => {
 if(req.session.username){
  PosT.findById(req.params.custom,(err,results)=>{
     if (
       req.session.username === results.author ||
       req.session.type === "admin"
     ){
       PosT.findByIdAndRemove(req.params.custom, (err) => {
         console.log("deleted");
         if (req.session.username === "admin") {
           res.redirect("/admin");
         } else {
           res.redirect("/home");
         }
       });
      }else{
        res.render("notfound")
      }
  })
  
}else{
  res.redirect("/")
}
});

app.post("/delete-multiple", async (req, res) => {
  if (req.session.type === "admin") {
      try {
          const { postIds } = req.body;
          
          // Check if postIds is an array
          if (!Array.isArray(postIds) || postIds.length === 0) {
              return res.status(400).json({ 
                  success: false, 
                  message: "No posts selected" 
              });
          }

          await PosT.deleteMany({ _id: { $in: postIds } });
          res.json({ success: true });
      } catch (err) {
          console.error("Delete error:", err);
          res.status(500).json({ 
              success: false, 
              message: "Error deleting posts" 
          });
      }
  } else {
      res.status(403).json({ 
          success: false, 
          message: "Unauthorized" 
      });
  }
});
app.get("/profile/:customRoute", async (req, res) => {
  if(req.session.username){
    try {
      const [userPosts, userProfile, categories] = await Promise.all([
        PosT.find({ author: req.params.customRoute }).populate('categories').lean(),
        Profile.findOne({ username: req.params.customRoute }).lean(),
        Category.find().lean()
      ]);

      res.render("profile", {
        username: req.session.username,
        posts: userPosts,
        categories: categories,
        userdata: userProfile,
        date: Date.now(),
      });
    } catch (err) {
      console.error(err);
      res.render("error", { error: "Error loading profile" });
    }
  } else {
    res.redirect("/");
  }
});


app.get("/editprofile/:custom",(req,res)=>{
  if(req.session.username){
     Profile.findOne({username:req.params.custom},(err,results)=>{
     if (req.session.username === results.username){
  Profile.findOne({username:req.session.username},(err,result)=>{
    res.render("edit-profile",{username:req.session.username,email:req.session.useremail,userdata:result})
  })}else{
    res.render("notfound")
  }})
}else{
  res.redirect("/")
}
})


app.post("/editprofile/:custom",upload.single("image"), async (req, res) => {
  const custom=req.params.custom 

 
// console.log(imagename);
  Profile.findOneAndUpdate(
    { username: req.session.username },
    {
      fullname: req.body.fullname,
      email: req.session.useremail,
      dp: imagename,
      bio: req.body.bio,
      weblink: req.body.weblink,
      facebook: req.body.fb,
      whatsapp: req.body.wa,
      twitter: req.body.tw,
      instagram: req.body.insta,
      phoneno: req.body.phno,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updated");
      }
    }
  );


  res.redirect("/profile/"+custom);
});

app.get("/admin", async (req, res) => {
  if(req.session.type === "admin"){
    try {
      const [profiles, posts, visitStats, categories] = await Promise.all([
        Profile.find().lean(),
        PosT.find().populate('categories').lean(),
        visits.find().lean(),
        Category.find().lean()
      ]);

      res.render("admin", {
        profiles: profiles,
        posts: posts,
        visits: visitStats,
        categories: categories, // Make sure categories is passed
        username: req.session.username
      });
    } catch (err) {
      console.error(err);
      res.render("error", { error: "Error loading admin dashboard" });
    }
  } else {
    res.redirect("/");
  }
});

app.get("/removeuser/:custom", (req, res) => {
  if(req.session.type==="admin"){
  Profile.findByIdAndRemove(req.params.custom, (err) => {
    PosT.deleteMany({author:{$eq:req.query.user}},(err)=>{
      if(err){
        console.log(err);
      }else{
        res.redirect("/admin")
      }
    })
  });
}else{
  res.render("notfound")
}
});




// app.post("/search",async(req,res)=>{
//   let payload=req.body.payload.trim()
//   // console.log(payload);
//   let search=await PosT.find({title:{$regex: new RegExp('^'+payload+'.*','i')}}).exec();
//   search = search.slice(0,10)
//   // console.log(search);
//   res.send({payload:search})

// })
app.post("/search", async (req, res) => {
  try {
    let payload = req.body.payload.trim();
    // Search in both title and content
    let search = await PosT.find({
      $or: [
        { title: { $regex: new RegExp('.*' + payload + '.*', 'i') } },
        { content: { $regex: new RegExp('.*' + payload + '.*', 'i') } }
      ]
    }).exec();
    
    search = search.slice(0, 10); // Limit results to 10
    res.send({ payload: search });
  } catch (err) {
    console.error(err);
    res.send({ payload: [] });
  }
});

app.get("/test", (req, res) => {
  res.render("test");
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Move these catch-all routes to the very end
app.get("/:custom/:custom2", (req, res) => {
  res.render("notfound");
});

// This should be the very last route
app.use((req, res) => {
  res.status(404).render('notfound');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server started at port 3000");
});

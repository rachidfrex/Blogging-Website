# myBlog - Full Stack Blogging Platform Documentation
## Technical Documentation and Presentation Guide

### Table of Contents
1. Project Overview
2. Technologies Used
3. Key Features
4. Technical Architecture
5. Implementation Details
6. Code Examples
7. Presentation Guide

## 1. Project Overview
myBlog is a full-stack blogging platform that allows users to:
- Create and manage blog posts
- Categorize content
- Like and interact with posts
- Manage user profiles
- Admin dashboard functionality

## 2. Technologies Used

### Frontend
- HTML5/CSS3
- Tailwind CSS for modern, responsive styling
- EJS (Embedded JavaScript) for templating
- JavaScript for client-side interactions

### Backend
- Node.js runtime environment
- Express.js web framework
- MongoDB database
- Mongoose ODM
- Express-session for authentication
- Multer for file uploads

## 3. Key Features

### User Management
```javascript
// User authentication example
app.post("/login", async (req, res) => {
  try {
    const check = await Profile.findOne({ email: req.body.email });
    if (check.password === req.body.password) {
      // Set session and redirect
      req.session.username = check.username;
      req.session.type = check.type;
      res.redirect(check.type === "admin" ? "admin" : "home");
    }
  } catch {
    res.render("login", { error: "Invalid credentials" });
  }
});
```

### Post Management
```javascript
// Create new post
app.post("/compose", upload.single("image"), async (req, res) => {
  const postData = {
    author: req.session.username,
    title: req.body.postTitle,
    content: req.body.postBody,
    thumbnail: imagename,
    date: Date.now(),
    categories: req.body.categories || []
  };
  await PosT.insertMany(postData);
});
```

### Category System
```javascript
// Category management
app.post("/categories", async (req, res) => {
  if (req.session.type === "admin") {
    const newCategory = new Category({
      name: req.body.name,
      description: req.body.description
    });
    await newCategory.save();
  }
});
```

## 4. Technical Architecture

### Database Schema
```javascript
// Post Schema
{
  title: String,
  content: String,
  author: String,
  date: Date,
  thumbnail: String,
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  like: Number,
  likedby: [String]
}

// User Schema
{
  username: String,
  email: String,
  password: String,
  type: String,
  profile: {
    fullname: String,
    bio: String,
    social: {
      weblink: String,
      facebook: String,
      twitter: String
    }
  }
}
```

## 5. Implementation Details

### Authentication Flow
1. User submits login form
2. Server validates credentials
3. Session created with user info
4. Different redirects for admin/user

### Post Creation Process
1. User fills post form
2. Image uploaded via Multer
3. Categories assigned
4. Post saved to database
5. Redirect to home/post view

### Like System Implementation
```javascript
function like(button) {
    const count = parseInt(document.getElementById("likecount").innerHTML);
    if (likedstatus === 0) {
        document.getElementById("likecount").innerHTML = count + 1;
        button.classList.add("text-red-600");
        likedstatus = 1;
    } else {
        document.getElementById("likecount").innerHTML = count - 1;
        button.classList.remove("text-red-600");
        likedstatus = 0;
    }
}
```

## 6. Code Examples

### Responsive Design
```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <!-- Main content area -->
  <div class="lg:col-span-2">
    <!-- Post content -->
  </div>
  <!-- Sidebar -->
  <div class="lg:col-span-1">
    <!-- Related posts -->
  </div>
</div>
```

### Image Upload Handling
```javascript
const storage = multer.diskStorage({
  destination: "./public/thumbnails",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
```

## 7. Presentation Guide

### Key Points to Highlight
1. **User Experience**
   - Clean, responsive design
   - Intuitive navigation
   - Real-time interactions

2. **Technical Features**
   - Secure authentication
   - Image handling
   - Category management
   - Like system

3. **Admin Capabilities**
   - User management
   - Content moderation
   - Category control
   - Analytics view

### Demo Flow
1. Start with user registration/login
2. Show post creation process
3. Demonstrate category system
4. Show interaction features
5. Present admin dashboard
6. Highlight responsive design

### Technical Achievements
- Modern frontend with Tailwind CSS
- Secure backend with Express
- Efficient database design
- Scalable architecture
- Clean code organization

### Future Enhancements
1. Rich text editor
2. Comment system
3. Social sharing
4. Advanced analytics
5. API integration

## Conclusion
myBlog demonstrates a full-stack implementation of a modern blogging platform, showcasing both technical expertise and user-focused design principles.
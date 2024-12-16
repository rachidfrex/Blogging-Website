# Modern Blog Website

A responsive and feature-rich blogging platform built with React and Firebase, offering a seamless experience for content creators and readers alike.

<img src="projectImage\home-page.png">
## Features

- 🔐 User authentication (Sign up, Sign in, Sign out)
- ✍️ Create, edit, and delete blog posts
- 📱 Responsive design for all devices
- 🖼️ Image upload functionality
- 💬 Comments section
- 👤 User profiles
- 🎨 Modern and clean UI

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rachidfrex/Blogging-Website.git
   cd Blogging-Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the server**
   ```bash
   node src/app.js
   ```

## Project Structure

```
Blogging-Website/
├── public/
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── blog.js
│   │   └── profile.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   └── profileController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Blog.js
│   │   └── Comment.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── firebase.js
│   └── utils/
│       └── helpers.js
├── projectImage/
├── package.json
└── README.md
```

## Technologies Used

- React.js
- Firebase (Authentication, Firestore, Storage)
- React Router Dom
- CSS Modules
- Context API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Screenshots**: 

<h3 align="center"> Login section</h3>
<img src="projectImage\login.png">
<h3 align="center"> Home Page</h3>
<img src="projectImage\home-page.png">
<h3 align="center"> Post View</h3>
<img src="projectImage\post.png">
<h3 align="center"> Profile Section</h3>
<img src="projectImage\profile.png">
<h3 align="center"> Admin Dashboard </h3>
<img src="projectImage\dashboard.png">

<h3  align="center" > Don't forget to hit the :star: if you like this repo. </h3>


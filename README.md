# Modern Blog Website

A responsive and feature-rich blogging platform built with React and Firebase, offering a seamless experience for content creators and readers alike.

![Project Preview](./projectImage/project-preview.png)

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
   git clone https://github.com/yourusername/Blogging-Website.git
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

4. **Start the development server**
   ```bash
   npm start
   ```

## Project Structure

```
Blogging-Website/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Blog/
│   │   ├── Common/
│   │   └── Profile/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   ├── firebase/
│   └── styles/
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
<img src="SH2.jpg">
<h3 align="center"> Post View</h3>
<img src="SH1.jpg">
<h3 align="center"> Profile Section</h3>
<img src="SH3.jpg">
<h3 align="center"> Admin Dashboard </h3>

![image](https://github.com/arjuncvinod/Blogging-Website/assets/68469520/4c9f0f3c-3ac7-43e9-9854-d671f237c795)

<h3  align="center" > Don't forget to hit the :star: if you like this repo. </h3>
<h1 align="center"> Made with ❤️ by <a href="https://arjuncvinod.github.io">Arjun</a> </h1>

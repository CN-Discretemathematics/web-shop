# Firebase Shopping Web App

An e-commerce web application built with React and Firebase.

## Features

- User authentication
- Product management
- Shopping cart
- Order processing
- Admin dashboard
- Real-time updates

## Technologies Used

- React
- Firebase (Authentication, Firestore, Storage)
- Tailwind CSS
- React Router
- React Firebase Hooks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/你的用户名/firebase-shop.git
cd firebase-shop
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

4. Start the development server
```bash
npm start
```

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Storage
5. Configure security rules

## Project Structure

```
shop-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Products/
│   │   ├── Cart/
│   │   ├── Orders/
│   │   ├── Admin/
│   │   └── Layout/
│   ├── firebase/
│   ├── hooks/
│   ├── utils/
│   └── styles/
└── ...
```

## Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from create-react-app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React documentation
- Firebase documentation
- Tailwind CSS documentation

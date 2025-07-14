# Firebase Setup Guide for IoT Security System

## Overview
This guide will walk you through setting up Firebase services for the IoT Security System, including Firebase Storage for image uploads, Firebase Realtime Database for alert data, and Firebase Cloud Messaging for push notifications.

## Prerequisites
- Google account
- ESP32-CAM hardware
- Mobile device for testing

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "iot-security-system")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set up Firebase Storage

1. In the Firebase Console, navigate to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for now (you can configure security rules later)
4. Select a Cloud Storage location (choose the one closest to your location)
5. Click "Done"

### Storage Security Rules (for testing)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Allow all reads and writes for testing
    }
  }
}
```

## Step 3: Set up Firebase Realtime Database

1. In the Firebase Console, navigate to "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location for your database
4. Start in "Test mode" for now
5. Click "Enable"

### Database Security Rules (for testing)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Step 4: Set up Firebase Cloud Messaging (FCM)

1. In the Firebase Console, navigate to "Project settings" (gear icon)
2. Go to the "Cloud Messaging" tab
3. Note down the "Server key" (you'll need this for sending notifications)

## Step 5: Get Firebase Configuration

1. In the Firebase Console, go to "Project settings"
2. In the "General" tab, scroll down to "Your apps"
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname (e.g., "IoT Security Web App")
5. Copy the Firebase configuration object - you'll need this for your web app

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 6: Install Required Libraries for ESP32

Add these libraries to your Arduino IDE:
- FirebaseESP32 by Mobizt
- ArduinoJson

## Step 7: Update ESP32 Code

Replace the placeholders in your ESP32 code:
```cpp
#define FIREBASE_HOST "your-project-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "your-database-secret-or-web-api-key"
```

## Step 8: Test the System

1. Upload the code to your ESP32-CAM
2. Trigger motion detection
3. Check Firebase Storage for uploaded images
4. Check Firebase Realtime Database for alert records

## Security Considerations

For production use, you should:
1. Configure proper security rules for Storage and Database
2. Implement user authentication
3. Use Firebase Admin SDK for server-side operations
4. Restrict API key usage

## Troubleshooting

### Common Issues:
1. **Connection failed**: Check Wi-Fi credentials and Firebase host URL
2. **Upload failed**: Verify Firebase Storage rules and authentication
3. **Database write failed**: Check Realtime Database rules and authentication

### Debug Tips:
- Enable serial output to monitor ESP32 operations
- Check Firebase Console logs for errors
- Verify network connectivity


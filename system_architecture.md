# IoT Security System: System Architecture Design

## 1. Introduction
This document outlines the proposed system architecture for the IoT Security System, as per the requirements of Internship Task 3 by CodTech. The system aims to provide real-time motion detection, image capture, and mobile alerting capabilities using IoT technology.

## 2. Core Components
Based on the task requirements and initial research, the following core components have been identified:

### 2.1. Microcontroller & Camera Module: ESP32-CAM
The ESP32-CAM is an ideal choice for this project due to its integrated ESP32 microcontroller and OV2640 camera module. This single board can handle both processing logic and image capture, simplifying the hardware setup. Its Wi-Fi capabilities will be crucial for connecting to the internet and sending data to the cloud.

### 2.2. Motion Sensor: PIR Sensor
A Passive Infrared (PIR) sensor will be used for motion detection. These sensors are cost-effective, low-power, and widely used for detecting movement by sensing changes in infrared radiation emitted by objects.

### 2.3. Cloud Messaging/API Platform
This component is critical for enabling real-time communication between the ESP32-CAM and the mobile application. Several options were considered: Blynk, Firebase, and MQTT. Each has its advantages:

*   **Blynk:** A user-friendly IoT platform that provides a low-code approach for building mobile applications and dashboards. It simplifies the process of connecting hardware to the cloud and sending notifications.
*   **Firebase:** Google's mobile and web application development platform. Firebase Realtime Database or Firestore can be used for storing image links and alert data, while Firebase Cloud Messaging (FCM) can handle push notifications to mobile devices.
*   **MQTT (Message Queuing Telemetry Transport):** A lightweight messaging protocol designed for constrained devices and low-bandwidth, high-latency networks. It's highly efficient for IoT applications and can be used with various brokers (e.g., Mosquitto, HiveMQ) and integrated with other cloud services.

For this project, **Firebase** appears to be a robust and scalable solution, especially for handling image storage and push notifications to a mobile application. Its comprehensive suite of services, including authentication, database, and messaging, makes it a strong candidate for a complete IoT solution. While Blynk offers ease of use, Firebase provides more flexibility and control for custom mobile app development. MQTT is excellent for messaging but would require additional services for image storage and notification management.

### 2.4. Mobile Application
A custom mobile application will be developed to receive and display alerts, along with the captured images. This application will interact with the chosen cloud platform to fetch data and present it to the user in real-time.

## 3. System Architecture Diagram (Conceptual)

```mermaid
graph TD
    A[PIR Sensor] --> B{ESP32-CAM}
    B --> C[Wi-Fi Network]
    C --> D[Firebase Cloud Platform]
    D --> E[Firebase Storage (for Images)]
    D --> F[Firebase Realtime Database/Firestore (for Alerts)]
    D --> G[Firebase Cloud Messaging (FCM)]
    G --> H[Mobile Application]
    F --> H
    E --> H
```

## 4. Data Flow and Communication Protocols

1.  **Motion Detection:** The PIR sensor detects motion and sends a signal to the ESP32-CAM.
2.  **Image Capture:** Upon receiving a motion detection signal, the ESP32-CAM wakes up (if in deep sleep) and captures an image using its integrated camera.
3.  **Data Transmission to Cloud:**
    *   The captured image will be uploaded to **Firebase Storage**.
    *   A record containing the alert timestamp, a link to the captured image, and potentially other relevant data (e.g., sensor readings) will be stored in **Firebase Realtime Database** or **Firestore**.
    *   A trigger will be set up (e.g., Firebase Cloud Functions) to send a push notification via **Firebase Cloud Messaging (FCM)** to the registered mobile application.
4.  **Mobile Alerting:** The mobile application receives the push notification from FCM. Upon opening the notification or the app, it retrieves the alert details and the image from Firebase Realtime Database/Firestore and Firebase Storage, respectively, and displays them to the user.

## 5. Next Steps

*   Set up a Firebase project and configure necessary services (Storage, Realtime Database/Firestore, FCM).
*   Develop the ESP32-CAM firmware to integrate with the PIR sensor and Firebase services.
*   Develop the mobile application to receive and display alerts and images from Firebase.



# IoT Security System Setup Guide

**Version:** 1.0  
**Date:** July 8, 2025  
**Author:** Manus AI  

## Table of Contents

1. [Introduction](#introduction)
2. [Hardware Requirements](#hardware-requirements)
3. [Software Requirements](#software-requirements)
4. [Hardware Assembly](#hardware-assembly)
5. [Software Installation](#software-installation)
6. [Firebase Configuration](#firebase-configuration)
7. [ESP32-CAM Programming](#esp32-cam-programming)
8. [Mobile Application Setup](#mobile-application-setup)
9. [System Testing](#system-testing)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

## 1. Introduction

This guide provides step-by-step instructions for setting up the IoT Security System. The system consists of an ESP32-CAM microcontroller with PIR motion sensor, Firebase cloud services, and a Progressive Web Application for mobile monitoring.

### System Overview

The IoT Security System provides:
- Motion detection using PIR sensor
- Automatic image capture on motion detection
- Real-time cloud storage and notifications
- Mobile application for monitoring and alerts
- Battery operation with power management

### Prerequisites

- Basic understanding of electronics and programming
- Access to Wi-Fi network
- Computer with USB port for programming
- Mobile device with modern web browser

## 2. Hardware Requirements

### Essential Components

| Component | Specification | Quantity | Estimated Cost |
|-----------|---------------|----------|----------------|
| ESP32-CAM Development Board | With OV2640 camera | 1 | $15 |
| PIR Motion Sensor | HC-SR501 or equivalent | 1 | $5 |
| Jumper Wires | Male-to-female, 20cm | 10 | $3 |
| Breadboard | Half-size or full-size | 1 | $5 |
| Power Supply | 5V/1A USB adapter | 1 | $8 |
| MicroUSB Cable | For programming | 1 | $3 |
| Enclosure | IP65 rated, 100x68x50mm | 1 | $12 |

### Optional Components

| Component | Purpose | Estimated Cost |
|-----------|---------|----------------|
| FTDI USB-to-Serial Adapter | Alternative programming method | $8 |
| External Antenna | Improved Wi-Fi range | $5 |
| Battery Pack | Portable operation | $15 |
| LED Indicator | Status indication | $2 |

### Tools Required

- Soldering iron and solder (if permanent connections needed)
- Wire strippers
- Screwdriver set
- Drill with bits (for enclosure mounting)
- Multimeter (for troubleshooting)

## 3. Software Requirements

### Development Environment

1. **Arduino IDE** (Version 2.0 or later)
   - Download from: https://www.arduino.cc/en/software
   - Install ESP32 board support package

2. **ESP32 Board Package**
   - URL: `https://dl.espressif.com/dl/package_esp32_index.json`
   - Install via Arduino IDE Board Manager

3. **Required Libraries**
   - ESP32 Camera Library
   - Firebase ESP32 Client Library
   - WiFi Library (included with ESP32 package)
   - ArduinoJson Library

### Cloud Services

1. **Firebase Account**
   - Create account at: https://firebase.google.com
   - Enable Authentication, Realtime Database, and Storage

2. **Web Browser** (for mobile application)
   - Chrome, Firefox, Safari, or Edge
   - Support for Progressive Web Apps

## 4. Hardware Assembly

### Step 1: Prepare Components

1. Unpack all components and verify against the requirements list
2. Check ESP32-CAM board for any visible damage
3. Test PIR sensor by connecting to 3.3V power (LED should illuminate)

### Step 2: Wiring Connections

**ESP32-CAM to PIR Sensor:**

| ESP32-CAM Pin | PIR Sensor Pin | Wire Color |
|---------------|----------------|------------|
| 3.3V | VCC | Red |
| GND | GND | Black |
| GPIO 13 | OUT | Yellow |

**Connection Diagram:**
```
ESP32-CAM                    PIR Sensor (HC-SR501)
┌─────────────┐             ┌─────────────────┐
│             │             │                 │
│    3.3V ────┼─────────────┼──── VCC         │
│             │             │                 │
│    GND  ────┼─────────────┼──── GND         │
│             │             │                 │
│ GPIO 13 ────┼─────────────┼──── OUT         │
│             │             │                 │
└─────────────┘             └─────────────────┘
```

### Step 3: Assembly Verification

1. Double-check all connections against the wiring diagram
2. Ensure no short circuits between power and ground
3. Verify PIR sensor orientation (dome facing detection area)
4. Test continuity with multimeter if available

### Step 4: Enclosure Preparation

1. Mark mounting holes for ESP32-CAM board
2. Cut opening for camera lens (20mm diameter)
3. Cut opening for PIR sensor (ensure dome is flush)
4. Drill cable entry hole with appropriate grommet

## 5. Software Installation

### Step 1: Arduino IDE Setup

1. Download and install Arduino IDE 2.0+
2. Open Arduino IDE
3. Go to File → Preferences
4. Add ESP32 board package URL to Additional Board Manager URLs:
   ```
   https://dl.espressif.com/dl/package_esp32_index.json
   ```
5. Click OK to save preferences

### Step 2: ESP32 Board Package Installation

1. Go to Tools → Board → Board Manager
2. Search for "ESP32"
3. Install "esp32 by Espressif Systems" (latest version)
4. Wait for installation to complete

### Step 3: Library Installation

Install the following libraries via Library Manager (Tools → Manage Libraries):

1. **Firebase ESP32 Client** by Mobizt
2. **ArduinoJson** by Benoit Blanchon
3. **ESP32 Camera** (if not included with board package)

### Step 4: Board Configuration

1. Connect ESP32-CAM to computer via USB
2. Select board: Tools → Board → ESP32 Arduino → AI Thinker ESP32-CAM
3. Select port: Tools → Port → (select appropriate COM port)
4. Set upload speed: Tools → Upload Speed → 115200

## 6. Firebase Configuration

### Step 1: Create Firebase Project

1. Go to https://firebase.google.com
2. Click "Get started" and sign in with Google account
3. Click "Create a project"
4. Enter project name: "iot-security-system"
5. Disable Google Analytics (optional)
6. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase console, click "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Anonymous" authentication
5. Save configuration

### Step 3: Setup Realtime Database

1. Click "Realtime Database" in left sidebar
2. Click "Create database"
3. Select "Start in test mode"
4. Choose database location (closest to your region)
5. Click "Done"

### Step 4: Configure Storage

1. Click "Storage" in left sidebar
2. Click "Get started"
3. Accept default security rules
4. Choose storage location
5. Click "Done"

### Step 5: Get Configuration Keys

1. Click gear icon → Project settings
2. Scroll down to "Your apps" section
3. Click "Web" icon to add web app
4. Enter app name: "IoT Security Monitor"
5. Copy the configuration object (save for later use)

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

## 7. ESP32-CAM Programming

### Step 1: Prepare Firmware Code

Create a new Arduino sketch and copy the provided firmware code. Update the following configuration variables:

```cpp
// Wi-Fi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase Configuration
#define API_KEY "your-firebase-api-key"
#define DATABASE_URL "https://your-project-default-rtdb.firebaseio.com/"
#define STORAGE_BUCKET "your-project.appspot.com"
```

### Step 2: Upload Firmware

1. Connect ESP32-CAM to computer
2. Put ESP32-CAM in programming mode:
   - Connect GPIO 0 to GND
   - Press reset button
   - Release reset button
   - Disconnect GPIO 0 from GND
3. Click Upload button in Arduino IDE
4. Wait for upload to complete
5. Press reset button to start normal operation

### Step 3: Monitor Serial Output

1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to 115200
3. Press reset button on ESP32-CAM
4. Verify startup messages and Wi-Fi connection

Expected output:
```
IoT Security System Starting...
Connecting to WiFi: YOUR_WIFI_SSID
WiFi connected successfully
IP address: 192.168.1.100
Camera initialized successfully
Firebase connected successfully
System ready - monitoring for motion
```

## 8. Mobile Application Setup

### Step 1: Access Application

1. Open web browser on mobile device
2. Navigate to the deployed application URL
3. Allow location access if prompted
4. Allow notification permissions

### Step 2: Initial Configuration

1. The app will automatically detect your Firebase project
2. Sign in anonymously (automatic)
3. Configure device settings:
   - Device name: "Front Door Camera"
   - Location: "Main Entrance"
   - Sensitivity: "Medium"

### Step 3: Install as PWA

1. In browser menu, select "Add to Home Screen"
2. Confirm installation
3. App icon will appear on home screen
4. Launch app from home screen for native experience

## 9. System Testing

### Step 1: Basic Functionality Test

1. Verify ESP32-CAM is powered and connected to Wi-Fi
2. Check serial monitor for system status messages
3. Trigger PIR sensor by walking in front of it
4. Verify image capture in serial monitor
5. Check Firebase Storage for uploaded image

### Step 2: Mobile Application Test

1. Open mobile application
2. Verify connection status shows "Connected"
3. Trigger motion detection
4. Confirm alert appears in mobile app within 30 seconds
5. Verify captured image displays correctly

### Step 3: Notification Test

1. Ensure mobile app is running in background
2. Trigger motion detection
3. Verify push notification appears
4. Tap notification to open app
5. Confirm alert details are displayed

### Step 4: Performance Test

1. Measure response time from motion to notification
2. Test multiple rapid motion events
3. Verify system stability over 24-hour period
4. Check battery consumption if using battery power

## 10. Troubleshooting

### Common Issues and Solutions

#### ESP32-CAM Won't Connect to Wi-Fi

**Symptoms:** Serial monitor shows "WiFi connection failed"

**Solutions:**
1. Verify SSID and password are correct
2. Check Wi-Fi signal strength at installation location
3. Ensure Wi-Fi network supports 2.4GHz (ESP32 doesn't support 5GHz)
4. Try different Wi-Fi channel on router
5. Check for special characters in Wi-Fi credentials

#### Camera Initialization Failed

**Symptoms:** Serial monitor shows "Camera init failed"

**Solutions:**
1. Check camera module connections
2. Verify ESP32-CAM board is genuine (not clone)
3. Try different camera configuration in code
4. Check power supply voltage (should be 5V)
5. Inspect camera module for physical damage

#### Motion Detection Not Working

**Symptoms:** No alerts generated when motion occurs

**Solutions:**
1. Check PIR sensor wiring connections
2. Adjust PIR sensor sensitivity potentiometer
3. Verify PIR sensor power LED is illuminated
4. Test PIR sensor with multimeter
5. Check GPIO pin configuration in code

#### Firebase Connection Issues

**Symptoms:** Serial monitor shows Firebase errors

**Solutions:**
1. Verify Firebase configuration keys are correct
2. Check Firebase project settings and permissions
3. Ensure Realtime Database and Storage are enabled
4. Verify internet connectivity
5. Check Firebase service status

#### Mobile App Not Receiving Notifications

**Symptoms:** Alerts not appearing on mobile device

**Solutions:**
1. Verify notification permissions are enabled
2. Check browser notification settings
3. Ensure app is installed as PWA
4. Test with different browser
5. Check Firebase Cloud Messaging configuration

### Diagnostic Tools

#### Serial Monitor Commands

Add these debug commands to your firmware for troubleshooting:

```cpp
// Test camera capture
void testCamera() {
  camera_fb_t* fb = esp_camera_fb_get();
  if (fb) {
    Serial.printf("Camera test OK - Image size: %zu bytes\n", fb->len);
    esp_camera_fb_return(fb);
  } else {
    Serial.println("Camera test FAILED");
  }
}

// Test Wi-Fi connection
void testWiFi() {
  Serial.printf("WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  Serial.printf("IP Address: %s\n", WiFi.localIP().toString().c_str());
  Serial.printf("Signal Strength: %d dBm\n", WiFi.RSSI());
}

// Test PIR sensor
void testPIR() {
  int pirState = digitalRead(PIR_PIN);
  Serial.printf("PIR Sensor State: %s\n", pirState ? "MOTION DETECTED" : "No Motion");
}
```

## 11. Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks
- Check system status in mobile app
- Verify image quality and clarity
- Clean camera lens if necessary
- Check battery level (if battery powered)

#### Monthly Tasks
- Review alert history and patterns
- Update firmware if new version available
- Check all physical connections
- Clean PIR sensor dome
- Verify enclosure weather sealing

#### Quarterly Tasks
- Full system performance test
- Backup configuration settings
- Review and update Wi-Fi credentials if changed
- Check for Firebase service updates
- Inspect mounting hardware

### Performance Monitoring

#### Key Metrics to Monitor
- Response time from motion to alert
- Image upload success rate
- Battery life (if applicable)
- False alarm frequency
- System uptime percentage

#### Optimization Tips
1. **Improve Wi-Fi Signal:**
   - Relocate router closer to device
   - Use Wi-Fi extender or mesh network
   - Upgrade to higher-gain antenna

2. **Extend Battery Life:**
   - Adjust motion detection sensitivity
   - Reduce image quality if acceptable
   - Implement scheduled sleep periods

3. **Reduce False Alarms:**
   - Adjust PIR sensor sensitivity
   - Relocate sensor to avoid heat sources
   - Add software filtering algorithms

### Firmware Updates

#### Update Process
1. Download latest firmware from project repository
2. Backup current configuration settings
3. Upload new firmware via Arduino IDE
4. Restore configuration settings
5. Test all functionality after update

#### Version History
- v1.0: Initial release with basic functionality
- v1.1: Improved power management and error handling
- v1.2: Enhanced image quality and compression

### Support and Resources

#### Documentation
- Complete project documentation: [Project Repository]
- Hardware schematics and PCB files: [Hardware Folder]
- Software source code: [Software Folder]

#### Community Support
- Project forum: [Forum Link]
- Issue tracking: [GitHub Issues]
- Video tutorials: [YouTube Channel]

#### Professional Support
For commercial installations or custom modifications, professional support services are available through certified system integrators.

---

**Document Version:** 1.0  
**Last Updated:** July 8, 2025  
**Next Review Date:** October 8, 2025

This setup guide provides comprehensive instructions for installing and configuring the IoT Security System. For additional support or questions not covered in this guide, please refer to the troubleshooting section or contact the development team through the established support channels.


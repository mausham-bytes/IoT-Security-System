// esp32_cam_firmware.ino

// This file will contain the Arduino sketch for the ESP32-CAM.
// It will handle motion detection using a PIR sensor, image capture,
// and sending data to Firebase.

#include "esp_camera.h"
#include "WiFi.h"
#include "FirebaseESP32.h"

// Pin Definitions
const int PIR_PIN = 13; // Example PIR sensor pin, adjust as needed

// Camera configuration
#define CAMERA_MODEL_AI_THINKER // Uncomment this line if using AI-Thinker ESP32-CAM

#if defined(CAMERA_MODEL_AI_THINKER)
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5

#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

#define D0_GPIO_NUM       12
#define D1_GPIO_NUM       14
#define D2_GPIO_NUM        4
#define D3_GPIO_NUM       15
#define D4_GPIO_NUM        2
#define D5_GPIO_NUM       0
#define D6_GPIO_NUM        1
#define D7_GPIO_NUM        3

#define HSYNC_GPIO_NUM    23
#define VSYNC_GPIO_NUM    25
#define PCLK_GPIO_NUM     22

#define LED_GPIO_NUM      33 // For flash LED
#define LED_ON            LOW
#define LED_OFF           HIGH
#endif

// Wi-Fi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase project API Key
#define FIREBASE_HOST "YOUR_FIREBASE_PROJECT_ID.firebaseio.com" // Do not include https://
#define FIREBASE_AUTH "YOUR_FIREBASE_WEB_API_KEY"

// Define Firebase Data object
FirebaseData firebaseData;

// Define Firebase storage object
FirebaseStorage firebaseStorage;

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(false);

  // Configure PIR sensor pin
  pinMode(PIR_PIN, INPUT);

  // Initialize camera
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_siod = SIOD_GPIO_NUM;
  config.pin_sioc = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  // if PSRAM IC present, alocate in PSRAM
  if(psramFound()){
    config.frame_size = FRAMESIZE_SVGA; // FRAMESIZE_UXGA (1600x1200) FRAMESIZE_SVGA (800x600)
    config.jpeg_quality = 10; //0-63 lower number means higher quality
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP Address: ");
  Serial.println(WiFi.localIP());

  // Firebase setup
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  Serial.println("ESP32-CAM setup complete. Waiting for motion...");
}

void loop() {
  // Read PIR sensor state
  int pirState = digitalRead(PIR_PIN);

  if (pirState == HIGH) {
    Serial.println("Motion detected!");

    // Take photo
    camera_fb_t * fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Camera capture failed");
      return;
    }
    Serial.printf("Picture taken! Size: %zu bytes\n", fb->len);

    // Upload image and send alert to Firebase
    uploadImageToFirebase(fb->buf, fb->len);

    esp_camera_fb_return(fb);

    // Add a delay to avoid multiple triggers from a single motion event
    delay(5000); // 5 seconds delay
  }
  delay(100); // Small delay to prevent constant polling
}

// Function to upload image to Firebase Storage and send alert to Realtime Database
void uploadImageToFirebase(uint8_t *image_buffer, size_t image_length) {
  String imagePath = "/images/motion_" + String(millis()) + ".jpg";

  Serial.printf("Uploading file: %s\n", imagePath.c_str());

  if (Firebase.Storage.upload(&firebaseStorage, imagePath.c_str(), image_buffer, image_length, "image/jpeg")) {
    Serial.printf("Upload success: %s\n", firebaseStorage.downloadURL().c_str());

    // Send alert to Firebase Realtime Database
    FirebaseJson json;
    json.set("timestamp", String(millis()));
    json.set("imageUrl", firebaseStorage.downloadURL().c_str());

    if (Firebase.RTDB.pushJSON(&firebaseData, "/alerts", &json)) {
      Serial.println("Alert sent to Firebase Realtime Database");
    } else {
      Serial.println(firebaseData.errorReason());
    }

  } else {
    Serial.println(firebaseStorage.errorReason());
  }
}



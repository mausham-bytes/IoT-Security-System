from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import json
import requests
from datetime import datetime

firebase_bp = Blueprint('firebase', __name__)

# Firebase configuration (replace with your actual config)
FIREBASE_CONFIG = {
    "apiKey": "your-api-key",
    "authDomain": "your-project.firebaseapp.com",
    "databaseURL": "https://your-project-default-rtdb.firebaseio.com/",
    "projectId": "your-project-id",
    "storageBucket": "your-project.appspot.com",
    "messagingSenderId": "123456789",
    "appId": "your-app-id"
}

# FCM Server Key (replace with your actual server key)
FCM_SERVER_KEY = "your-fcm-server-key"

@firebase_bp.route('/alerts', methods=['GET'])
@cross_origin()
def get_alerts():
    """Get all alerts from Firebase Realtime Database"""
    try:
        # In a real implementation, you would fetch from Firebase
        # For now, return mock data
        mock_alerts = [
            {
                "id": 1,
                "timestamp": "2025-07-08T07:22:00Z",
                "imageUrl": "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Motion+Detected",
                "location": "Front Door",
                "status": "new"
            },
            {
                "id": 2,
                "timestamp": "2025-07-08T06:57:00Z",
                "imageUrl": "https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Motion+Detected",
                "location": "Back Yard",
                "status": "viewed"
            },
            {
                "id": 3,
                "timestamp": "2025-07-08T06:27:00Z",
                "imageUrl": "https://via.placeholder.com/400x300/45b7d1/ffffff?text=Motion+Detected",
                "location": "Side Gate",
                "status": "viewed"
            }
        ]
        return jsonify({"alerts": mock_alerts}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@firebase_bp.route('/alerts', methods=['POST'])
@cross_origin()
def create_alert():
    """Create a new alert and send push notification"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['imageUrl', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create alert object
        alert = {
            "id": len(get_mock_alerts()) + 1,  # Simple ID generation
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "imageUrl": data['imageUrl'],
            "location": data['location'],
            "status": "new"
        }
        
        # In a real implementation, save to Firebase Realtime Database
        # firebase_admin.db.reference('/alerts').push(alert)
        
        # Send push notification
        send_push_notification(alert)
        
        return jsonify({"message": "Alert created successfully", "alert": alert}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@firebase_bp.route('/alerts/<int:alert_id>', methods=['PUT'])
@cross_origin()
def update_alert(alert_id):
    """Update an alert (e.g., mark as viewed)"""
    try:
        data = request.get_json()
        
        # In a real implementation, update in Firebase
        # firebase_admin.db.reference(f'/alerts/{alert_id}').update(data)
        
        return jsonify({"message": "Alert updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@firebase_bp.route('/system/status', methods=['GET'])
@cross_origin()
def get_system_status():
    """Get system status"""
    try:
        status = {
            "status": "active",
            "lastUpdate": datetime.utcnow().isoformat() + "Z",
            "cameras": 3,
            "activeAlerts": 1
        }
        return jsonify(status), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def send_push_notification(alert):
    """Send push notification via Firebase Cloud Messaging"""
    try:
        # FCM endpoint
        url = "https://fcm.googleapis.com/fcm/send"
        
        # Notification payload
        payload = {
            "to": "/topics/security_alerts",  # Send to all subscribed devices
            "notification": {
                "title": "Motion Detected!",
                "body": f"Motion detected at {alert['location']}",
                "icon": "security_icon",
                "click_action": "FLUTTER_NOTIFICATION_CLICK"
            },
            "data": {
                "alert_id": str(alert['id']),
                "location": alert['location'],
                "timestamp": alert['timestamp'],
                "imageUrl": alert['imageUrl']
            }
        }
        
        headers = {
            "Authorization": f"key={FCM_SERVER_KEY}",
            "Content-Type": "application/json"
        }
        
        # Send notification (commented out for demo)
        # response = requests.post(url, data=json.dumps(payload), headers=headers)
        # return response.status_code == 200
        
        print(f"Push notification sent for alert: {alert['id']}")
        return True
    except Exception as e:
        print(f"Error sending push notification: {e}")
        return False

def get_mock_alerts():
    """Helper function to get mock alerts"""
    return [
        {
            "id": 1,
            "timestamp": "2025-07-08T07:22:00Z",
            "imageUrl": "https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Motion+Detected",
            "location": "Front Door",
            "status": "new"
        },
        {
            "id": 2,
            "timestamp": "2025-07-08T06:57:00Z",
            "imageUrl": "https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Motion+Detected",
            "location": "Back Yard",
            "status": "viewed"
        }
    ]


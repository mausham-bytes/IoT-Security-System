import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Bell, Camera, Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import './App.css'

function App() {
  const [alerts, setAlerts] = useState([])
  const [systemStatus, setSystemStatus] = useState('active')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Mock data for demonstration
  useEffect(() => {
    const mockAlerts = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        imageUrl: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Motion+Detected',
        location: 'Front Door',
        status: 'new'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        imageUrl: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Motion+Detected',
        location: 'Back Yard',
        status: 'viewed'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        imageUrl: 'https://via.placeholder.com/400x300/45b7d1/ffffff?text=Motion+Detected',
        location: 'Side Gate',
        status: 'viewed'
      }
    ]
    setAlerts(mockAlerts)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / 60000)
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const markAsViewed = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'viewed' } : alert
    ))
  }

  const newAlertsCount = alerts.filter(alert => alert.status === 'new').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">IoT Security</h1>
          </div>
          <p className="text-gray-600">Motion Detection System</p>
        </div>

        {/* System Status Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${systemStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>System Status</span>
              </CardTitle>
              <Badge variant={systemStatus === 'active' ? 'default' : 'destructive'}>
                {systemStatus === 'active' ? 'Active' : 'Offline'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Last update: {formatTime(lastUpdate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Camera className="h-4 w-4" />
                <span>3 cameras</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Summary */}
        {newAlertsCount > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              You have {newAlertsCount} new motion alert{newAlertsCount > 1 ? 's' : ''} to review.
            </AlertDescription>
          </Alert>
        )}

        {/* Recent Alerts */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Recent Alerts</span>
            </CardTitle>
            <CardDescription>
              Motion detection events from your security cameras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No recent alerts</p>
                <p className="text-sm">Your security system is monitoring</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.status === 'new' ? 'destructive' : 'secondary'}>
                        {alert.status === 'new' ? 'New' : 'Viewed'}
                      </Badge>
                      <span className="font-medium text-gray-900">{alert.location}</span>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{formatDate(alert.timestamp)}</div>
                      <div>{formatTime(alert.timestamp)}</div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <img 
                      src={alert.imageUrl} 
                      alt="Motion detection capture"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {getTimeAgo(alert.timestamp)}
                    </div>
                  </div>
                  
                  {alert.status === 'new' && (
                    <Button 
                      onClick={() => markAsViewed(alert.id)}
                      className="w-full"
                      size="sm"
                    >
                      Mark as Viewed
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              View Live Feed
            </Button>
            <Button className="w-full" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App


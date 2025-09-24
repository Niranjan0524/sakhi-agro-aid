import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingChatButton } from "@/components/ui/floating-chat-button";
import { 
  Cloud, 
  Droplets, 
  Sun, 
  Calendar, 
  PlusCircle,
  User,
  MessageSquare,
  Sprout,
  Hand,
  Package,
  Wheat
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  date: string;
  time: string;
  notes?: string;
  icon: React.ReactNode;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weatherData, setWeatherData] = useState({
    temp: "28°C",
    condition: "Partly Cloudy",
    humidity: "65%",
    suggestion: "Good day for fertilizer application"
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/");
      return;
    }

    // Load sample activities
    setActivities([
      {
        id: "1",
        type: "Sowing",
        date: "Today",
        time: "8:00 AM",
        notes: "Planted tomato seeds in field A",
        icon: <Sprout className="w-6 h-6 text-success" />
      },
      {
        id: "2",
        type: "Irrigation",
        date: "Yesterday",
        time: "6:00 PM",
        notes: "Watered field B - 2 hours",
        icon: <Droplets className="w-6 h-6 text-blue-500" />
      },
      {
        id: "3",
        type: "Fertilizer",
        date: "2 days ago",
        time: "7:00 AM",
        notes: "Applied NPK fertilizer",
        icon: <Package className="w-6 h-6 text-warning" />
      }
    ]);
  }, [navigate]);

  const getActivityIcon = (type: string) => {
    switch(type) {
      case "sowing": return <Sprout className="w-8 h-8" />;
      case "irrigation": return <Droplets className="w-8 h-8" />;
      case "fertilizer": return <Package className="w-8 h-8" />;
      case "harvesting": return <Wheat className="w-8 h-8" />;
      case "pesticide": return <Hand className="w-8 h-8" />;
      default: return <Sprout className="w-8 h-8" />;
    }
  };

  const quickActions = [
    { 
      label: "Log Activity", 
      icon: <PlusCircle className="w-icon-base h-icon-base" />, 
      action: () => navigate("/activity"),
      color: "bg-gradient-primary"
    },
    { 
      label: "Chatbot", 
      icon: <MessageSquare className="w-icon-base h-icon-base" />, 
      action: () => navigate("/chatbot"),
      color: "bg-gradient-sky"
    },
    { 
      label: "Profile", 
      icon: <User className="w-icon-base h-icon-base" />, 
      action: () => navigate("/profile"),
      color: "bg-gradient-earth"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary p-4 shadow-medium">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            Krishi Sakhi
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Hello, {localStorage.getItem("userName") || "Farmer"}! 👋
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24 space-y-4">
        {/* Weather Card */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Cloud className="w-5 h-5 text-accent-foreground" />
              Today's Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sun className="w-12 h-12 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{weatherData.temp}</p>
                  <p className="text-sm text-muted-foreground">{weatherData.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold">{weatherData.humidity}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-accent rounded-lg">
              <p className="text-sm font-medium text-accent-foreground">
                💡 {weatherData.suggestion}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} p-4 rounded-xl text-white flex flex-col items-center gap-2 transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-medium`}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Activities */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              Recent Activities
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/activity")}
              className="text-primary"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="mt-1">{activity.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="text-center py-8">
                <Sprout className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No activities logged yet</p>
                <Button
                  onClick={() => navigate("/activity")}
                  className="mt-3"
                  size="sm"
                >
                  Log Your First Activity
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <FloatingChatButton />
    </div>
  );
}
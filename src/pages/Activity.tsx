import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FloatingChatButton } from "@/components/ui/floating-chat-button";
import { 
  ArrowLeft,
  Sprout,
  Droplets,
  Package,
  Wheat,
  Hand,
  Camera,
  Calendar,
  Clock,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActivityType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export default function Activity() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));

  const activityTypes: ActivityType[] = [
    { id: "sowing", name: "Sowing", icon: <Sprout className="w-8 h-8" />, color: "bg-green-100 border-green-300 text-green-700" },
    { id: "irrigation", name: "Irrigation", icon: <Droplets className="w-8 h-8" />, color: "bg-blue-100 border-blue-300 text-blue-700" },
    { id: "fertilizer", name: "Fertilizer", icon: <Package className="w-8 h-8" />, color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
    { id: "harvesting", name: "Harvesting", icon: <Wheat className="w-8 h-8" />, color: "bg-orange-100 border-orange-300 text-orange-700" },
    { id: "pesticide", name: "Pesticide", icon: <Hand className="w-8 h-8" />, color: "bg-purple-100 border-purple-300 text-purple-700" },
  ];

  const handleSave = () => {
    if (!selectedActivity) {
      toast({
        title: "Select an Activity",
        description: "Please select an activity type to log",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage (temporary - will be replaced with database)
    const activities = JSON.parse(localStorage.getItem("activities") || "[]");
    const newActivity = {
      id: Date.now().toString(),
      type: selectedActivity,
      date,
      time,
      notes,
      timestamp: new Date().toISOString()
    };
    
    activities.unshift(newActivity);
    localStorage.setItem("activities", JSON.stringify(activities));

    toast({
      title: "Activity Logged!",
      description: "Your farming activity has been saved successfully",
      className: "bg-success text-success-foreground",
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary p-4 shadow-medium">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-light/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-primary-foreground">
            Log Farm Activity
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24 space-y-4">
        {/* Activity Type Selection */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">What did you do today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {activityTypes.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    selectedActivity === activity.id
                      ? activity.color + " border-solid scale-105 shadow-medium"
                      : "bg-card border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {activity.icon}
                  <span className="text-sm font-medium">{activity.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date and Time */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              When?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date" className="text-base mb-2 block">Date</Label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-lg border bg-background text-base"
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-base mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time
              </Label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 rounded-lg border bg-background text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes and Photo */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes" className="text-base mb-2 block">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this activity..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] text-base"
              />
            </div>
            
            <div>
              <Label className="text-base mb-2 block">Photo (Optional)</Label>
              <Button
                variant="outline"
                className="w-full h-24 border-dashed border-2"
                onClick={() => {
                  toast({
                    title: "Camera Access",
                    description: "Photo upload will be available after backend setup",
                  });
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tap to add photo</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90 shadow-medium"
        >
          <Save className="mr-2 w-5 h-5" />
          Save Activity
        </Button>
      </main>

      <FloatingChatButton />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingChatButton } from "@/components/ui/floating-chat-button";
import { 
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Sprout,
  Save,
  LogOut,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [cropDetails, setCropDetails] = useState("");
  const [landSize, setLandSize] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    setName(localStorage.getItem("userName") || "");
    setLocation(localStorage.getItem("userLocation") || "");
    setPhone(localStorage.getItem("userPhone") || "");
    setCropDetails(localStorage.getItem("userCropDetails") || "");
    setLandSize(localStorage.getItem("userLandSize") || "");
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("userLocation", location);
    localStorage.setItem("userCropDetails", cropDetails);
    localStorage.setItem("userLandSize", landSize);
    
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
      className: "bg-success text-success-foreground",
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary p-4 shadow-medium">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-primary-foreground hover:bg-primary-light/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold text-primary-foreground">
              My Profile
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-light/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24 space-y-4">
        {/* Profile Picture */}
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Photo Upload",
                    description: "Photo upload will be available after backend setup",
                  });
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </span>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="text-base"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-base flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                Mobile Number
              </Label>
              <Input
                id="phone"
                value={phone}
                disabled
                className="text-base bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mobile number cannot be changed
              </p>
            </div>

            <div>
              <Label htmlFor="location" className="text-base flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!isEditing}
                placeholder="Village/City name"
                className="text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Farming Details */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sprout className="w-5 h-5" />
              Farming Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="crops" className="text-base mb-2 block">
                Main Crops
              </Label>
              <Input
                id="crops"
                value={cropDetails}
                onChange={(e) => setCropDetails(e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Rice, Wheat, Tomatoes"
                className="text-base"
              />
            </div>

            <div>
              <Label htmlFor="landSize" className="text-base mb-2 block">
                Land Size (in acres)
              </Label>
              <Input
                id="landSize"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 2.5"
                className="text-base"
                type="number"
                step="0.1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {isEditing && (
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-primary hover:opacity-90"
            >
              <Save className="mr-2 w-5 h-5" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
          </div>
        )}
      </main>

      <FloatingChatButton />
    </div>
  );
}
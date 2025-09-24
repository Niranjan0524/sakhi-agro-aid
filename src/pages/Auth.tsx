import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setShowOtp(true);
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: `OTP sent to +91 ${phoneNumber}`,
      });
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success!",
        description: isLogin ? "Welcome back!" : "Registration successful!",
        className: "bg-success text-success-foreground",
      });
      
      // Store auth state in localStorage (temporary - will be replaced with Supabase)
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userPhone", phoneNumber);
      if (!isLogin) {
        localStorage.setItem("userName", name);
        localStorage.setItem("userLocation", location);
      }
      
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🌾</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Krishi Sakhi
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin ? "Welcome back, farmer friend!" : "Join our farming community"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isLogin && !showOtp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base">Your Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your village/city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
            </>
          )}
          
          {!showOtp ? (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Mobile Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="text-lg h-12"
                  maxLength={10}
                />
              </div>
              
              <Button
                onClick={handleSendOTP}
                disabled={isLoading || (!isLogin && (!name || !location))}
                className="w-full h-12 text-base bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-5 w-5" />
                )}
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-base">Enter 6-digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-2xl h-14 text-center tracking-widest font-bold"
                  maxLength={6}
                />
              </div>
              
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="w-full h-12 text-base bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Verify & Continue"
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowOtp(false)}
                className="w-full"
              >
                Change Number
              </Button>
            </div>
          )}
          
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setShowOtp(false);
                setOtp("");
              }}
              className="text-primary hover:underline text-sm"
            >
              {isLogin ? "New user? Register here" : "Already registered? Login here"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
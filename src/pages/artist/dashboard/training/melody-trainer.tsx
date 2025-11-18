import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music2, Globe, Users, Mic } from "lucide-react";
import MelodyTrainer from "@/components/MelodyTrainer";

export default function MelodyTrainerPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/training")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training Hub
        </Button>

        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Music2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">
                  Cameroon Melody Trainer
                </CardTitle>
                <CardDescription className="text-base">
                  Practice traditional Cameroonian melodies and perfect your
                  pitch matching skills
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Cultural Heritage</h3>
              <p className="text-sm text-muted-foreground">
                Learn authentic Cameroonian music styles including Makossa,
                Bikutsi, and more
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mic className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-Time Pitch Detection</h3>
              <p className="text-sm text-muted-foreground">
                Advanced pitch analysis captures your vocal performance with
                high accuracy
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Music Styles</h3>
              <p className="text-sm text-muted-foreground">
                Practice with 5 distinct traditional Cameroonian musical genres
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Melody Trainer Component */}
        <MelodyTrainer />
      </div>
    </div>
  );
}

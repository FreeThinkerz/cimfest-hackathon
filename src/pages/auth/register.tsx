"use client";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genres } from "@/data/mockData";
import { apiClient } from "@/lib/api/client"; // <-- import added

const Register = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<"artist" | "sponsor" | "">("");

  const [formData, setFormData] = useState({
    name: "",
    artist_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    genres: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return toast("Please select a role");

    setLoading(true);

    try {
      const payload: any = {
        ...formData,
        role,
      };

      // Remove artist fields if sponsor
      if (role !== "artist") {
        delete payload.artist_name;
        delete payload.genres;
      }

      const response = await apiClient.post("/register", payload);

      console.log(response);
      // Save tokens for auto-login
      localStorage.setItem("access_token", response.token);
      localStorage.setItem("refresh_token", response.token);

      setAuth(response);

      toast("Registration successful! Redirecting...");

      if (response.user.roles[0] === "artist") navigate("/artist-dashboard");
      else if (response.user.roles[0] === "sponsor")
        navigate("/sponsor-dashboard");
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Registration failed, please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join Cameroon's premier music network"
    >
      <div className="text-center space-y-4">
        <h3 className="text-lg font-medium">Select Account Type</h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`border rounded-xl p-4 cursor-pointer transition 
            ${role === "artist" ? "border-slate-400 bg-slate-400/10" : "border-none"}`}
            onClick={() => setRole("artist")}
          >
            <h4 className="font-semibold">Artist</h4>
            <p className="text-sm text-muted-foreground">
              Showcase your music & get sponsored
            </p>
          </div>

          <div
            className={`border rounded-xl p-4 cursor-pointer transition
            ${role === "sponsor" ? "border-slate-400 bg-slate-400/10" : "border-none"}`}
            onClick={() => setRole("sponsor")}
          >
            <h4 className="font-semibold">Sponsor</h4>
            <p className="text-sm text-muted-foreground">
              Support talents & discover artists
            </p>
          </div>
        </div>
      </div>

      {role && (
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          {role === "artist" && (
            <>
              <div className="space-y-2">
                <Label>Stage/Artist Name</Label>
                <Input
                  required
                  value={formData.artist_name}
                  onChange={(e) => updateField("artist_name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Genres</Label>
                <Select
                  onValueChange={(value) =>
                    updateField("genres", [...formData.genres, value])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select genres (multi)" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 flex-wrap text-xs text-primary">
                  {formData.genres.map((g) => (
                    <span key={g}>#{g}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              required
              value={formData.password_confirmation}
              onChange={(e) =>
                updateField("password_confirmation", e.target.value)
              }
            />
          </div>

          <Button type="submit" className="w-full " disabled={loading}>
            {loading ? "Please wait..." : "Create Account"}
          </Button>
        </form>
      )}

      <p
        className="text-sm text-center  cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Already have an account?{" "}
        <span className="text-slate-400 hover:underline">Login</span>
      </p>
    </AuthLayout>
  );
};

export default Register;

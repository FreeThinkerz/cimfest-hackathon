"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/login", formData);
      console.log(response);

      // Save tokens
      localStorage.setItem("access_token", response.token);
      localStorage.setItem("refresh_token", response.token);

      setAuth(response);
      toast("Login successful! Redirecting...");

      if (response.user.roles[0] === "artist") navigate("/artist-dashboard");
      else if (response.user.roles[0] === "sponsor")
        navigate("/sponsor-dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      toast(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log into your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p
          className="text-sm text-center  cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Don't have an account?{" "}
          <span className="text-primary hover:underline">Register</span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;

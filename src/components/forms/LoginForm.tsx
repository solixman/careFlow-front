import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import "../css/login.css"; // reuse the same CSS

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface LoginFormProps {
  onLogin: (user: UserProps, token: string) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!email.trim()) return "Email is required.";
    if (!password) return "Password is required.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setIsLoading(true);
      const payload = { email: email.trim(), password };
      const res = await fetch("http://localhost:3333/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) return setError(data?.message || "Login failed");
      if (!data?.token || !data?.user)
        return setError("Server response did not include token or user.");

      onLogin(data.user, data.token);
    } catch (err) {
      console.error("Login error", err);
      setError("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <Button type="submit" disabled={isLoading} className="login-btn">
        {isLoading ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}

export default LoginForm;

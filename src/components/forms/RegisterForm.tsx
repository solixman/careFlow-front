import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface UserProps {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface RegisterFormProps {
  onRegister: (user: UserProps, token: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(isLoading)

  function validate() {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== password2) return "Passwords do not match.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      const res = await fetch("http://localhost:3333/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Status:", res.status);
      const raw = await res.clone().text();
      console.log("Raw response:", raw);

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Registration failed. Try again.");
        return;
      }

      const token = data?.token;
      const user = data?.user;

      if (!token || !user) {
        setError("Server response did not include token or user.");
        return;
      }

      onRegister(user, token);

    } catch (err) {
      console.error("Register error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md">
      {/* Name */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="password2">Confirm Password</Label>
        <Input
          id="password2"
          type="password"
          placeholder="••••••••"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Create Account
      </Button>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </form>
  );
};

export default RegisterForm;

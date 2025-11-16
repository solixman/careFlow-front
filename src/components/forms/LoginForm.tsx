import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface UserProps {
  id: string, name:string, email: string, role: string,status:string
}

interface LoginFormProps {
  onLogin: (user: UserProps, token: string) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(isLoading);

  function validate() {
    if (!email.trim()) return "Email is required.";
    if (!password) return "Password is required.";
    return "";
  }

  async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const payload = { email: email.trim(), password: password };
      const res = await fetch(`http://localhost:3333/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials:"include"
      })

      const data = await res.json();

      if (!res.ok) {
        const err =
          data?.message ||
          `something went wrong, please try again or contact the support`;
        setError(err);
      }

      const token = data?.token;
      const user = data?.user;

      if (!token || !user) {
        setError("Server response did not include token or user.");
        return;
      }

      if (typeof onLogin === "function") onLogin(user, token);

    } catch (err) {
      console.error("Login error", err);
      setError(`An unexpected error occurred. Please try again`);
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handelSubmit}
      className="flex flex-col gap-6 w-full max-w-md"
    >
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

      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;

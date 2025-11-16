import React, { useState } from "react";
import "../css/register.css";

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
    if (validationError) return setError(validationError);

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

      const data = await res.json();
      if (!res.ok) return setError(data?.message || "Registration failed.");
      if (!data?.token || !data?.user)
        return setError("Server response did not include token or user.");

      onRegister(data.user, data.token);
    } catch (err) {
      console.error("Register error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password2">Confirm Password</label>
        <input
          id="password2"
          type="password"
          placeholder="••••••••"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;

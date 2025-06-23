import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface LoginFormProps {
  onSubmit: (values: z.infer<typeof loginSchema>) => void;
  isLoading: boolean;
  onUsernameChange?: (username: string) => void;
}

export const LoginForm = ({ onSubmit, isLoading, onUsernameChange }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof loginSchema>) => {
    onSubmit(values);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUsernameChange) {
      onUsernameChange(e.target.value);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="login-form">
      <div className="input-group">
        <input
          {...form.register("username")}
          placeholder="Digite seu email"
          onChange={(e) => {
            form.register("username").onChange(e);
            handleUsernameChange(e);
          }}
          autoComplete="username"
          disabled={isLoading}
          className="login-input"
          type="email"
        />
      </div>

      <div className="input-group">
        <div className="password-container">
          <input
            {...form.register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            disabled={isLoading}
            className="login-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="password-button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={isLoading}
      >
        <span style={{ opacity: isLoading ? 0 : 1 }}>
          {isLoading ? "" : "Entrar"}
        </span>
      </button>
    </form>
  );
};

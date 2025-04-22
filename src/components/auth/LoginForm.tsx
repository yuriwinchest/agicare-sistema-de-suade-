
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/schemas/loginSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onSubmit: (values: z.infer<typeof loginSchema>) => Promise<void>;
  onEmailChange?: (email: string) => void;
  isLoading: boolean;
}

export const LoginForm = ({ onSubmit, onEmailChange, isLoading }: LoginFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onEmailChange) {
      onEmailChange(event.target.value);
    }
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Email"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleEmailChange(e);
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-200" />
            </FormItem>
          )}
        />
        
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-200" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-teal-400 hover:bg-teal-500 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
};

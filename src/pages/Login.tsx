import React from 'react';
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginError } from "@/components/auth/LoginError";
import { z } from "zod";
import { loginSchema } from "@/schemas/loginSchema";
import { useAuth } from "@/components/auth/AuthContext";
import "@/styles/pages/Login.css";

/**
 * Página de Login
 * Responsabilidade: Gerenciar autenticação do usuário e redirecionamento
 * Renderiza o formulário de login e controla o fluxo de autenticação
 */

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signin } = useAuth();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      console.log("Login.tsx - Tentando fazer login com:", values.username);
      const result = await signin(values.username, values.password);

      if (result.success) {
        console.log("Login.tsx - Login bem-sucedido, redirecionando...");
        navigate(from, { replace: true });
      } else {
        console.error("Login.tsx - Erro no login:", result.error);
        setLoginError(result.error || "Credenciais inválidas. Por favor, verifique seu email e senha.");
      }
    } catch (error: any) {
      console.error("Login.tsx - Erro inesperado:", error);
      setLoginError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-form-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center'
        }}
      >
        <div className="login-header">
          <div className="logo-futuristic">
            <svg
              width="70"
              height="70"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Círculo externo médico */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#medicalGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                opacity="0.6"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Cruz médica central */}
              <g transform="translate(50,50)">
                {/* Vertical da cruz */}
                <rect
                  x="-3"
                  y="-18"
                  width="6"
                  height="36"
                  fill="url(#medicalCrossGradient)"
                  rx="3"
                />
                {/* Horizontal da cruz */}
                <rect
                  x="-18"
                  y="-3"
                  width="36"
                  height="6"
                  fill="url(#medicalCrossGradient)"
                  rx="3"
                />
              </g>

              {/* Círculo interno com pulso */}
              <circle
                cx="50"
                cy="50"
                r="25"
                stroke="url(#pulseGradient)"
                strokeWidth="2"
                fill="rgba(59, 130, 246, 0.05)"
                opacity="0.8"
              >
                <animate
                  attributeName="r"
                  values="25;28;25"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.4;0.8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Pontos de vida médicos */}
              <circle cx="30" cy="30" r="2" fill="#10b981" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="30" r="2" fill="#3b82f6" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="30" cy="70" r="2" fill="#8b5cf6" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="70" r="2" fill="#06b6d4" opacity="0.7">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2.8s" repeatCount="indefinite" />
              </circle>

              {/* Gradientes médicos */}
                    <defs>
                <linearGradient id="medicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>

                <linearGradient id="medicalCrossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#059669" />
                      </linearGradient>

                <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </radialGradient>
                    </defs>
                  </svg>
                </div>

          <h1 className="login-title">SALUDOCARE</h1>
          <p className="login-subtitle">Sistema de Gestão Médica</p>
              </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          <LoginForm
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
          <LoginError message={loginError} />

          {/* Credenciais de demonstração */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
            color: '#1e3a8a'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>
              🔑 Credenciais de Demonstração
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Administrador:</strong><br />
              Email: admin@empresa.com<br />
              Senha: admin123
            </div>
            <div>
              <strong>Médico de Teste:</strong><br />
              Email: teste-colaborador@example.com<br />
              Senha: senha123teste
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

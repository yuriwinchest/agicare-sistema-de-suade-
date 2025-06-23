import React from "react";

interface LoginErrorProps {
  message: string;
}

export const LoginError: React.FC<LoginErrorProps> = ({ message }) => {
  return (
    <div className="error-message">
      {message}
    </div>
  );
};

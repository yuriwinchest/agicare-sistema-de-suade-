import React from "react";
import Layout from "@/components/layout/Layout";
import CompanyRegistrationForm from "@/components/admin/CompanyRegistrationForm";

const CompanyRegistration: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Cadastro de Empresa</h1>
        <CompanyRegistrationForm />
      </div>
    </Layout>
  );
};

export default CompanyRegistration;

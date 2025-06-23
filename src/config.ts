// Configurações do aplicativo
export const config = {
  supabase: {
    url: "https://xspmibkhtmnetitvnjox.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA"
  },
  // Outras configurações do aplicativo podem ser adicionadas aqui
};

// Exporta as configurações do Supabase para facilitar o acesso
export const supabaseConfig = {
  url: config.supabase.url,
  anonKey: config.supabase.anonKey
};
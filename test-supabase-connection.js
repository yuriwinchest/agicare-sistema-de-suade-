// Testar conexão Supabase
import fetch from 'node-fetch';

const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA";

async function testConnection() {
  try {
    console.log("Testando conexão com Supabase...");
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const status = response.status;
    console.log(`Status da conexão: ${status}`);
    
    if (status === 200) {
      console.log("Conexão bem-sucedida!");
      const data = await response.json();
      console.log("Resposta:", data);
    } else {
      console.error("Falha na conexão:", await response.text());
    }
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
  }
}

testConnection(); 
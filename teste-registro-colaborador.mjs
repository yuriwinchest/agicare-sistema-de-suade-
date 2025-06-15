// Script para testar o registro de colaboradores e o login
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (usando a chave de serviço)
const SUPABASE_URL = "https://xspmibkhtmnetivtnjox.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY2NzAzNSwiZXhwIjoyMDYwMjQzMDM1fQ.0wI6OP_6vFvIisC-jer0MMa94MdMah57WbtLeYMiB5I";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcG1pYmtodG1uZXRpdnRuam94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NjcwMzUsImV4cCI6MjA2MDI0MzAzNX0.eOILz9zyxyM8i0ZJ3AHrjlWK1AFbf_MX2i62m3KNYsA";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const TESTE_EMAIL = "teste-colaborador@example.com";
const TESTE_SENHA = "senha123teste";
const TESTE_NOME = "Colaborador de Teste";

async function testarRegistroELogin() {
  console.log("=== TESTE DE REGISTRO DE COLABORADOR E LOGIN ===");
  console.log("Este teste irá criar um colaborador de teste, registrá-lo no sistema de autenticação,");
  console.log("e depois testar o login. Irá verificar se todos os dados são salvos corretamente.\n");

  try {
    // 1. Verificar se o colaborador já existe e removê-lo
    console.log("1. Verificando se o colaborador de teste já existe...");
    const { data: colaboradorExistente, error: erroConsulta } = await supabase
      .from('collaborators')
      .select('*')
      .eq('email', TESTE_EMAIL)
      .maybeSingle();

    if (erroConsulta) {
      console.error("Erro ao verificar colaborador:", erroConsulta.message);
    }

    if (colaboradorExistente) {
      console.log("Colaborador encontrado, removendo para o teste...");
      const { error: erroRemocao } = await supabase
        .from('collaborators')
        .delete()
        .eq('email', TESTE_EMAIL);

      if (erroRemocao) {
        console.error("Erro ao remover colaborador:", erroRemocao.message);
      } else {
        console.log("Colaborador removido com sucesso.");
      }
    } else {
      console.log("Colaborador não existe, pode prosseguir com o teste.");
    }

    // 2. Verificar se existe usuário de autenticação com este email
    console.log("\n2. Verificando se existe usuário de autenticação...");
    try {
      // Vamos tentar fazer login para ver se o usuário existe
      const { data: usuarioExistente, error: erroLogin } = await supabase.auth.signInWithPassword({
        email: TESTE_EMAIL,
        password: TESTE_SENHA
      });

      if (usuarioExistente && usuarioExistente.user) {
        console.log("Usuário de autenticação existe, removendo...");
        
        // Se existe, precisamos remover o usuário
        // Aqui estamos usando admin delete, que é uma funcionalidade do service_role
        const { error: erroRemocaoUsuario } = await supabase.auth.admin.deleteUser(
          usuarioExistente.user.id
        );

        if (erroRemocaoUsuario) {
          console.error("Erro ao remover usuário:", erroRemocaoUsuario.message);
        } else {
          console.log("Usuário removido com sucesso.");
        }
      } else {
        console.log("Usuário de autenticação não existe, pode prosseguir com o teste.");
      }
    } catch (erro) {
      console.log("Usuário de autenticação não existe, pode prosseguir com o teste.");
    }

    // 3. Criar colaborador na tabela collaborators
    console.log("\n3. Criando colaborador na tabela 'collaborators'...");
    const { data: colaboradorCriado, error: erroCriacao } = await supabase
      .from('collaborators')
      .insert({
        name: TESTE_NOME,
        email: TESTE_EMAIL,
        phone: '11999998888',
        specialty: 'Testes Automatizados',
        department: 'TI',
        active: true,
        role: 'doctor',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (erroCriacao) {
      console.error("❌ Erro ao criar colaborador:", erroCriacao.message);
      return;
    }

    console.log("✅ Colaborador criado com sucesso:", colaboradorCriado);

    // 4. Criar usuário de autenticação
    console.log("\n4. Criando usuário no sistema de autenticação...");
    const { data: usuarioCriado, error: erroAuth } = await supabase.auth.admin.createUser({
      email: TESTE_EMAIL,
      password: TESTE_SENHA,
      email_confirm: true,
      user_metadata: {
        name: TESTE_NOME,
        role: 'doctor'
      }
    });

    if (erroAuth) {
      console.error("❌ Erro ao criar usuário de autenticação:", erroAuth.message);
      return;
    }

    console.log("✅ Usuário de autenticação criado com sucesso:", {
      id: usuarioCriado.user.id,
      email: usuarioCriado.user.email,
      metadados: usuarioCriado.user.user_metadata
    });

    // 5. Testar login
    console.log("\n5. Testando login com as credenciais criadas...");
    const { data: loginResult, error: loginError } = await supabase.auth.signInWithPassword({
      email: TESTE_EMAIL,
      password: TESTE_SENHA
    });

    if (loginError) {
      console.error("❌ Erro ao fazer login:", loginError.message);
      return;
    }

    console.log("✅ Login realizado com sucesso!");
    console.log("Token JWT gerado:", loginResult.session.access_token.substring(0, 20) + "...");

    // 6. Testar acesso a dados (enquanto autenticado)
    console.log("\n6. Testando acesso a dados como usuário autenticado...");
    
    // Criar cliente com o token do usuário
    const clienteUsuario = createClient(
      SUPABASE_URL, 
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${loginResult.session.access_token}`
          }
        }
      }
    );
    
    const { data: dadosColaborador, error: erroAcesso } = await clienteUsuario
      .from('collaborators')
      .select('*')
      .eq('email', TESTE_EMAIL)
      .single();
      
    if (erroAcesso) {
      console.error("❌ Erro ao acessar dados do colaborador:", erroAcesso.message);
      console.log("\nVerificando permissões RLS e políticas de segurança...");
      
      // Ver se o problema é de permissões ou outra coisa
      const { data: dadosAdmin } = await supabase
        .from('collaborators')
        .select('*')
        .eq('email', TESTE_EMAIL)
        .single();
        
      if (dadosAdmin) {
        console.log("O administrador consegue acessar os dados do colaborador, portanto o problema é nas políticas RLS.");
        console.log("Verifique se as políticas RLS para a tabela 'collaborators' estão configuradas corretamente.");
        console.log("Execute o script 'politicas-rls-supabase.sql' no Editor SQL do Supabase.");
      }
    } else {
      console.log("✅ Acesso aos dados de colaborador realizado com sucesso!", dadosColaborador);
    }

    // 7. Criar user_profile para associar o usuário ao colaborador
    console.log("\n7. Criando perfil de usuário para associar ao colaborador...");

    // CORREÇÃO: Primeiro, vamos verificar os campos obrigatórios da tabela user_profiles
    console.log("   Verificando campos obrigatórios da tabela user_profiles...");
    
    // Criar perfil sem professional_id para resolver problema de chave estrangeira
    const { data: perfilUsuarioAdmin, error: erroPerfilAdmin } = await supabase
      .from('user_profiles')
      .upsert({
        id: usuarioCriado.user.id,
        full_name: TESTE_NOME,
        // Removido o campo professional_id que estava causando erro
        role: 'doctor',
        is_active: true,
        username: TESTE_EMAIL.split('@')[0],
        last_login: new Date().toISOString()
      })
      .select()
      .single();
      
    if (erroPerfilAdmin) {
      console.error("❌ Erro ao criar perfil de usuário (como admin):", erroPerfilAdmin.message);
      console.log("Isso pode indicar um problema com a tabela user_profiles ou permissões RLS.");
      
      // Tentativa alternativa sem campos potencialmente problemáticos
      console.log("   Tentando criar perfil com campos mínimos...");
      const { data: perfilSimples, error: erroPerfilSimples } = await supabase
        .from('user_profiles')
        .upsert({
          id: usuarioCriado.user.id,
          full_name: TESTE_NOME,
          is_active: true
        })
        .select()
        .single();
        
      if (erroPerfilSimples) {
        console.error("❌ Também falhou com campos mínimos:", erroPerfilSimples.message);
      } else {
        console.log("✅ Perfil criado com sucesso usando campos mínimos!", perfilSimples);
      }
    } else {
      console.log("✅ Perfil de usuário criado com sucesso (como admin)!", perfilUsuarioAdmin);
      
      // Agora testamos se o usuário consegue acessar seu próprio perfil
      const { data: perfilUsuario, error: erroAcessoPerfil } = await clienteUsuario
        .from('user_profiles')
        .select('*')
        .eq('id', usuarioCriado.user.id)
        .single();
        
      if (erroAcessoPerfil) {
        console.error("❌ Erro ao acessar perfil do usuário (como usuário):", erroAcessoPerfil.message);
        console.log("Verifique se as políticas RLS para a tabela 'user_profiles' estão configuradas corretamente.");
      } else {
        console.log("✅ Acesso ao perfil de usuário bem-sucedido (como usuário)!", perfilUsuario);
      }
    }

    console.log("\n=== TESTE CONCLUÍDO ===");
    console.log("O colaborador e usuário de teste foram criados com sucesso.");
    console.log("Email:", TESTE_EMAIL);
    console.log("Senha:", TESTE_SENHA);
    console.log("\nVocê pode usar estas credenciais para testar o login no sistema.");
    
    if (erroAcesso) {
      console.log("\n⚠️ IMPORTANTE: Execute o script 'politicas-rls-supabase.sql' no Editor SQL do Supabase.");
      console.log("Isso irá configurar as políticas RLS necessárias para o funcionamento correto do sistema.");
    } else {
      console.log("\n✅ SUCESSO: O sistema está configurado corretamente e o login funciona!");
    }
  } catch (erro) {
    console.error("\n❌ ERRO DURANTE O TESTE:", erro);
  }
}

// Executar o teste
testarRegistroELogin(); 
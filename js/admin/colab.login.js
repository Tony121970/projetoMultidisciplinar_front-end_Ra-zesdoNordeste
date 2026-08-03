// LOGIN DOS COLABORADORES

// BLOQUEIA O EVENTO PADRAO DE REDIRECIONAMENTO DO FORMULARIO E CAPTURA AS CREDENCIAIS DE ACESSO
document.getElementById("formLogin").addEventListener("submit", function (e) {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();
    const erro = document.getElementById("erro");
    erro.textContent = "";
  
    // BASE DE DADOS SIMULADA COMPORTANDO AS CREDENCIAIS E ROTAS EXCLUSIVAS DE CADA SETOR
    const colaboradores = [
        {
            id: 1,
            nome: "Atendente",
            usuario: "atendente",
            senha: "atend1234",
            perfil: "atendente",
            pagina: "../atendente.html"
        },
  
        {
            id: 2,
            nome: "Cozinha",
            usuario: "cozinha",
            senha: "cozin1234",
            perfil: "cozinha",
            pagina: "../cozinha.html"
        },
  
        {
            id: 3,
            nome: "Entrega",
            usuario: "entrega",
            senha: "entreg1234",
            perfil: "entrega",
            pagina: "../entrega.html"
        },
 
        {
            id: 4,
            nome: "Gerência",
            usuario: "gerencia",
            senha: "gerenc1234",
            perfil: "gerencia",
            pagina: "colab.painel.html"
        },
  
    ];
    
    // EXECUTA UMA BUSCA NO ARRAY PARA VALIDAR SE AS CREDENCIAIS DIGITADAS CONDIZEM COM O SISTEMA
    const colaborador = colaboradores.find(c =>
        c.usuario === usuario &&
        c.senha === senha
    );
  
    // INTERROMPE A EXECUÇAO CASO A COMBINAÇAO DE DADOS ESTEJA ERRADA E EXIBE MENSAGEM NA TELA
    if (!colaborador) {
        erro.textContent = "Usuário ou senha inválidos.";
        return;
    }
  
    // ESTRUTURA E ARMAZENA O OBJETO DE SESSAO CONTENDO OS CRITERIOS E HORARIO DE ENTRADA
    const sessao = {
        autenticado: true,
        id: colaborador.id,
        nome: colaborador.nome,
        usuario: colaborador.usuario,
        perfil: colaborador.perfil,
        login: new Date().toLocaleString("pt-BR")
    };
  
    localStorage.setItem("sessaoColaborador", JSON.stringify(sessao));
  
    // PERSISTENCIA COMPLEMENTAR PARA SUPORTE INTEGRADO E REDIRECIONAMENTO SEGURO DO FLUXO
    localStorage.setItem("colaboradorLogado", "true");
    localStorage.setItem("setorLogado", colaborador.perfil);
    window.location.href = colaborador.pagina;
  });
  
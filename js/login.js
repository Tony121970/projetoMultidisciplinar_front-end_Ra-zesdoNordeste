// COMPARA AS CREDENCIAIS INFORMADAS COM OS DADOS DO LOCALSTORAGE E COMPUTA O LOGIN DO CLIENTE
function validarLogin(event) {
  // BLOQUEIA O EVENTO PADRAO DE REDIRECIONAMENTO E ATUALIZACAO AUTOMATICA DA PAGINA NO ENVIO DO FORMULARIO
  event.preventDefault();

  // LIMPA MENSAGENS RESIDUAIS DA TELA ZERANDO OS COMPONENTES TEXTUAIS
  const msgEl = document.getElementById("mensagem");

  if (msgEl) msgEl.textContent = "";
  let email = document.getElementById("email").value.trim().toLowerCase();
  let senha = document.getElementById("senha").value;

  // ALTERAÇÃO OPERACIONAL: Busca a senha específica correspondente ao e-mail informado
  let senhaSalva = localStorage.getItem(`senha_${email}`) || localStorage.getItem("senha");
  let dadosSalvosRaw = localStorage.getItem(`dados_${email}`);
  let dadosSalvos = dadosSalvosRaw ? JSON.parse(dadosSalvosRaw) : null;

  // USUÁRIO FIXO PARA TESTE ACADÊMICO DISPONIVEL COMO RETORNO DE CREDENCIAIS PADRAO
  const usuarioTeste = {
    nome: "Cliente Teste",
    endereco: "Rua Teste, 123",
    cep: "00000-000",
    telefone: "(00) 00000-0000",
    email: "cliente@teste.com",
    senha: "123456",
  };

  // VERIFICA LOGIN NORMAL OU LOGIN DE TESTE COMPARANDO AS STRINGS DIGITADAS
  if (
    (senha === senhaSalva && (email === localStorage.getItem("email") || dadosSalvos)) ||
    (email === usuarioTeste.email && senha === usuarioTeste.senha)
  ) {
    // MONTA OS DADOS DO USUÁRIO LOGADO ACESSANDO AS CHAVES EXISTENTES OU ADOTANDO O USUARIO DE SIMULACAO
    const usuario = {
      nome:
        dadosSalvos?.nome ||
        localStorage.getItem("nome") ||
        (email === usuarioTeste.email ? usuarioTeste.nome : "Cliente"),
      endereco:
        dadosSalvos?.endereco ||
        localStorage.getItem("endereco") ||
        (email === usuarioTeste.email ? usuarioTeste.endereco : ""),

      cep:
        dadosSalvos?.cep ||
        localStorage.getItem("cep") ||
        (email === usuarioTeste.email ? usuarioTeste.cep : ""),

      email: email,
      telefone:
        dadosSalvos?.telefone ||
        localStorage.getItem("telefone") ||
        (email === usuarioTeste.email ? usuarioTeste.telefone : ""),
    };

    // SALVA A SESSÃO DO CLIENTE EM TEXTO FORMATO JSON NA MEMORIA DO NAVEGADOR
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    // VINCULA O EMAIL DO LOGIN ATUAL À CHAVE LIDA PELO CLUBE DE FIDELIDADE
    localStorage.setItem("emailClienteLogado", email);

    // MENSAGEM VISUAL DE ENTRADA ATRAVES DA CAPSULA VERDE DO NOSSO ARQUIVO DE ALERTAS
    sucesso(`Bem-vindo de volta, ${usuario.nome || "Cliente"}!`);

    // AGUARDA A EXIBICAO DA MENSAGEM VISUAL ANTES DE EXECUTAR O DIRECIONAMENTO DE PAGINA
    setTimeout(() => {
      window.location.href = "../../html/index.html";
    }, 1000);
  } else {
    // TRATAMENTO EXCLUSIVO DE ERRO CASO AS CREDENCIAIS DIGITADAS ESTEJAM INCORRETAS
    if (msgEl) {
      msgEl.innerHTML = "E-mail ou senha inválidos.";
    }
    erro("Falha no login: E-mail ou senha inválidos.");
  }
}

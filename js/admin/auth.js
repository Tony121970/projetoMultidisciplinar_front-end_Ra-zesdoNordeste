// SISTEMA CENTRAL DE AUTENTICAÇÃO

// RECUPERA E CONVERTE OS DADOS DE SESSAO DO COLABORADOR SALVOS NO LOCALSTORAGE
function obterSessaoColaborador() {
  const dados = localStorage.getItem("sessaoColaborador");
  if (!dados) {
    return null;
  }
  return JSON.parse(dados);
}

// RETORNA UM BOOLEANO CONFIRMANDO SE HA ALGUM USUARIO LOGADO NO SISTEMA
function colaboradorLogado() {
  const sessao = obterSessaoColaborador();
  return sessao !== null;
}

// VERIFICA SE O OPERADOR ATUAL CONDIZ COM AS RETRICOES DE ACESSO DO SETOR SOLICITADO
function verificarPermissao(perfilPermitido) {
  const sessao = obterSessaoColaborador();

  // EM CASO DE SESSAO INEXISTENTE DISPARA O ALERTA E TRATAMENTO DE RETORNO
  if (!sessao) {
    alert("Faça login para acessar o sistema.");
    redirecionarParaLogin();
    return false;
  }

  // VALIDA SE O PERFIL DO OPERADOR (EX: 'COZINHA', 'ATENDENTE', 'ENTREGA') POSSUI CREDENCIAIS EXCLUSIVAS
  if (sessao.perfil !== perfilPermitido) {
    alert("Você não possui permissão para acessar esta área.");
    redirecionarParaLogin();
    return false;
  }
  return true;
}

// EXPULSA O USUARIO DA SESSÃO ATUAL LIMPANDO TODAS AS CHAVES DE CONTROLE DA MEMORIA
function logoutColaborador() {
  localStorage.removeItem("sessaoColaborador");
  localStorage.removeItem("colaboradorLogado");
  localStorage.removeItem("setorLogado");

  alert("Sessão encerrada com sucesso.");
  redirecionarParaLogin();
}

// MAPEIA O CAMINHO DA URL DO NAVEGADOR PARA CORRIGIR AS DIRETORIAS DE RETORNO AUTOMATICAMENTE
function redirecionarParaLogin() {
  // CASO A URL APONTE DENTRO DA DIRETORIA ADMIN O ENDERECO DE LOGIN CONDIZ COM A PROPRIA PASTA
  if (window.location.pathname.includes("/admin/")) {
    window.location.href = "colab.login.html";
  } else {
    // SE O ENDERECO DA PAGINA ATUAL CONDIZ COM A RAIZ REORGANIZA A ROTA ACESSANDO A PASTA INTERNA
    window.location.href = "admin/colab.login.html";
  }
}

// VERIFICA SE O ADMINISTRADOR ESTÁ LOGADO AO CARREGAR A PÁGINA E BLOQUEIA ACESSO NÃO AUTORIZADO
document.addEventListener("DOMContentLoaded", () => {
  const logado = localStorage.getItem("adminLogado");

  // SE A CHAVE DE CONTROLE NAO FOR ENCONTRADA OU ESTIVER INCORRETA INTERROMPE O FLUXO E MANDA PARA O LOGIN
  if (logado !== "true") {
    window.location.href = "./login.html";
    return;
  }
});

// REDIRECIONA O NAVEGADOR PARA A PÁGINA ESPECIFICADA NOS PARÂMETROS
/*function abrir(pagina) {
  window.location.href = pagina;
}*/

// FUNÇAO DE REDIRECIONAMENTO ADM QUE REALIZA UMA CHECAGEM EXTRATA DE SEGURANÇA ANTES DE MUDAR A ROTA
function abrirSetor(pagina) {

  // CONFIRMA SE A CHAVE DE ACESSO DO ADMINISTRADOR ESTA ATIVA NA MEMORIA DO NAVEGADOR
  if (localStorage.getItem("adminLogado") === "true") {
      window.location.href = pagina;
  } else {
      // CASO ESTEJA DESLOGADO ENCAMINHA O OPERADOR DE VOLTA PARA A PAGINA DE AUTENTICAÇAO
      window.location.href = "login.html";
  }

}

// FAZ O LOGOUT DO ADMINISTRADOR REMOVENDO A SESSÃO E REDIRECIONA PARA A TELA DE LOGIN
function sair() {
  // LIMPA A CHAVE DE AUTENTICAÇAO DO LOCALSTORAGE E EXECUTA O RETORNO RESTRITO PARA A TELA DE ENTRADA
  localStorage.removeItem("adminLogado");
  window.location.href = "./login.html";
}

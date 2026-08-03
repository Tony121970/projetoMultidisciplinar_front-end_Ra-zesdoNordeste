// BLOCO DE PROTEÇAO QUE VALIDA SE O OPERADOR POSSUI ACESSO ATIVO E CASO NEGATIVO EXPULSA PARA O LOGIN
if (localStorage.getItem("colaboradorLogado") !== "true") {
  window.location.href = "colab.login.html";
}

// ESCUTA O EVENTO DE CLIQUE NO BOTAO DE SAIDA PARA LIMPAR AS CREDENCIAIS E REDIRECIONAR O FLUXO
document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("colaboradorLogado");
  window.location.href = "colab.login.html";
});

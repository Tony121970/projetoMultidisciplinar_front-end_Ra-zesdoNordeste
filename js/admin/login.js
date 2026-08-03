// VALIDA AS CREDENCIAIS DO ADMINISTRADOR E REDIRECIONA PARA O PAINEL DE CONTROLE
function logar() {
  // CAPTURA OS VALORES DIGITADOS NOS CAMPOS DE TEXTO E SENHA DO FORMULARIO
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  console.log("Tentando login...");

  // VERIFICA SE AS CREDENCIAIS CONDIZEM EXATAMENTE COM AS REGRAS ESTRITAS DO ADMINISTRADOR
  if (usuario === "admin" && senha === "1234") {
    // SALVA A CHAVE DE CONTROLE NO LOCALSTORAGE PARA LIBERAR O ACESSO NAS OUTRAS PAGINAS
    localStorage.setItem("adminLogado", "true");
    console.log("LOGADO OK:", localStorage.getItem("adminLogado"));
    
    // AGENDA O REDIRECIONAMENTO COM UM LEVE RETARDO DE TEMPO PARA GARANTIR A GRAVAÇÃO DOS DADOS
    setTimeout(() => {
      window.location.href = "./painel.html";
    }, 100);
  } else {
    // INJETA A NOTIFICAÇÃO DE FALHA NA AREA DE TEXTO RESERVADA CASO OS DADOS ESTEJAM INCORRETOS
    document.getElementById("erro").textContent = "Usuário ou senha inválidos";
  }
}

// CAPTURA OS DADOS DO FORMULARIO, ARMAZENA NO LOCALSTORAGE E REDIRECIONA PARA O LOGIN
function cadastrar(event) {
  // BLOQUEIA O EVENTO PADRAO DE REDIRECIONAMENTO E ATUALIZACAO DA PAGINA NO ENVIO DO FORMULARIO
  event.preventDefault();

  // ADICIONADO: VALIDAÇÃO DE SEGURANÇA EXTRA PARA A CAIXA DE SELEÇÃO LGPD
  const checkboxLgpd = document.getElementById("termosLgpd");
  if (!checkboxLgpd || !checkboxLgpd.checked) {
    aviso("Você precisa concordar com os termos da LGPD para continuar.");
    return;
  }

  // CAPTURA OS VALORES DIGITADOS EM CADA UM DOS CAMPOS DE ENTRADA DO CLIENTE
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const cep = document.getElementById("cep").value;
  const email = document.getElementById("emailCad").value.trim().toLowerCase();
  const telefone = document.getElementById("telefone").value;
  const senha = document.getElementById("senhaCad").value;

  // CRIA UM OBJETO ESTRUTURADO DO USUARIO REUNINDO TODAS AS INFORMAÇOES CAPTURADAS
  const dadosUsuario = {
    nome: nome,
    endereco: endereco,
    cep: cep,
    email: email,
    telefone: telefone,
    senha: senha,
    aceitouLGPD: true, 
    dataConsentimento: new Date().toLocaleString("pt-BR") 
  };

  // SALVA AS CREDENCIAIS VINCULADAS AO PRÓPRIO E-MAIL (PERMITE MÚLTIPLOS LOGINS)
  localStorage.setItem(`senha_${email}`, senha);
  localStorage.setItem(`dados_${email}`, JSON.stringify(dadosUsuario));

  // MANTÉM O COMPORTAMENTO ORIGINAL PARA NÃO QUEBRAR FLUXOS LEGADOS DE UM ÚNICO USUÁRIO SE NECESSÁRIO
  localStorage.setItem("nome", nome);
  localStorage.setItem("endereco", endereco);
  localStorage.setItem("cep", cep);
  localStorage.setItem("email", email);
  localStorage.setItem("telefone", telefone);
  localStorage.setItem("senha", senha);

  // EXIBE A CAPSULA DE NOTIFICAÇAO VISUAL DE CONFIRMAÇAO DO NOSSO SISTEMA DE ALERTAS
  sucesso("Cadastro realizado com sucesso!");

  // ENCAMINHA O NOVO CLIENTE DE FORMA AUTOMATICA PARA A INTERFACE DE AUTENTICAÇAO
  window.location.href = "../html/login.html";
}

// VALIDA O E-MAIL INFORMADO, ATUALIZA A SENHA NO ARMAZENAMENTO LOCAL EM CASO DE SUCESSO E DIRECIONA O USUÁRIO DE VOLTA PARA A TELA DE LOGIN apos 2 SEGUNDOS
function redefinirSenha(event) {
  // INTERCEPTA O EVENTO PADRAO DE SUBMIT DO FORMULARIO IMPEDINDO A ATUALIZACAO AUTOMATICA DA PAGINA
  event.preventDefault();
  const mensagem = document.getElementById("mensagem");

  // LIMPA A MENSAGEM ANTERIOR ZERANDO OS COMPONENTES TEXTUAIS DA INTERFACE
  if (mensagem) mensagem.textContent = "";
  
  const emailInput = document
    .getElementById("email")
    .value.trim()
    .toLowerCase();
  const novaSenha = document.getElementById("novaSenha").value;
  const emailSalvo = localStorage.getItem("email");
  console.log("Digitado:", emailInput);
  console.log("Salvo:", emailSalvo);

  // BLOQUEIO LOGICO CASO O NAVEGADOR NAO ENCONTRE NENHUM EMAIL PREVIAMENTE GRAVADO NO LOCALSTORAGE
  if (!emailSalvo) {
    if (mensagem) {
      mensagem.style.color = "#d62828";
      mensagem.textContent = "Nenhum usuário cadastrado!";
    }
    // DISPARA A CAPSULA VERMELHA DE NOTIFICACAO DO NOSSO SISTEMA CENTRAL DE ALERTAS
    erro("Erro: Nenhum usuário cadastrado no sistema!");
    return;
  }

  // COMPARA SE O ENDERECO DIGITADO CONDIZ EXATAMENTE COM AS CREDENCIAIS ARMAZENADAS
  if (emailInput === emailSalvo) {
    // REESCREVE A CHAVE DE SENHA COMPLEMENTAR REALIZANDO A ATUALIZACAO DOS DADOS
    localStorage.setItem("senha", novaSenha);
    
    if (mensagem) {
      mensagem.style.color = "#28a745";
      mensagem.textContent = "Senha redefinida com sucesso!";
    }

    // DISPARA A CAPSULA VERDE DE SUCESSO EXIBINDO NOTIFICACAO VISUAL NA TELA DO USUARIO
    sucesso("Senha redefinida com sucesso!");

    // AGENDA O REDIRECIONAMENTO COM UM ATRASO SEGURO DE DOIS SEGUNDOS PARA RETORNAR AO LOGIN
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } else {
    // TRATAMENTO RESTRITO SE O EMAIL CONSTAR CADASTRADO MAS RETORNAR DIFERENTE DO DIGITADO
    if (mensagem) {
      mensagem.style.color = "#d62828";
      mensagem.textContent = "E-mail não encontrado!";
    }
    // DISPARA A CAPSULA VERMELHA DE REJEICAO NOTIFICANDO A INCOMPATIBILIDADE DE DADOS
    erro("Falha: O e-mail informado não foi encontrado!");
  }
}

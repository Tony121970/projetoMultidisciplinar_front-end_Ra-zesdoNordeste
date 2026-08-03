// SISTEMA DE MENSAGENS

// GERENCIA A CRIAÇÃO, EXIBIÇÃO E REMOÇÃO DINÂMICA DE ALERTAS ESTILO TOAST NA TELA
function mostrarMensagem(texto, tipo = "info") {
  // SELECIONA E REMOVE COMPONENTES FLUTUANTES ANTIGOS DA TELA PARA EVITAR ACUMULO VISUAL
  const antigo = document.querySelector(".toast-raizes");
  if (antigo) antigo.remove();

  // CRIA DINAMICAMENTE O ELEMENTO DIV E INSERE AS CLASSES E TEXTOS ESPECIFICOS DO ALERTA
  const toast = document.createElement("div");
  toast.className = `toast-raizes ${tipo}`;
  toast.textContent = texto;
  document.body.appendChild(toast);

  // ADICIONA A CLASSE DE TRANSICAO COM UM LEVE ATRASO PARA DISPARAR A ANIMAÇAO DE ENTRADA
  setTimeout(() => {
      toast.classList.add("mostrar");
  }, 30);

  // AGENDA A REMOÇAO DA NOTIFICAÇAO E DOS ELEMENTOS DO DOM APOS O TEMPO DE EXIBIÇAO DETERMINADO
  setTimeout(() => {
      toast.classList.remove("mostrar");
      setTimeout(() => {
          toast.remove();
      }, 300);
  }, 2500);
}


// ATALHO PARA EXIBIR MENSAGEM VISUAL DE SUCESSO (CÁPSULA VERDE)
function sucesso(texto){
  mostrarMensagem(texto, "sucesso");
}

// ATALHO PARA EXIBIR MENSAGEM VISUAL DE ERRO (CÁPSULA VERMELHA)
function erro(texto){
  mostrarMensagem(texto, "erro");
}

// ATALHO PARA EXIBIR MENSAGEM VISUAL DE AVISO (CÁPSULA AMARELA)
function aviso(texto){
  mostrarMensagem(texto, "aviso");
}

// ATALHO PARA EXIBIR MENSAGEM VISUAL DE INFORMAÇÃO (CÁPSULA AZUL)
function info(texto){
  mostrarMensagem(texto, "info");
}

// CONFIRMAÇÃO

// CRIA UMA JANELA DE CONFIRMAÇÃO ASSÍNCRONA E PERSONALIZADA COM BOTÕES DE SIM E NÃO
function confirmar(texto) {
  // RETORNA UMA PROMISE PARA CONTROLAR AS ACOES DE DECISAO DO OPERADOR DE FORMA ASSINCRONA
  return new Promise((resolve) => {
    // CRIA OS COMPONENTES VISUAIS DA JANELA FLUTUANTE E DO FUNDO ESCURECIDO DO MODAL
    const fundo = document.createElement("div");
    fundo.className = "modal-confirmar-fundo";
    const modal = document.createElement("div");
    modal.className = "modal-confirmar";
    modal.innerHTML = `
      <h3>Confirmação</h3>
      <p>${texto}</p>

      <div class="botoes-confirmar">
        <button class="btn-nao">Não</button>
        <button class="btn-sim">Sim</button>
      </div>
    `;

    fundo.appendChild(modal);
    document.body.appendChild(fundo);

    // ESCUTA O CLIQUE NA OPÇAO POSITIVA PARA FECHAR O MODAL E RETORNAR VERDADEIRO
    modal.querySelector(".btn-sim").onclick = () => {
      fundo.remove();
      resolve(true);
    };

    // ESCUTA O CLIQUE NA OPÇAO NEGATIVA PARA FECHAR O MODAL E RETORNAR FALSO
    modal.querySelector(".btn-nao").onclick = () => {
      fundo.remove();
      resolve(false);
    };
  });
}

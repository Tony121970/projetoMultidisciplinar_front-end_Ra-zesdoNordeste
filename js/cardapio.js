// REMOVE ACENTOS, CONVERTE PARA MINÚSCULAS E LIMPA ESPAÇOS DE UMA STRING PARA COMPARÇÃO
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// RESTAURA A VISIBILIDADE PADRÃO DE TODOS OS CARDS E GRUPOS DE CATEGORIAS DA TELA
function resetarCards() {
  // EXIBE NOVAMENTE TODOS OS ELEMENTOS DE PRODUTOS INDIVIDUAIS
  document.querySelectorAll(".card, .card-opcao").forEach((card) => {
    card.style.display = "";
  });
  // RESTAURA A EXIBIÇÃO EM GRID DOS CONTAINERS DE AGRUPAMENTO
  document.querySelectorAll(".cards").forEach((grupo) => {
    grupo.style.display = "grid";
  });
}

// FILTRA VISUALMENTE OS PRODUTOS NA TELA COM BASE NO TEXTO DIGITADO NO CAMPO DE BUSCA
function pesquisarProdutos() {
  const campo = document.getElementById("pesquisa");

  if (!campo) return;
  const texto = normalizar(campo.value);
  const cards = document.querySelectorAll(".card, .card-opcao");
  const extras = document.getElementById("itens-extras");
  let encontrouExtra = false;
  
  // CRIA UMA EXPRESSÃO REGULAR PARA EXECUTAR A BUSCA POR INICIO DE PALAVRA INDEPENDENTE DE MAIUSCULAS
  const regexBusca = new RegExp("\\b" + texto, "i");
  
  cards.forEach((card) => {
    const conteudo = normalizar(card.innerText);
    const encontrou = texto === "" ? true : regexBusca.test(conteudo);

    if (texto === "") {
      card.style.display = "";
    } else if (encontrou) {
      card.style.display = "";

      // VALIDA SE O COMPONENTE LOCALIZADO FAZ PARTE DO AGRUPAMENTO OCULTO
      if (card.classList.contains("card-opcao")) {
        encontrouExtra = true;
      }
    } else {
      card.style.display = "none";
    }
  });

  // OCULTA AS SEÇÕES DE CATEGORIA CUJOS CARDS FICARAM TOTALMENTE INVISÍVEIS PELO FILTRO
  document.querySelectorAll(".cards").forEach((grupo) => {
    const possui = [...grupo.querySelectorAll(".card")].some((card) => {
      return card.style.display !== "none";
    });

    grupo.style.display = possui ? "grid" : "none";
  });

  // CONTROLA DINAMICAMENTE A VISIBILIDADE DA AREA RESTRITA DE MAIS OPÇÕES
  if (extras) {
    if (texto === "") {
      extras.style.display = "none";
    } else {
      extras.style.display = encontrouExtra ? "grid" : "none";
    }
  }
}

// ATIVA A SEÇÃO OCULTA DE PRODUTOS COMPLEMENTARES E ACIONA ROLAGEM SUAVE DA INTERFACE
function abrirMaisOpcoes() {
  const extras = document.getElementById("itens-extras");
  const pesquisa = document.getElementById("pesquisa");
  const alvo = document.getElementById("mais-opcoes");

  if (!extras) return;

  // LIMPA O FILTRO DIGITADO NO CAMPO DE BUSCA RAPIDA
  if (pesquisa) {
    pesquisa.value = "";
  }

  resetarCards();
  const aberto = getComputedStyle(extras).display === "grid";

  // ALTERNA O ESTADO DE VISIBILIDADE DO GRID COMPLEMENTAR E DIRECIONA O FOCO DA TELA
  if (aberto) {
    extras.style.display = "none";
  } else {
    extras.style.display = "grid";

    if (alvo) {
      setTimeout(() => {
        alvo.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }
}

// ATRIBUI UM VALOR AO CAMPO DE BUSCA, FILTRA OS PRODUTOS E CENTRALIZA O PRIMEIRO RESULTADO NA TELA
function pesquisarItem(nome) {
  const campo = document.getElementById("pesquisa");

  if (!campo) return;
  campo.value = nome;
  pesquisarProdutos();
  
  // CAPTURA A PRIMEIRA OCORRENCIA VALIDA QUE NAO ESTEJA OCULTA PELO FILTRO VISUAL
  const primeiro = document.querySelector(
    '.card:not([style*="display: none"]), .card-opcao:not([style*="display: none"])'
  );

  // EXECUTA A ANIMAÇÃO DE ROLAGEM ATE O ELEMENTO LOCALIZADO NO MAPA DO SITE
  if (primeiro) {
    setTimeout(() => {
      primeiro.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  }
}

// CAPTURA O COMPORTAMENTO DE INTERAÇÃO DOS ELEMENTOS DO ACESSO INTERNO DA INTERFACE
document.addEventListener("DOMContentLoaded", () => {
  const pesquisa = document.getElementById("pesquisa");
  const btnPesquisar = document.getElementById("btnPesquisar");

  // MOVE A TELA SUAVEMENTE ATÉ O PRIMEIRO PRODUTO QUE CORRESPONDE AO FILTRO DA PESQUISA
  function rolarAteOPrimeiro() {
    const primeiro = document.querySelector(
      '.card:not([style*="display: none"]), .card-opcao:not([style*="display: none"])'
    );

    if (primeiro) {
      setTimeout(() => {
        primeiro.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    }
  }

  // PESQUISA ENQUANTO DIGITA (APENAS FILTRA NA TELA)
  if (pesquisa) {
    pesquisa.addEventListener("input", pesquisarProdutos);

    // ENTER: FILTRA E ROLA ATÉ O PRODUTO BLOQUEANDO O ENVIO RESTRITO DO FORMULARIO
    pesquisa.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        pesquisarProdutos();
        rolarAteOPrimeiro();
      }
    });
  }

  // CLIQUE NA LUPA: FILTRA E ROLA ATÉ O PRODUTO INTERCEPTANDO O EVENTO
  if (btnPesquisar) {
    btnPesquisar.addEventListener("click", (e) => {
      e.preventDefault();
      pesquisarProdutos();
      rolarAteOPrimeiro();
    });
  }

  // ASSEGURA QUE O GRID COMPLEMENTAR RESTRITO INICIE OCULTADO POR PADRAO
  const extras = document.getElementById("itens-extras");

  if (extras) {
    extras.style.display = "none";
  }
});

// MAPEIA E ATUALIZA DINAMICAMENTE OS COMPONENTES TEXTUAIS DE VALORES DE CADA CARD DO CARDAPIO
function atualizarPrecosCardapio() {
  const produtos = JSON.parse(localStorage.getItem("produtosRaizes")) || [];
  document.querySelectorAll(".card, .card-opcao").forEach((card) => {
    const botao = card.querySelector("button");

    if (!botao) return;
    const id = botao.dataset.id;
    const produto = produtos.find((item) => item.id === id);

    // EMITE NOTIFICAÇAO NO CONSOLE CASO A CHAVE DE IDENTIFICAÇAO RETORNE INVALIDA
    if (!produto) {
      console.warn("Produto não encontrado:", id);
      return;
    }
    const campoPreco = card.querySelector(".preco, .preco-mini");

    if (!campoPreco) return;
    campoPreco.textContent =
      "R$ " + Number(produto.preco).toFixed(2).replace(".", ",");
  });
}
document.addEventListener("DOMContentLoaded", atualizarPrecosCardapio);

// VALIDA E ALTERNA VISUALMENTE OS CONTROLES DOS CARDS COM BASE NA DISPONIBILIDADE DA MERCADORIA
function atualizarDisponibilidadeCardapio() {
  const produtos = JSON.parse(localStorage.getItem("produtosRaizes")) || [];
  document.querySelectorAll(".btn-pedir, .btn-mini").forEach((botao) => {
    const nome = botao.dataset.nome;
    const produto = produtos.find((item) => item.nome === nome);

    if (!produto) return;

    // ALTERA AS PROPRIEDADES VISUAIS E DE BLOQUEIO CASO O ITEM ESTEJA NOTIFICADO COMO INDISPONIVEL
    if (produto.disponivel === false) {
      botao.disabled = true;
      botao.innerHTML = "Indisponível";
      botao.style.background = "#dc3545";
      botao.style.color = "white";
      botao.style.cursor = "not-allowed";
    } else {
      botao.disabled = false;
      botao.innerHTML = "Adicionar";
      botao.style.background = "#28a745";
      botao.style.color = "white";
      botao.style.cursor = "pointer";
    }
  });
}

// CONFIGURA A EXECUÇÃO INICIAL E CRONOMETRADA PARA ATUALIZAÇÃO EM TEMPO REAL DOS PRODUTOS
document.addEventListener("DOMContentLoaded", atualizarDisponibilidadeCardapio);

setInterval(atualizarDisponibilidadeCardapio, 3000);

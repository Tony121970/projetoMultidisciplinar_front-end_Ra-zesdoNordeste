// RECUPERAR O CARRINHO SALVO NA MEMORIA LOCAL OU INICIALIZAR COMO UM ARRAY VAZIO
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// FUNÇAO PARA CAPTURAR O PREÇO ATUALIZADO DO PRODUTO DIRETO DO CATALOGO DO LOCALSTORAGE
function buscarPrecoProduto(nome) {
  const produtos = JSON.parse(localStorage.getItem("produtosRaizes")) || [];
  const produto = produtos.find((item) => item.nome === nome);

  if (produto) {
    return Number(produto.preco);
  }
  return 0;
}

// CAPTURA O CLIQUE EM TODOS OS BOTOES DE COMPRA PARA ENCAMINHAR O ITEM AO CARRINHO
document.querySelectorAll(".btn-pedir, .btn-mini").forEach((botao) => {
  botao.addEventListener("click", function () {
    const nome = botao.dataset.nome;

    // VERIFICA SE O PRATO SELECIONADO CONTA COMO INDISPONIVEL NA BASE OPERACIONAL DO GERENTE
    const produtos = JSON.parse(localStorage.getItem("produtosRaizes")) || [];
    const produto = produtos.find((item) => item.nome === nome);

    if (produto && produto.disponivel === false) {
      aviso(nome + " está indisponível no momento.");
      return;
    }
    const preco = buscarPrecoProduto(nome);
    const imagem = botao.dataset.imagem;

    const produtoExistente = carrinho.find((item) => item.nome === nome);

    // INCREMENTA A QUANTIDADE DO ITEM SE ELE JA EXISTIR OU INSERE O OBJETO NOVO NA LISTA
    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {
      carrinho.push({
        nome,
        preco,
        imagem,
        quantidade: 1,
      });
    }

    // PERSISTE AS ALTERAÇOES, ATUALIZA A CONTAGEM VISUAL DO TOPO E EMITE ALERTA DE SUCESSO
    salvarCarrinho();
    atualizarContador();
    sucesso(nome + " adicionado ao carrinho!");
  });
});

// GRAVA O ESTADO ATUALIZADO DO CARRINHO EM TEXTO FORMATO JSON NO LOCALSTORAGE
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// COMPUTA E ATUALIZA A CONTAGEM TOTAL DE PRODUTOS SELECIONADOS NO ICONE DO HEADER
function atualizarContador() {
  const contador = document.getElementById("contadorCarrinho");
  if (!contador) return;
  let total = 0;
  carrinho.forEach((produto) => {
    total += produto.quantidade;
  });

  contador.textContent = total;
}

// CONFIGURA E RENDERIZA DINAMICAMENTE A GRILE DOS ITENS ADICIONADOS COM CALCULO DE TOTAIS
function carregarCarrinho() {
  const lista = document.getElementById("listaCarrinho");

  if (!lista) return;
  lista.innerHTML = "";

  // TRATAMENTO VISUAL SEGURO CASO NAO HAJA NENHUM PRODUTO NO CARRINHO
  if (carrinho.length == 0) {
    document.getElementById("carrinhoVazio").style.display = "block";
    document.getElementById("resumoPedido").style.display = "none";
    atualizarContador();
    return;
  }

  // EXIBE AS INFORMAÇOES OPERACIONAIS DE FATURAMENTO E OCULTA O ALERTA DE VAZIO
  document.getElementById("carrinhoVazio").style.display = "none";
  document.getElementById("resumoPedido").style.display = "block";
  let subtotal = 0;
  let itens = 0;
  
  // PERCORRE A FILA DE COMPRAS CALCULANDO OS VALORES E GERANDO OS CARDS HTML DOS PRODUTOS
  carrinho.forEach((produto, index) => {
    subtotal += produto.preco * produto.quantidade;
    itens += produto.quantidade;
    
    // CORREÇAO: EXCLUIDO AS DUAS MARCAÇOES "A" QUE ESTAVAM SOLTAS QUEBRANDO A SINTAXE DO COMPILADOR
    lista.innerHTML += `
      <div class="item-carrinho">
      <img src="${produto.imagem}">
      <div class="info-produto">
        <h3>${produto.nome}</h3>

        <p class="preco" style="color: red">
          R$ ${produto.preco.toFixed(2)}
        </p>

        <div class="controle">
          <button onclick="diminuir(${index})">-</button>
          <span class="quantidade">${produto.quantidade}</span>
          <button onclick="aumentar(${index})">+</button>
        </div>

        <p class="subtotal" style="color: green">
          Subtotal: R$ ${(produto.preco * produto.quantidade).toFixed(2)}
        </p>

        </div>
          <button onclick="remover(${index})" class="btn-remover">🗑️</button>
        </div>
    `;
  });

  // ATUALIZA OS CAMPOS ESPECIFICOS DE PREÇOS DO RESUMO DE ENCERRAMENTO DA TELA
  document.getElementById("subtotal").textContent = "R$ " + subtotal.toFixed(2);
  document.getElementById("valorTotal").textContent = "R$ " + subtotal.toFixed(2);
  document.getElementById("totalItens").textContent = itens;
  atualizarContador();
}

// ADICIONA UMA UNIDADE ADICIONAL DA MERCADORIA SELECIONADA PELO INDICE DO ARRAY
function aumentar(indice) {
  carrinho[indice].quantidade++;
  salvarCarrinho();
  carregarCarrinho();
}

// REDUZ A QUANTIDADE DA MERCADORIA SELECIONADA E REMOVE DO MAPA SE CHEGAR A ZERO
function diminuir(indice) {
  carrinho[indice].quantidade--;

  if (carrinho[indice].quantidade <= 0) {
    carrinho.splice(indice, 1);
  }
  salvarCarrinho();
  carregarCarrinho();
}

// EXCLUI COMPLETAMENTE A MERCADORIA DA FILA DE COMPRAS ATRAVES DO COMANDO REMOVER
function remover(indice) {
  carrinho.splice(indice, 1);
  salvarCarrinho();
  carregarCarrinho();
}

// CAPTURA A SOLICITAÇAO DE LIMPEZA E RODA A JANELA ASSINCRONA PERSONALIZADA DE RETORNO
const btnLimpar = document.getElementById("btnLimpar");
if (btnLimpar) {
  btnLimpar.addEventListener("click", async () => {
    if (!(await confirmar("Deseja limpar o carrinho?"))) return;

    carrinho = [];
    salvarCarrinho();
    carregarCarrinho();
  });
}

// COMPILA OS DADOS TOTAIS DA COMPRA E PREPARA AS CHAVES PARA DIRECIONAR AO RECEBIMENTO
const btnPagamento = document.getElementById("btnPagamento");
if (btnPagamento) {
  btnPagamento.addEventListener("click", () => {
    let total = 0;
    carrinho.forEach((produto) => {
      total += produto.preco * produto.quantidade;
    });

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    localStorage.setItem("totalCompra", total.toFixed(2));
    window.location.href = "recebimento.html";
  });
}

// GERA O CARREGAMENTO INICIAL DAS CONTRACOES DO CARRINHO DE FORMA IMEDIATA NA ENTRADA
atualizarContador();
carregarCarrinho();

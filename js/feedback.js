// AVALIAÇÃO
let estrelasSelecionadas = 0;

// RECOLHE O IDENTIFICADOR EXCLUSIVO DO PEDIDO DIRETAMENTE DOS PARAMETROS DA URL DA PAGINA
const parametros = new URLSearchParams(window.location.search);
const idPedido = Number(parametros.get("pedido"));

// RECUPERA A BASE DE DADOS GLOBAL DE COMPRAS GRAVADA NO LOCALSTORAGE
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
const pedido = pedidos.find(p => p.id === idPedido);

// VALIDA SE O PEDIDO INFORMADO EXISTE NA BASE E EM CASO NEGATIVO EXPULSA O USUARIO PARA O HISTORICO
if (!pedido) {
    aviso("Pedido não encontrado.");
    setTimeout(() => {
        window.location.href = "meusPedidos.html";
    }, 1500);
}

// CAPTURA TODAS AS CLASSES DE CLASSIFICACAO E ADICIONA O ESCUTADOR DE CLIQUE EM CADA UMA DELAS
const estrelas = document.querySelectorAll(".estrela");
estrelas.forEach((estrela) => {
    estrela.addEventListener("click", () => {
        estrelasSelecionadas = Number(estrela.dataset.valor);
        
// MAPEIA AS ETAPAS ALTERNANDO AS ESTRELAS ENTRE PREENCHIDAS E VAZIAS CONFORME A NOTA SELECIONADA
        estrelas.forEach((e) => {
             if (Number(e.dataset.valor) <= estrelasSelecionadas) {
                e.classList.add("ativa");
                e.innerHTML = "★";
            } else {
                e.classList.remove("ativa");
                e.innerHTML = "☆";
            }
        });
    });
});

// ESCUTA O GATILHO DO BOTAO DE ENVIO PARA AGREGAR AS NOTAS E TEXTOS COMPLEMENTARES DA AVALIACAO
document.getElementById("btnEnviar").addEventListener("click", () => {

  // TRAVA DE SEGURANÇA QUE OBRIGA O CLIENTE A DECLARAR UMA NOTA EM ESTRELAS ANTES DE SEGUIR
    if (estrelasSelecionadas === 0) {
        aviso("Escolha uma quantidade de estrelas.");
        return;
    }

    // BLOQUEIO LOGICO PARA EVITAR QUE UM MESMO PEDIDO SEJA ANALISADO DUPLICADAS VEZES
    if (pedido.avaliado) {
        aviso("Este pedido já foi avaliado.");
        return;
    }
    const comentario = document
        .getElementById("comentario")
        .value
        .trim();

    // SALVA A AVALIAÇÃO NA BASE RESTRITA DE REVIEWS INTERNOS DO RESTAURANTE
    const avaliacoes =
        JSON.parse(localStorage.getItem("avaliacoesRaizes")) || [];
    avaliacoes.push({
        id: Date.now(),
        pedido: pedido.id,
        estrelas: estrelasSelecionadas,
        comentario,
        data: new Date().toLocaleString("pt-BR")
    });

    localStorage.setItem(
        "avaliacoesRaizes",
        JSON.stringify(avaliacoes)
    );

    // ALTERNA A FLAG DE COMPROLE NO PEDIDO PARA BLOQUEAR NOVOS ACESSOS DE FEEDBACK
    pedido.avaliado = true;
    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );
    
    // DISPARA A CAPSULA DE SUCESSO VISUAL DO SISTEMA E AGENDA O RETORNO DO USUARIO AO HISTORICO
    sucesso("Obrigado pela sua avaliação!");
    setTimeout(() => {
        window.location.href = "meusPedidos.html";
    }, 1200);
});

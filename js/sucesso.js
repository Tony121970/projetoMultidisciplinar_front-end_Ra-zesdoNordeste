// ESCUTA O CARREGAMENTO COMPLETO DA PÁGINA PARA RECUPERAR OS DADOS DO PEDIDO ATUAL, EXIBIR AS INFORMAÇÕES NA TELA, CALCULAR O CASHBACK E MONTAR A MENSAGEM DO WHATSAPP
document.addEventListener("DOMContentLoaded", () => {
  console.log("pedidoAtual bruto:", localStorage.getItem("pedidoAtual"));
  console.log("pedidos bruto:", localStorage.getItem("pedidos"));
  const pedidoString = localStorage.getItem("pedidoAtual");

  // INTERROMPE A OPERACAO SE A CHAVE DO PEDIDO RETORNAR VAZIA OU SE RECONHECER VALOR INDEFINIDO
  if (!pedidoString || pedidoString === "undefined") {
    erro("Pedido não encontrado.");
    return;
  }
  const pedido = JSON.parse(pedidoString);

  if (!pedido) return;
  console.log(pedido);

  // DADOS DO PEDIDO INJETADOS DIRETAMENTE NOS COMPONENTES TEXTUAIS DE EXIBICAO DO TOPO
  document.getElementById("numeroPedido").textContent = pedido.id;
  document.getElementById("statusPedido").textContent = pedido.status;

  // MAPEIA O STATUS ATUAL DO PEDIDO PARA PREENCHER VISUALMENTE A BARRA DE PROGRESSO DE ACORDO COM A ETAPA LOGÍSTICA ALCANÇADA
  function atualizarBarraStatus(status) {
    const etapas = {
      Recebido: 1,
      Preparando: 2,
      "Pronto para retirada": 3,
      "Saiu para entrega": 3,
      Entregue: 4,
    };

    const atual = etapas[status] || 1;

    // PERCORRE OS QUATRO PONTOS VISUAIS ALTERNANDO AS CLASSES ATIVAS CONFORME A ETAPA LOGISTICA
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById("etapa" + i);

      if (!el) continue;

      if (i <= atual) {
        el.classList.add("ativa");
      } else {
        el.classList.remove("ativa");
      }
    }
  }

  // DISPARA A ATUALIZACAO AUTOMATICA DOS ELEMENTOS DA BARRA LOGISTICA NO PROGRESSO VISUAL
  atualizarBarraStatus(pedido.status);

  // CASHBACK CALCULADO COM A TAXA DE DOIS POR CENTO FIXADA NA REGRA DE NEGOCIO DO SISTEMA
  const cashback = (pedido.pagamento.total * 0.02).toFixed(2);
  const cashbackEl = document.getElementById("cashback");

  if (cashbackEl) {
    cashbackEl.textContent =
      cashback.replace(".", ",") + " moedas";
  }

  // AS MOEDA ICAM LIBERADAS PARA SEREM CREDITADAS UNICAMENTE QUANDO O ATENDENTE OU ENTREGADOR CONFIRMAREM A ENTREGA FÍSICA.

  // ITENS DO PEDIDO RENDERIZADOS EM GRADE DINAMICA COM AS FOTOS E VALORES DO PRODUTO
  const lista = document.getElementById("listaPedido");
  lista.innerHTML = "";
  pedido.itens.forEach((produto) => {
    const subtotal = produto.preco * produto.quantidade;
    lista.innerHTML += `
      <div class="itemPedido">

          <img src="${produto.imagem}" alt="${produto.nome}">

          <div class="infoPedido">
              <h4>${produto.nome}</h4>
              <p>Quantidade: ${produto.quantidade}</p>
              <p>Preço Unitário: R$ ${produto.preco
                .toFixed(2)
                .replace(".", ",")}</p>
          </div>

          <div class="valorPedido">
              R$ ${subtotal.toFixed(2).replace(".", ",")}
          </div>

      </div>
    `;
  });

  // RESUMO FINANCEIRO DOS COMPONENTES E ABATIMENTOS LIQUIDADOS NA TELA DE CONCLUSAO
  document.getElementById("subtotalPedido").textContent =
    "R$ " + pedido.pagamento.subtotal.toFixed(2).replace(".", ",");

   if (pedido.tipoEntrega === "retirada") {
    document.getElementById("taxaEntregaPedido").textContent =
      "Grátis (Retirada Local)";
  } else {
    document.getElementById("taxaEntregaPedido").textContent =
      "R$ " + pedido.entrega.taxa.toFixed(2).replace(".", ",");
  }
  document.getElementById("descontoPedido").textContent =
    "- R$ " + pedido.pagamento.desconto.toFixed(2).replace(".", ",");
  document.getElementById("totalPedido").textContent =
    "R$ " + pedido.pagamento.total.toFixed(2).replace(".", ",");

  // DISPARA UMA JANELA EXTERNA DO WHATSAPP ENVIANDO O RESUMO DETALHADO DO PEDIDO FORMATA DO EM TEXTO PARA O NÚMERO DO ESTABELECIMENTO
  document.getElementById("btnWhatsapp").onclick = function () {
    let msg = "Raízes do Nordeste\n\n";
    msg += "Pedido Nº " + pedido.id + "\n";
    msg += "Status: " + pedido.status + "\n\n";
    pedido.itens.forEach((item) => {
      msg += `${item.quantidade}x ${item.nome}\n`;
    });

    msg += "\n";
    msg += "Subtotal: R$ " + pedido.pagamento.subtotal.toFixed(2) + "\n";
    msg += "Entrega: R$ " + pedido.entrega.taxa.toFixed(2) + "\n";
    msg += "Desconto: R$ " + pedido.pagamento.desconto.toFixed(2) + "\n";
    msg += "Total: R$ " + pedido.pagamento.total.toFixed(2);

    window.open(
      "https://wa.me/5581999999999?text=" + encodeURIComponent(msg),
      "_blank"
    );
  };
});

// ALTERA GLOBALMENTE O STATUS DO PEDIDO NO ARMAZENAMENTO LOCAL E MODIFICA A COR DO TEXTO DE EXIBIÇÃO EM TEMPO REAL CONFORME A NOVA FASE
window.atualizarStatusVisual = function (novoStatus) {
  const pedido = JSON.parse(localStorage.getItem("pedidoAtual"));

  if (!pedido) {
    console.log("Pedido não encontrado");
    return;
  }

  pedido.status = novoStatus;
  localStorage.setItem("pedidoAtual", JSON.stringify(pedido));
  const statusEl = document.getElementById("statusPedido");

  // ALTERNA AS CORES VISUAIS ESPECIFICAS DO ELEMENTO TEXTUAL BASEADO NA NOVA FASE LOGISTICA EXECUTADA
  if (statusEl) {
    statusEl.textContent = novoStatus;

    switch (novoStatus) {
      case "Preparando":
        statusEl.style.color = "#f1c40f";
        break;

      case "Pronto para retirada":
        statusEl.style.color = "#3498db";
        break;

      case "Saiu para entrega":
        statusEl.style.color = "#e67e22";
        break;

      case "Entregue":
        statusEl.style.color = "#2ecc71";
        break;

      default:
        statusEl.style.color = "#333";
    }
  }

  console.log("Status updated to:", novoStatus);
};

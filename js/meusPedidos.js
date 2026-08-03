// MEUSPEDIDOS
let ultimoStatus = {};

// ESCUTA O CARREGAMENTO COMPLETO DO DOCUMENTO HTML PARA DISPARAR A LOGICA INICIAL E O CRONOMETRO
document.addEventListener("DOMContentLoaded", () => {
  carregarMeusPedidos();
  
  // ATUALIZA AUTOMATICAMENTE A TELA PARA MANDAR OS STATUS DO RASTREAMENTO EM TEMPO REAL
  setInterval(carregarMeusPedidos, 3000);
});

// FILTRA E EXIBE EM TEMPO REAL O HISTÓRICO DE COMPRAS E O RASTREAMENTO DO CLIENTE LOGADO
function carregarMeusPedidos() {
  const lista = document.getElementById("listaMeusPedidos");

  if (!lista) return;
  
  // RECUPERA OS DADOS DA SESSAO DO USUARIO LOGADO NA INTERFACE DO CLIENTE
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario) return; 
  const todosPedidos = buscarPedidos();
  
  // FILTRA APENAS OS PEDIDOS CUJO EMAIL CONDIZA COM O USUARIO DA SESSÃO ATIVA
  const pedidos = todosPedidos.filter(
    (pedido) => pedido.clienteEmail === usuario.email
  );
  lista.innerHTML = "";

  // TRATAMENTO VISUAL SEGURO CASO A COMPILAÇÃO RETORNE ZERO PEDIDOS PARA O CLIENTE
  if (pedidos.length === 0) {
    const semPedidosMsg = document.getElementById("semPedidos");
    if (semPedidosMsg) {
      semPedidosMsg.style.display = "block";
    } else {
      lista.innerHTML = "<p style='text-align:center; width:100%; grid-column: 1/-1;'>Você ainda não realizou nenhum pedido.</p>";
    }
    return;
  } else {
    const semPedidosMsg = document.getElementById("semPedidos");
    if (semPedidosMsg) semPedidosMsg.style.display = "none";
  }

  // PERCORRE A FILA ANALISANDO SE HOUVE MUDANÇA DE ESTADO PARA DISPARAR OS ALERTAS
  pedidos.forEach((pedido) => {
    if (ultimoStatus[pedido.id] && ultimoStatus[pedido.id] !== pedido.status) {
      mostrarAlerta(pedido.status);
    }

    ultimoStatus[pedido.id] = pedido.status;
    let cor = "#999";

    // ESTABELECE A COR DE DESTAQUE LATERAL DO CARD BASEADO NO STATUS ATUAL DO PEDIDO
    switch (pedido.status) {
      case "Recebido":
        cor = "#ff9800";
        break;
      case "Preparando":
        cor = "#2196f3";
        break;
      case "Pronto para retirada":
        cor = "#4caf50";
        break;
      case "Saiu para entrega":
        cor = "#9c27b0";
        break;
      case "Entregue":
        cor = "#2e7d32";
        break;
      case "Cancelado":
        cor = "#d32f2f";
        break;
    }

    let itens = "";
    pedido.itens.forEach((item) => {
      itens += `<li>${item.quantidade}x ${item.nome}</li>`;
    });

    // MAPEAMENTO EXATO E NORMALIZAÇÃO COMPORTAMENTAL DO TIPO DE TRANSPORTE
    const tipoEntregaNormalizado = pedido.tipoEntrega ? pedido.tipoEntrega.toLowerCase() : "";

    // INJETA O CODIGO HTML DINAMICO EXIBINDO OS CARDS, PROGRESSO E CONTROLES DE AVALIAÇÃO
    lista.innerHTML += `
        <div class="card-pedido" style="border-left:8px solid ${cor};">
            <h3>Pedido #${pedido.id}</h3>

            <p><strong>Data/Hora:</strong> ${pedido.data || "-"}</p>
            <p><strong>Cliente:</strong> ${pedido.nomeCliente || usuario.nome || "-"}</p>
            <p><strong>Status:</strong> ${pedido.status}</p>
            <p><strong>Entrega:</strong> ${pedido.tipoEntrega || "-"}</p>
            <p><strong>Pagamento:</strong> ${pedido.pagamento?.forma || "Não informado"}</p>
            
            <p><strong>Itens:</strong></p>
            <ul style="list-style-type: none; padding-left: 0; margin: 8px 0;">
                ${itens}
            </ul>
            
            <h4>
                Total: R$ ${(pedido.pagamento?.total || 0).toFixed(2).replace(".", ",")}
            </h4>

            ${
              pedido.status === "Cancelado"
                ? `<div class="cancelado">Pedido cancelado</div>`
                : `
                  <div class="progresso">
                      ${criarEtapa("Recebido", pedido.status, tipoEntregaNormalizado)}
                      ${criarEtapa("Preparando", pedido.status, tipoEntregaNormalizado)}
                      ${
                        tipoEntregaNormalizado === "entrega"
                          ? criarEtapa("Saiu para entrega", pedido.status, tipoEntregaNormalizado)
                          : criarEtapa("Pronto para retirada", pedido.status, tipoEntregaNormalizado)
                      }
                      ${criarEtapa("Entregue", pedido.status, tipoEntregaNormalizado)}
                  </div>
                  ${
                    pedido.status === "Entregue"
                    ? (
                        pedido.avaliado
                        ? `
                            <div class="pedido-avaliado">
                                ✔ Obrigado pela sua avaliação!
                            </div>
                        `
                        : `
                            <button
                                class="btn-avaliar"
                                onclick="avaliarPedido(${pedido.id})">
                                ⭐ Avaliar este pedido
                            </button>
                        `
                    )
                    : ""
                }
                  `
            }
        </div>
    `;
  });
}

// RETORNA AS TAGS VISUAIS COM AS CLASSES DE PROGRESSO COM BASE NA ETAPA ATUAL DO PEDIDO
function criarEtapa(etapa, statusAtual, tipoEntrega) {
  const ordem = [
    "Recebido",
    "Preparando",
    tipoEntrega === "entrega" ? "Saiu para entrega" : "Pronto para retirada",
    "Entregue",
  ];

  const atual = ordem.indexOf(statusAtual);
  const pos = ordem.indexOf(etapa);
  let classe = "pendente";

  // MAQUINA DE ESTADOS VISUAL QUE DEFINE SE A CAPSULA CONTA COMO OK, ATUAL OU PENDENTE
  if (atual === -1) {
    if (statusAtual === "Pronto para retirada" && etapa === "Pronto para retirada") classe = "atual";
    if (statusAtual === "Saiu para entrega" && etapa === "Saiu para entrega") classe = "atual";
  } else if (pos < atual) {
    classe = "ok";
  } else if (pos === atual) {
    classe = "atual";
  }
  
  // ABREVIA TEXTOS MAIORES PARA GARANTIR PERFEITO ACESSO E EQUIVALENCIA VISUAL NO MOBILE
  let nomeExibicao = etapa;
  if (etapa === "Saiu para entrega") nomeExibicao = "Saiu p/ Ent.";
  if (etapa === "Pronto para retirada") nomeExibicao = "Pronto p/ Ret.";

  return `
        <div class="etapa ${classe}">
            ${nomeExibicao}
        </div>
    `;
}

// DISPARA UM TOAST INFORMATIVO CONFORME A MUDANÇA DE ESTADO DETECTADA NO COMPORTAMENTO DO PEDIDO
function mostrarAlerta(status) {
  const alerta = document.createElement("div");
  alerta.className = "alerta";
  alerta.innerHTML = `Status updated para <strong>${status}</strong>`;
  document.body.appendChild(alerta);
  
  // DESTROI O OBJETO DO DOM APOS ROLAR O CRONOMETRO DE EXIBIÇÃO NA INTERFACE
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

// ENCAMINHA O CLIENTE PARA A INTERFACE RESTRITA DE REVIEWS PASSANDO O ID VIA URL
function avaliarPedido(id) {
  window.location.href = `feedback.html?pedido=${id}`;
}

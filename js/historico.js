// ESCUTA O CARREGAMENTO COMPLETO DO DOCUMENTO HTML PARA DISPARAR A LOGICA INICIAL E O CRONOMETRO
document.addEventListener("DOMContentLoaded", () => {
  carregarHistorico();
  
  // ATUALIZA AUTOMATICAMENTE A TELA PARA MANTER OS DADOS EXIBIDOS SEMPRE ATUALIZADOS
  setInterval(carregarHistorico, 3000);
});

// RECUPERA E RENDERIZA OS PEDIDOS CONCLUÍDOS OU CANCELADOS DIRETAMENTE NO PAINEL DE HISTÓRICO
function carregarHistorico() {
  const lista = document.getElementById("listaHistorico");

  if (!lista) return;
  
  // RECOLHE A BASE DE DADOS COMPLETA DE PEDIDOS SALVA NO NAVEGADOR
  const pedidos = buscarPedidos();
  lista.innerHTML = "";
  
  // FILTRA APENAS OS REGISTROS QUE JA ATINGIRAM AS ETAPAS FINAIS DO FLUXO OPERACIONAL
  const historico = pedidos.filter(
    (p) => p.status === "Entregue" || p.status === "Cancelado"
  );

  // TRATAMENTO DE INTERFACE PARA CENARIOS ONDE NAO EXISTEM ITENS ARQUIVADOS
  if (historico.length === 0) {
       lista.innerHTML = "<p class='semPedidos'>Nenhum pedido finalizado.</p>";
    return;
  }

  // PERCORRE A FILA DE ITENS AJUSTANDO AS CORES VISUAIS DE ACORDO COM O SINAL DE SUCESSO OU ERRO
  historico.forEach((pedido) => {
    let cor = "#999";

    if (pedido.status === "Entregue") {
      cor = "#28a745";
    }

    if (pedido.status === "Cancelado") {
      cor = "#dc3545";
    }
    
    let itens = "";
    
    // CONCATENA AS STRINGS MONTANDO A LISTAGEM RECURSIVA DE PRODUTOS COMPRADOS
    if (pedido.itens) {
      pedido.itens.forEach((item) => {
        itens += `<li>${item.quantidade}x ${item.nome}</li>`;
      });
    }

    // BUSCA DE FORMA SEGURA A PROPRIEDADE CONTENDO A FORMALIZAÇÃO DO PAGAMENTO
    const formaPagamento = pedido.pagamento && pedido.pagamento.forma
        ? pedido.pagamento.forma
        : (pedido.tipoPagamento || "-");

    // CORREÇÃO SEGURA DO CEP LOCAL RECORRENDO AS CHAVES SECUNDARIAS CASO NECESSARIO
    const cepTexto = pedido.cep || localStorage.getItem("cep") || "Não informado";

    // INJETA O CODIGO HTML DINAMICO DOS CARDS COMPORTANDO AS METRICAS DE ARQUIVAMENTO DO PEDIDO
    lista.innerHTML += `
    <div class="card" style="border-left:8px solid ${cor};">
        <h3>Pedido #${pedido.id}</h3>
        <p><strong>Data/Hora:</strong> ${pedido.data || "-"}</p>
        <p><strong>Cliente:</strong> ${pedido.cliente || pedido.nomeCliente || "-"}</p>
        <p><strong>Telefone:</strong> ${pedido.telefone || "-"}</p>
        <p><strong>Endereço:</strong> ${pedido.endereco || pedido.enderecoCliente || "-"}</p>
        <p><strong>CEP:</strong> ${cepTexto}</p>
        <p><strong>Entrega:</strong> ${pedido.tipoEntrega || "-"}</p>
        <p><strong>Pagamento:</strong> ${formaPagamento}</p>
        
        <ul style="list-style-type: none; padding-left: 0;">
            ${itens}
        </ul>
        
        <h1><strong>Total:</strong> R$ ${(pedido.pagamento?.total || pedido.total || 0).toFixed(2).replace(".", ",")}</h1>
        <p><strong>Status:</strong> <span class="status ${pedido.status.toLowerCase()}">${pedido.status}</span></p>
    </div>
    `;
  });
}

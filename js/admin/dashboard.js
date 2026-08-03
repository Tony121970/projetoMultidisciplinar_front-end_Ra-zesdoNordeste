  // ESCUTA O CARREGAMENTO COMPLETO DO DOCUMENTO HTML PARA VALIDAR O ACESSO ADM OU GERÊNCIA
document.addEventListener("DOMContentLoaded", () => {

    // RECUPERA OS STATUS DE LOGIN DAS DUAS ORIGENS POSSÍVEIS
    const isAdmin = localStorage.getItem("adminLogado") === "true";
    const isColab = localStorage.getItem("colaboradorLogado") === "true";
    const setor = localStorage.getItem("setorLogado");

    // VALIDAÇÃO DE SEGURANÇA: PERMITE A ENTRADA SE FOR ADMIN OU SE FOR COLABORADOR DO SETOR "GERENCIA"
    if (!isAdmin && !(isColab && setor === "gerencia")) {
        // SE NÃO FOR NENHUM DOS DOIS, LIMPA O QUE HOUVER E MANDA PARA O LOGIN GERAL
        window.location.href = "login.html";
        return;
    }
  
    // DISPARA A FUNÇAO DE CORRELAÇAO DE DADOS GERENCIAIS DO PAINEL
    carregarDashboard();
});

  // FUNÇAO PRINCIPAL RESPONSAVEL POR COLETAR OS PEDIDOS E CALCULAR AS METRICAS FINANCEIRAS
  function carregarDashboard() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    let totalPedidos = pedidos.length;
    let faturamento = 0;
    let cancelamentos = 0;
    const produtosVendidos = {};
    
    // PERCORRE O ARRAY DE REGISTROS PARA CALCULAR OS MONTANTES DO PAINEL
    pedidos.forEach(pedido => {
        // SOMA O FATURAMENTO CONVERTENDO O VALOR PARA NUMERO COM TRAVA DE SEGURANÇA
        faturamento += Number(pedido.pagamento?.total || 0);
  
        // INCREMENTA O CONTADOR EXCLUSIVO DE REGISTROS CANCELADOS NO SISTEMA
        if (pedido.status === "Cancelado") {
            cancelamentos++;
        }
  
        // MAPEIA E CONTABILIZA A QUANTIDADE INDIVIDUAL DE CADA MERCADORIA VENDIDA
        if (pedido.itens) {
  
            pedido.itens.forEach(item => {
  
                if (!produtosVendidos[item.nome]) {
                    produtosVendidos[item.nome] = 0;
                }
  
                produtosVendidos[item.nome] += Number(item.quantidade);
            });
        }
    });
  
    // REALIZA O CALCULO DO TICKET MEDIO BASEADO NO MONTANTE DE PEDIDOS CONFIRMADOS
    let ticketMedio = 0;
  
    if (totalPedidos > 0) {
        ticketMedio = faturamento / totalPedidos;
    }
  
    // BUSCA DENTRO DO OBJETO DE PRODUTOS PARA APONTAR A MERCADORIA COM MAIOR NUMERO DE VENDAS
    let produtoMaisVendido = "Nenhum";
  
    let maiorQuantidade = 0;
  
    for (const produto in produtosVendidos) {
  
        if (produtosVendidos[produto] > maiorQuantidade) {
  
            maiorQuantidade = produtosVendidos[produto];
            produtoMaisVendido = produto;
        }
    }
  
    // ESTRUTURA O AGRUPAMENTO DE CONSUMO PARA APONTAR O CLIENTE MAIS ATIVO NO SISTEMA
    const clientes = {};
    pedidos.forEach(pedido => {
        const nomeCliente = pedido.cliente || "Cliente";
  
        if (!clientes[nomeCliente]) {
            clientes[nomeCliente] = 0;
        }
        clientes[nomeCliente]++;
    });
  
    let clienteDestaque = "Nenhum";
    let maiorNumeroPedidosCliente = 0;
  
    for (const cliente in clientes) {
  
        if (clientes[cliente] > maiorNumeroPedidosCliente) {
            maiorNumeroPedidosCliente = clientes[cliente];
            clienteDestaque = cliente;
        }
    }
  
    // RECUPERA O ITEM FINAL DO ARRAY DE COMPRAS PARA CONSTITUIR O ULTIMO PEDIDO REALIZADO
    let ultimoPedido = "Nenhum";
  
    if (pedidos.length > 0) {
        const ultimo = pedidos[pedidos.length - 1];
        ultimoPedido = `
            Pedido #${ultimo.id}<br>
            ${ultimo.data || "Sem data"}
        `;
    }
  
    // INJETA OS RESULTADOS COMPUTADOS DIRETAMENTE NOS COMPONENTES TEXTUAIS DA INTERFACE
    document.getElementById("totalPedidos").textContent = totalPedidos;
    document.getElementById("faturamento").textContent =
        "R$ " + faturamento.toFixed(2).replace(".", ",");
    document.getElementById("ticketMedio").textContent =
        "R$ " + ticketMedio.toFixed(2).replace(".", ",");
    document.getElementById("cancelamentos").textContent =
        cancelamentos;
    document.getElementById("produtoMaisVendido").textContent =
        produtoMaisVendido;
        
    // COMPUTA DINAMICAMENTE A QUANTIDADE DE PEDIDOS SEPARADOS POR ETAPAS LOGISTICAS
    document.getElementById("statusPedidos").innerHTML = `
        Recebidos: ${pedidos.filter(p => p.status === "Recebido").length}<br>
        Preparando: ${pedidos.filter(p => p.status === "Preparando").length}<br>
        Entrega: ${pedidos.filter(p => p.status === "Saiu para entrega").length}<br>
        Entregues: ${pedidos.filter(p => p.status === "Entregue").length}
    `;
  
    // EXIBE AS METRICAS E DADOS DO CLIENTE DESTAQUE NA TELA
    document.getElementById("clienteDestaque").innerHTML = `
        <strong>${clienteDestaque}</strong><br>
        ${maiorNumeroPedidosCliente} pedidos
    `;
  
    // EXIBE O IDENTIFICADOR E DATA DO ULTIMO ACESSO DE PEDIDO
    document.getElementById("ultimoPedido").innerHTML = ultimoPedido;
  
    // CORREÇAO DE ESCOPO: MOVIDO OS CONSOLE LOGS PARA DENTRO DA FUNÇAO PARA EVITAR TRAVAMENTO DO SCRIPT
    console.log("Cliente destaque:", clienteDestaque);
    console.log("Último pedido:", ultimoPedido);
  }
  
  // REMOVE AS CREDENCIAIS DE ADMINISTRADOR DA MEMORIA DO NAVEGADOR E RETORNA A TELA DE LOGIN
  function sair() {
    localStorage.removeItem("adminLogado");
    window.location.href = "login.html";
  }
  
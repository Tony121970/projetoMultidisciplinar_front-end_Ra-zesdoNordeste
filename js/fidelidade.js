// CLUBE RAÍZES
document.addEventListener("DOMContentLoaded", () => {
  // Pega o e-mail do cliente logado na sessão atual para a tela do Clube do Cliente
  const emailLogado = localStorage.getItem("emailClienteLogado") || "";
  carregarSaldo(emailLogado);
  carregarHistorico(emailLogado);
});

// CARREGA O SALDO ISOLADO POR EMAIL
function carregarSaldo(emailCliente) {
  if (!emailCliente) return;
  
  // ALTERAÇÃO: Usa o email do cliente como ID único na chave do localStorage
  const chaveSaldo = `moedasRaizes_${emailCliente.trim().toLowerCase()}`;
  let saldo = localStorage.getItem(chaveSaldo);
  
  // INICIALIZA A CHAVE COM VALOR ZERO CASO NAO EXISTA REGISTRO NO NAVEGADOR
  if (saldo === null) {
    saldo = 0;
    localStorage.setItem(chaveSaldo, saldo);
  }
  const saldoEl = document.getElementById("saldoMoedas");

  // FORMATA COM DUAS CASAS DECIMAIS E ATUALIZA O COMPONENTE TEXTUAL NA INTERFACE
  if (saldoEl) {
    saldoEl.textContent = Number(saldo).toFixed(2).replace(".", ",");
  }
}

// RECUPERA E RENDERIZA O EXTRATO DE ENTRADAS E SAIDAS DE CRÉDITOS ISOLADO POR EMAIL
function carregarHistorico(emailCliente) {
  const lista = document.getElementById("listaMovimentos");

  if (!lista) return;
  
  // ALTERAÇÃO: Busca o histórico específico deste e-mail
  const historico = buscarHistoricoMoedas(emailCliente);

  // TRATAMENTO VISUAL SEGURO CASO NAO EXISTA NENHUMA MOVIMENTACAO SALVA
  if (historico.length === 0) {
    lista.innerHTML = `
            <p class="vazio">
                Ainda não existem movimentações.
            </p>
        `;

    return;
  }
  lista.innerHTML = "";
  
  // CRIA UMA COPIA DO EXTRATO E INVERTE A ORDEM PARA EXIBIR OS LANÇAMENTOS RECENTES NO TOPO
  historico
    .slice()
    .reverse()
    .forEach((item) => {
      // INJETA O CODIGO HTML DINAMICO DOS LANÇAMENTOS COM CORES BASEADAS EM VALORES POSITIVOS OU NEGATIVOS
      lista.innerHTML += `

            <div class="movimento">

                <strong>${item.data}</strong><br>

                ${item.descricao || item.tipo}<br>

                <span style="
                    color:${(item.valor ?? item.moedas) >= 0 ? "green" : "red"};
                    font-weight:bold">
                    ${(item.valor ?? item.moedas) >= 0 ? "+" : ""}
                    R$ ${Math.abs(Number(item.valor ?? item.moedas))
                      .toFixed(2)
                      .replace(".", ",")}
                </span>

            </div>

            <hr>

        `;
    });
}


// GARANTE QUE OS PAINÉIS (ATENDENTE/ENTREGA) RODEM A FUNÇÃO 
function adicionarMoedasFidelidade(emailCliente, valorPedido) {
  // Encaminha direto para a função real de cálculo
  adicionarMoedas(emailCliente, valorPedido);
}

// ADICIONA MOEDAS (2%) NA CONTA DO EMAIL INFORMADO (DIRETO NO STORAGE)
function adicionarMoedas(emailCliente, valorPago) {
  if (!emailCliente) {
    console.warn("Aviso: Tentativa de adicionar moedas sem informar o e-mail do cliente.");
    return;
  }

  // CHAVE DINÂMICA EXCLUSIVA BASEADA NO EMAIL DO CLIENTE
  const chaveSaldo = `moedasRaizes_${emailCliente.trim().toLowerCase()}`;
  let saldo = Number(localStorage.getItem(chaveSaldo)) || 0;
  
  // COMPUTA OCASHBACK DE 2% DO VALOR DA COMPRA
  const cashback = valorPago * 0.02;
  saldo += cashback;
  
  // SALVA O NOVO SALDO ISOLADO DIRETAMENTE NA RAIZ DO NAVEGADOR
  localStorage.setItem(chaveSaldo, saldo.toFixed(2));
  console.log(`Sucesso! +${cashback.toFixed(2)} moedas adicionadas para a conta: ${emailCliente}`);

  // REGISTRA A MOVIMENTAÇÃO NO EXTRATO DO CLIENTE
  registrarMovimentacao(emailCliente, "Compra", valorPago, cashback);
}

// UTILIZA MOEDAS DA CONTA DO EMAIL INFORMADO
function usarMoedas(emailCliente, valorCompra) {
  if (!emailCliente) return 0;

  // CHAVE DINÂMICA BASEADA NO EMAIL DO CLIENTE no e-mail do cliente
  const chaveSaldo = `moedasRaizes_${emailCliente.trim().toLowerCase()}`;
  let saldo = Number(localStorage.getItem(chaveSaldo)) || 0;
  
  // BUSCA ATRAVES DO COMANDO MATH MIN O MENOR VALOR POSSIVEL PARA ABATIMENTO NO TOTAL DO PEDIDO
  let desconto = Math.min(saldo, valorCompra);
  saldo -= desconto;
  localStorage.setItem(chaveSaldo, saldo.toFixed(2));
  
  // COMPILA O OBJETO DO EXTRATO DE DEBITO COM SINAL NEGATIVO E REGISTRA NA MEMORIA DO COMPILADOR
  let historico = buscarHistoricoMoedas(emailCliente);
  historico.push({
    data: new Date().toLocaleDateString("pt-BR"),
    tipo: "Resgate",
    descricao: "Desconto utilizado",
    valor: -desconto,
    saldo: saldo.toFixed(2),
  });

  salvarHistoricoMoedas(emailCliente, historico);

  return desconto;
}

// CONSULTA QUANTAS MOEDAS PODE USAR SEM ALTERAR O SALDO (ISOLADO POR EMAIL)
function consultarMoedas(emailCliente, valorCompra) {
  if (!emailCliente) return 0;
  
  const chaveSaldo = `moedasRaizes_${emailCliente.trim().toLowerCase()}`;
  let saldo = Number(localStorage.getItem(chaveSaldo)) || 0;

  // COMPARA RECURSIVAMENTE RETORNANDO O LIMITE DE ABATIMENTO DA COMPRA
  return Math.min(saldo, valorCompra);
}

// BUSCAR HISTÓRICO POR EMAIL
function buscarHistoricoMoedas(emailCliente) {
  if (!emailCliente) return [];
  const chaveHistorico = `historicoMoedas_${emailCliente.trim().toLowerCase()}`;
  return JSON.parse(localStorage.getItem(chaveHistorico)) || [];
}

// SALVAR HISTÓRICO POR EMAIL
function salvarHistoricoMoedas(emailCliente, lista) {
  if (!emailCliente) return;
  const chaveHistorico = `historicoMoedas_${emailCliente.trim().toLowerCase()}`;
  localStorage.setItem(chaveHistorico, JSON.stringify(lista));
}

// REGISTRAR MOVIMENTAÇÃO POR EMAIL
function registrarMovimentacao(emailCliente, tipo, valorCompra, moedas) {
  if (!emailCliente) return;

  let historico = buscarHistoricoMoedas(emailCliente);
  const chaveSaldo = `moedasRaizes_${emailCliente.trim().toLowerCase()}`;
  let saldo = Number(localStorage.getItem(chaveSaldo)) || 0;
  
  // ADICIONA NO INICIO DO ARRAY COM DATA E HORA FORMATADOS DO BRASIL
  historico.unshift({
    data: new Date().toLocaleString("pt-BR"),
    tipo: tipo,
    valorCompra: valorCompra,
    moedas: moedas,
    saldo: saldo.toFixed(2),
  });

  salvarHistoricoMoedas(emailCliente, historico);
}

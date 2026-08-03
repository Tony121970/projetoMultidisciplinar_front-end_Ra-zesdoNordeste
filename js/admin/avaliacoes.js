// ESCUTA O CARREGAMENTO COMPLETO DO DOCUMENTO HTML PARA DISPARAR A LOGICA INICIAL
document.addEventListener("DOMContentLoaded", () => {
  carregarAvaliacoes();
});

// FUNÇAO RESPONSAVEL POR COLETAR OS DADOS DO LOCALSTORAGE E MONTAR A LISTAGEM NA TELA
function carregarAvaliacoes() {
  const lista = document.getElementById("listaAvaliacoes");

  // BUSCA OS DADOS ARMAZENADOS OU CRIA UM ARRAY VAZIO CASO NAO EXISTAM REGISTROS
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoesRaizes")) || [];

  lista.innerHTML = "";

  // ATUALIZA O PAINEL DE RESUMO METRICO PASSANDO O ARRAY DE DADOS
  atualizarResumo(avaliacoes);

  // TRATAMENTO EXCLUSIVO PARA CENARIOS ONDE NAO EXISTEM AVALIAÇOES REGISTRADAS
  if (avaliacoes.length === 0) {
    lista.innerHTML = `
      <h2 style="text-align:center; grid-column:1/-1;">
        Nenhuma avaliação encontrada.
      </h2>
    `;
    return;
  }

  // CRIA UMA COPIA DO ARRAY E INVERTE A ORDEM PARA EXIBIR OS REGISTROS RECENTES NO TOPO
  [...avaliacoes].reverse().forEach((avaliacao) => {
    let estrelas = "";

    // LAÇO DE REPETIÇAO PARA MONTAR A QUANTIDADE VISUAL DE ICONES DE ESTRELA DO CARD
    for (let i = 0; i < avaliacao.estrelas; i++) {
      estrelas += "⭐";
    }

    // INJETA O CODIGO HTML DO CARD DE AVALIAÇAO DINAMICAMENTE NO CONTAINER
    lista.innerHTML += `
      <div class="card-avaliacao">

        <div class="estrelas">
          ${estrelas}
        </div>

        <p>
          <strong>Pedido:</strong>
          #${avaliacao.pedido}
        </p>

        <p>
          <strong>Comentário:</strong>
          ${avaliacao.comentario || "Sem comentário."}
        </p>

        <p>
          <strong>Data:</strong>
          ${avaliacao.data}
        </p>

        <button
          class="excluir"
          onclick="excluir(${avaliacao.id})">

          Excluir

        </button>

      </div>
    `;
  });
}

// FUNÇAO RESPONSAVEL POR CALCULAR A MEDIA DAS NOTAS E DISTRIBUIR A QUANTIDADE POR CATEGORIA
function atualizarResumo(avaliacoes) {
  const media = document.getElementById("mediaAvaliacoes");
  const total = document.getElementById("totalAvaliacoes");
  const nota5 = document.getElementById("nota5");
  const nota4 = document.getElementById("nota4");
  const nota3 = document.getElementById("nota3");
  const nota2 = document.getElementById("nota2");
  const nota1 = document.getElementById("nota1");

  // SE O ELEMENTO DE MEDIA NAO EXISTIR NA PAGINA ENCERRA A EXECUÇAO DA FUNÇAO
  if (!media) return;
  total.textContent = avaliacoes.length;

  // ZERA TODOS OS CONTADORES VISUAIS CASO A LISTA ESTEJA TOTALMENTE VAZIA
  if (avaliacoes.length === 0) {
    media.textContent = "0,0";
    nota5.textContent = 0;
    nota4.textContent = 0;
    nota3.textContent = 0;
    nota2.textContent = 0;
    nota1.textContent = 0;
    return;
  }
  
  let soma = 0;
  let q1 = 0;
  let q2 = 0;
  let q3 = 0;
  let q4 = 0;
  let q5 = 0;

  // PERCORRE O ARRAY DE AVALIAÇOES COMPUTANDO AS SOMAS E DISTRIBUINDO NOS CONTADORES VIA SWITCH
  avaliacoes.forEach((avaliacao) => {
    const nota = Number(avaliacao.estrelas);
    soma += nota;

    switch (nota) {
      case 1:
        q1++;
        break;

      case 2:
        q2++;
        break;

      case 3:
        q3++;
        break;

      case 4:
        q4++;
        break;

      case 5:
        q5++;
        break;
    }
  });

  // FORMATACAO DA MEDIA COM UMA CASA DECIMAL E SUBSTITUIÇAO DE PONTO POR VIRGULA
  media.textContent = (soma / avaliacoes.length).toFixed(1).replace(".", ",");
  nota1.textContent = q1;
  nota2.textContent = q2;
  nota3.textContent = q3;
  nota4.textContent = q4;
  nota5.textContent = q5;
}

// FUNÇAO RESPONSAVEL POR REMOVER UMA AVALIAÇAO DO LOCALSTORAGE BASEADO NO SEU ID EXCLUSIVO
function excluir(id) {
  // EXIBE MODAL DE CONFIRMAÇAO INTEGRADO E RETORNA UMA PROMISE PARA VALIDAR A DECISAO
  confirmar("Deseja excluir esta avaliação?").then((confirmou) => {
    if (!confirmou) return;
    
    // FILTRA O ARRAY RETIRANDO O ITEM EXCLUIDO E ATUALIZA A BASE DE DADOS DO LOCALSTORAGE
    let lista = JSON.parse(localStorage.getItem("avaliacoesRaizes")) || [];
    lista = lista.filter((avaliacao) => avaliacao.id !== id);
    localStorage.setItem("avaliacoesRaizes", JSON.stringify(lista));
    
    // DISPARA ALERTA VISUAL DE SUCESSO E SOLICITA O RECARREGAMENTO DO PAINEL NA TELA
    sucesso("Avaliação excluída com sucesso.");
    carregarAvaliacoes();
  });
}

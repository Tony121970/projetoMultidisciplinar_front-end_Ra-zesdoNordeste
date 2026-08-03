// ESTOQUE DB
const CHAVE_ESTOQUE = "estoqueRaizes";

// CRIA E ARMAZENA UMA LISTA PADRÃO DE INSUMOS NO LOCALSTORAGE CASO O ESTOQUE ESTEJA VAZIO
function iniciarEstoque() {
  // INTERROMPE A OPERAÇÃO CASO A CHAVE CENTRAL JA EXISTA GRAVADA NO NAVEGADOR
  if (localStorage.getItem(CHAVE_ESTOQUE)) {
    return;
  }

  // DECLARAÇÃO DO ARRAY CONTENDO A CARGA INICIAL DE INGREDIENTES PARA ALIMENTAR O PROGRAMA
  const estoqueInicial = [
    {
      id: 1,
      nome: "Goma de Tapioca",
      categoria: "Massas",
      quantidade: 20,
      unidade: "kg",
      minimo: 5,
    },

    {
      id: 2,
      nome: "Carne de Sol",
      categoria: "Carnes",
      quantidade: 8,
      unidade: "kg",
      minimo: 3,
    },

    {
      id: 3,
      nome: "Queijo Coalho",
      categoria: "Laticínios",
      quantidade: 5,
      unidade: "kg",
      minimo: 2,
    },
  ];

  // ENVIA O AGRUPAMENTO PARA A GRAVACAO INICIAL DO SISTEMA
  salvarEstoque(estoqueInicial);
}

// RECUPERA E CONVERTE EM ARRAY TODA A LISTA DE INSUMOS CADASTRADOS NO LOCALSTORAGE
function buscarEstoque() {
  return JSON.parse(localStorage.getItem(CHAVE_ESTOQUE)) || [];
}

// CONVERTE A LISTA DE INSUMOS FORNECIDA EM STRING E A ATUALIZA DIRETAMENTE NO LOCALSTORAGE
function salvarEstoque(lista) {
  localStorage.setItem(CHAVE_ESTOQUE, JSON.stringify(lista));
}

// ENCONTRA O MAIOR IDENTIFICADOR NUMÉRICO EXISTENTE NA LISTA E ADICIONA MAIS UM
function gerarId() {
  const lista = buscarEstoque();

  // RETORNA O IDENTIFICADOR ZERO MAIS UM SE A BASE DE DADOS ESTIVER TOTALMENTE ZERADA
  if (lista.length === 0) {
    return 1;
  }

  // EXTRAI O VALOR MAXIMO ATRAVES DO COMANDO MATH MAP COMBINADO COM OPERADOR SPREAD
  return Math.max(...lista.map((item) => item.id)) + 1;
}

// VINCULA UM NOVO IDENTIFICADOR ÚNICO AO INSUMO E O INSERE DEFINITIVAMENTE NO REGISTRO
function adicionarEstoque(item) {
  const lista = buscarEstoque();
  item.id = gerarId();
  lista.push(item);
  salvarEstoque(lista);
}

// LOCALIZA E RETORNA UM OBJETO ESPECÍFICO DE INSUMO ATRAVÉS DO SEU NÚMERO DE IDENTIFICAÇÃO
function buscarPorId(id) {
  return buscarEstoque().find((item) => item.id == id);
}

// PERCORRE O REGISTRO DO ESTOQUE, ENCONTRA O ITEM MODIFICADO E SUBSTITUI SEUS DADOS ANTIGOS
function atualizarEstoque(item) {
  let lista = buscarEstoque();
  
  // RODA UM MAPEAMENTO SUBSTITUINDO EXCLUSIVAMENTE OS DADOS DA MERCADORIA EDITADA
  lista = lista.map((produto) => {
    if (produto.id == item.id) {
      return item;
    }

    return produto;
  });

  salvarEstoque(lista);
}

// FILTRA A LISTA DO LOCALSTORAGE REMOVENDO DEFINITIVAMENTE O REGISTRO DO INSUMO INFORMADO
function removerEstoque(id) {
  let lista = buscarEstoque();
  
  // EXCLUI O ELEMENTO DO ARRAY COM FILTRO DE COMPORTAMENTO RESTRITO DO IDENTIFICADOR
  lista = lista.filter((item) => item.id != id);
  salvarEstoque(lista);
}

// FILTRA OS INSUMOS DO ESTOQUE QUE CONTENHAM O TERMO DIGITADO NO NOME OU NA CATEGORIA
function pesquisarEstoque(texto) {
  texto = texto.toLowerCase();

  // COMPARA RECURSIVAMENTE CONTRA AS PROPRIEDADES DE TEXTO DA BASE DE DADOS DO OPERADOR
  return buscarEstoque().filter((item) => {
    return (
      item.nome.toLowerCase().includes(texto) ||
      item.categoria.toLowerCase().includes(texto)
    );
  });
}

// ANALISA A QUANTIDADE ATUAL DO ITEM COMPARANDO-O COM O MÍNIMO E RETORNA SUAS TAGS VISUAIS
function statusEstoque(item) {
  // CONFIGURA EMBALAGEM VERMELHA SE O VOLUME CONTA TOTALMENTE ZERADO
  if (item.quantidade <= 0) {
    return {
      texto: "🔴 Sem estoque",
      classe: "esgotado",
    };
  }

  // CONFIGURA EMBALAGEM AMARELA CASO O MONTANTE CONDIZA COM ALERTA ABAIXO DA META CRITICA
  if (item.quantidade <= item.minimo) {
    return {
      texto: "🟡 Estoque baixo",
      classe: "baixo",
    };
  }

  // RETORNA EMBALAGEM VERDE SE O INGREDIENTE ESTIVER COM VOLUME SEGURO DE CONSUMO
  return {
    texto: "🟢 Disponível",
    classe: "normal",
  };
}

// CONTABILIZA A QUANTIDADE DE PRODUTOS CADASTRADOS, ITENS ESGOTADOS E EM ALERTA CRÍTICO
function resumoEstoque() {
  const lista = buscarEstoque();
  let baixo = 0;
  let zero = 0;
  
  // PERCORRE A BASE INCREMENTANDO OS CONTADORES EXCLUSIVOS DE VOLUMES E ALERTAS RESTRITOS
  lista.forEach((item) => {
    if (item.quantidade <= 0) {
      zero++;
    } else if (item.quantidade <= item.minimo) {
      baixo++;
    }
  });

  return {
    total: lista.length,
    baixo: baixo,
    zero: zero,
  };
}

// DISPARA O COMPORTAMENTO DE ALIMENTACAO DO SISTEMA IMEDIATAMENTE NA INICIALIZACAO DO SCRIPT
iniciarEstoque();

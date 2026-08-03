// BASE DE DADOS SIMULADA COMPORTANDO A LISTAGEM INICIAL DE PRODUTOS CADASTRADOS NO SISTEMA
const produtosIniciais = [
  {
    id: "tapioca",
    nome: "Tapioca Tradicional",
    categoria: "Tapiocas",
    descricao: "Recheada com coco, queijo coalho e leite condensado",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "cuscuz",
    nome: "Cuscuz Simples",
    categoria: "Bolos",
    descricao: "Cuscuz acompanhado de ovos e queijo.",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "boloDeMacaxeira",
    nome: "Bolo de Macaxeira",
    categoria: "Bolos",
    descricao: "Bolo de macaxeira recheado com coco",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "boloDeFuba",
    nome: "Bolo de Fubá",
    categoria: "Bolos",
    descricao: "Bolo acompanhado de café com leite.",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "boloDeMilho",
    nome: "Bolo de Milho",
    categoria: "Bolos",
    descricao: "Bolo acompanhado de café com leite.",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "canjica",
    nome: "Canjica Tradicional",
    categoria: "Canjicas",
    descricao: "Canjica ao leite de coco temperada com canela",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "milhoVerde",
    nome: "Milho Verde Cozido",
    categoria: "Milhos",
    descricao: "Milho banhado na manteiga de garrafa",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "boloDeRolo",
    nome: "Bolo de Rolo",
    categoria: "Bolos",
    descricao: "Bolo recheado com goiabada derretida",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "pamonhaRecheada",
    nome: "Pamonha Recheada",
    categoria: "Pamonhas",
    descricao: "Pamonha recheada com queijo coalho",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "arrumadinho",
    nome: "Arrumadinho",
    categoria: "Pratos",
    descricao: "Preparado com feijão verde, arroz e carne seca",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "boboDeCamarao",
    nome: "Bobó de Camarão",
    categoria: "Pratos",
    descricao: "Camarão cozido no tempeiro e leite de coco",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "baiaoDeDois",
    nome: "Baião de Dois",
    categoria: "Pratos",
    descricao: "Prato típico com feijão, arroz, , cuscuz e carne",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "carneDeSol",
    nome: "Carne de Sol com Fritas",
    categoria: "Pratos",
    descricao: "Carne de sol acompanhada de macaxeira frita",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "muquecaDePeixe",
    nome: "Muqueca De Peixe",
    categoria: "Pratos",
    descricao: "Peixe cozido no leite de coco com legumes",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "feijoada",
    nome: "Feijoada",
    categoria: "Pratos",
    descricao: "Feijoada com arroz,farofa e bastantes legumes",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "caranguejo",
    nome: "Caranguejo",
    categoria: "Crustáceo",
    descricao: "Caranguejo acompanhado de pirão, arroz e salada",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "buchadaDeBode",
    nome: "Buchada de Bode",
    categoria: "Pratos",
    descricao: "Buchada acomponhada de pirão, arroz e legumes",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "vatapa",
    nome: "Vatapá",
    categoria: "Pratos",
    descricao: "Típico da culinária baiana recheado com camarão",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "macaxeiraComCharque",
    nome: "Macaxeira com Charque",
    categoria: "Pratos",
    descricao: "Macaxeira cozida, charque acebolada e batata frita",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "cabritoAoForno",
    nome: "Cabrito ao Forno",
    categoria: "Pratos",
    descricao: "O prato é acompanhado de arroz, feijão verde e farofa",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "galinhaDeCabidela",
    nome: "Galinha à Cabidela",
    categoria: "Pratos",
    descricao: "Guizado acompanhado de arroz, pirão e farofa",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "peixeAssado",
    nome: "Peixe Assado",
    categoria: "Pratos",
    descricao: "Peixe frito acompanhado de arroz, farofa e salada",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "sarapatel",
    nome: "Sarapatel",
    categoria: "Pratos",
    descricao: "Prato típico acompanado de arroz, farofa e salada",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "inhameCozido",
    nome: "Inhame Cozido",
    categoria: "Pratos",
    descricao: "Inhame cozido com carne guizada",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "batataDoceCozida",
    nome: "Batata Doce Cozida",
    categoria: "Pratos",
    descricao: "Acompanhado com guizado de boi e batata inglesa",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "arrozDoce",
    nome: "Arroz Doce",
    categoria: "Pratos",
    descricao: "Arroz cozido noleite de coco povilhado com canela",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "pamonha",
    nome: "Pamonha Tradicional",
    categoria: "Pamonhas",
    descricao: "Receita tradicionalmente nordestina",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "tapibana",
    nome: "Tapibana",
    categoria: "Tapioca",
    descricao: "Tapioca recheada com banana e leite condensado",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "comidasTipicas",
    nome: "Pratos Tipicos da Região",
    categoria: "Pratos",
    descricao: "Uma diversidade de pratos típicos do nordeste",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "sucosGarrafa",
    nome: "Sucos Diversos Sabores",
    categoria: "Bebidas",
    descricao: "Garrafa Plástica volume de 250ml",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "aguaMineral",
    nome: "Água Mineral",
    categoria: "Bebidas",
    descricao: "Água Mineral volume de 500ml",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "refrigeranteGarrafa",
    nome: "Refrigerante 2 litros",
    categoria: "Bebidas",
    descricao: "Refrigerantes diversos sabores",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "refrigeranteLata",
    nome: "Lata de 350ml",
    categoria: "Bebidas",
    descricao: "Refrigerantes diversos sabores",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "cartola",
    nome: "Cartola Simples",
    categoria: "Pratos",
    descricao: "Banana frita com queijo e canela",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "rabada",
    nome: "Rabada de Boi",
    categoria: "Pratos",
    descricao: "Rabada com pirão e arroz",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "coxinha",
    nome: "Coxinha de frango",
    categoria: "Massas",
    descricao: "Coxinha recheada com frango",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "acarajeRecheado",
    nome: "Acarajé Recheado",
    categoria: "Massas",
    descricao: "Acarajé recheado com canarão",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "boloDeMandioca",
    nome: "Bolo de Mandioca",
    categoria: "Bolos",
    descricao: "Bolo à base de mandioca",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "acarajeSimples",
    nome: "Acarajé Simples",
    categoria: "Massas",
    descricao: "Acarajé com camarão",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "cocada",
    nome: "Cocada Simples",
    categoria: "Doces",
    descricao: "ocada com cobertura de leite condensado",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "peDeMoleque",
    nome: "Pé de Moleque",
    categoria: "Doces",
    descricao: "Cocada de amendoim",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "tapiocaComCharque",
    nome: "Tapioca (charque)",
    categoria: "Tapiocas",
    descricao: "Tapioca recheada com charque",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "tapiocaRecheada1",
    nome: "Tapioca (camarão)",
    categoria: "Tapiocas",
    descricao: "Tapioca recheada com camarão",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "churros",
    nome: "Churros ao Leite",
    categoria: "Doces",
    descricao: "Churros ao leite condensado",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "sururuAoCoco",
    nome: "Sururu ao Molho",
    categoria: "Pratos",
    descricao: "Sururu ao molho de leite de coco",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "vacaAtolada",
    nome: "Vaca Atolada",
    categoria: "Pratos",
    descricao: "Prato servido com pirão e arroz",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "paçoca",
    nome: "Paçoca (unidade)",
    categoria: "Doces",
    descricao: "Sobremesa à base de amendoim",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "quentaoCaseiro",
    nome: "Quentão Caseiro",
    categoria: "Bebidas",
    descricao: "Bebida à base de cachaça gengibre e especiarias",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "chaDeHortela",
    nome: "Chá De Hortelã",
    categoria: "Bebidas",
    descricao: "Bebida feita com folhas de hortelã",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "chaDeCanela",
    nome: "Chá de Canela",
    categoria: "Bebidas",
    descricao: "Feito à base de canela com limão",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "sucosEspeciais",
    nome: "Sucos Naturais",
    categoria: "Bebidas",
    descricao: "Suco à base de laranja e cenoura",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "sucosSabores",
    nome: "Sucos Típicos",
    categoria: "Bebidas",
    descricao: "Produzidso com frutas da região",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "aguaDeCoco",
    nome: "Água de coco",
    categoria: "Bebidas",
    descricao: "Água de coco verde",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },

  {
    id: "sucosDaFruta",
    nome: "Sucos de Fruta",
    categoria: "Bebidas",
    descricao: "Sucos de frutas típicas da região",
    preco: 99.9,
    quantidade: 100,
    estoqueMinimo: 10,
    status: "ativo",
    disponivel: true,
  },
];
// VERIFICA SE HÁ PRODUTOS SALVOS, IMPORTA A LISTA INICIAL OU SINCROSTIZA NOVOS PRODUTOS E CAMPOS FALTANTES NO ARMAZENAMENTO LOCAL
function iniciarProdutos() {
  const CHAVE_PRODUTOS = "produtosRaizes";
  let produtosSalvos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS));

  // CARREGA A LISTA INICIAL DO PROJETO CASO O NAVEGADOR NAO POSSUA DADOS CADASTRADOS NO LOCALSTORAGE
  if (!produtosSalvos || produtosSalvos.length === 0) {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtosIniciais));

    return;
  }
  let alterou = false;
  
  // PERCORRE O CATALOGO PADRAO VERIFICANDO SE HA NOVAS MERCADORIAS OU PROPRIEDADES AUSENTES
  produtosIniciais.forEach((produtoInicial) => {
    const produto = produtosSalvos.find((p) => p.id === produtoInicial.id);

    // SE O PRATO NAO EXISTIR NA MEMORIA DO COMPILADOR ELE E ADICIONADO DIRETAMENTE AO MAPA
    if (!produto) {
      produtosSalvos.push(produtoInicial);
      alterou = true;
    } else {
      // MAPEIA AS CHAVES RESTRITAS DO OBJETO PARA ADICIONAR NOVOS CAMPOS AUTOMATICAMENTE
      Object.keys(produtoInicial).forEach((chave) => {
        if (!(chave in produto)) {
          produto[chave] = produtoInicial[chave];
          alterou = true;
        }
      });
    }
  });

  // REESCREVE A BASE DE DADOS SE ALGUMA ALTERACAO DE ESTRUTURA OU PRODUTO TIVER SIDO DETECTADA
  if (alterou) {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtosSalvos));
  }
}

// EXECUTA A INICIALIZAÇÃO AUTOMATICA AO CARREGAR A FOLHA DE SCRIPT NO NAVEGADOR
iniciarProdutos();

import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf, TCU } from "../sources";

/** Categoria O — Controle e transparência. Publicada, Premium. */
const S = {
  fisc: cf("fiscalizacao", "Art. 70 a 75 (fiscalização contábil, financeira e orçamentária)."),
  contas: cf("prestar-contas", "Art. 70, parágrafo único (dever de prestar contas)."),
  pub: cf("publicidade", "Art. 37 (publicidade) e Art. 5º, XXXIII (direito à informação)."),
};

export const trailO = publishTrail(
  buildTrail({
    id: "trilha-o",
    slug: "controle-e-transparencia",
    order: 15,
    title: "Controle e transparência",
    description:
      "Quem fiscaliza o uso do dinheiro público: controle externo e interno, o TCU, o acesso à informação e o controle social.",
    lessons: [
      buildLesson({
        id: "o1",
        slug: "por-que-fiscalizar",
        order: 1,
        title: "Por que fiscalizar o dinheiro público",
        objective: "Entender a importância do controle sobre os recursos públicos.",
        sources: [S.contas],
        teaching: [
          screen(
            "Dinheiro de todos exige prestação de contas",
            "Quem administra recursos públicos tem o dever de prestar contas (Art. 70).",
            "Fiscalizar evita desperdício e desvio e garante que o dinheiro cumpra sua finalidade.",
          ),
        ],
        specs: [
          ["mc", "Dever de prestar contas", "Quem administra dinheiro público:", ["Tem o dever de prestar contas", "Não precisa explicar nada", "Decide sozinho sem limites", "Só responde a si mesmo"], 0, "A prestação de contas é um dever constitucional.", ["cf-prestar-contas"]],
          ["tf", "Objetivo do controle", "A fiscalização ajuda a evitar desperdício e desvio de recursos.", true, "Verdadeiro. O controle protege o dinheiro público.", ["cf-prestar-contas"]],
          ["mc", "Dinheiro público", "Recursos públicos pertencem, em última análise:", ["À sociedade (são de todos)", "A um partido", "Ao governante", "A um banco"], 0, "O dinheiro público é da sociedade.", ["cf-prestar-contas"]],
          ["tf", "Controle e confiança", "Transparência e controle aumentam a confiança nas instituições.", true, "Verdadeiro. Prestar contas fortalece a confiança pública.", ["cf-prestar-contas"]],
          ["mc", "Sem controle", "A ausência de controle tende a:", ["Facilitar desperdício e corrupção", "Melhorar os serviços sempre", "Reduzir impostos", "Aumentar a transparência"], 0, "Sem fiscalização, crescem os riscos de mau uso.", ["cf-prestar-contas"]],
          ["mc", "Finalidade do gasto", "Fiscalizar verifica, entre outras coisas, se o gasto:", ["Cumpriu sua finalidade e a lei", "Foi o maior possível", "Beneficiou amigos", "Foi secreto"], 0, "O controle checa legalidade e finalidade do gasto.", ["cf-prestar-contas"]],
          ["tf", "Responsabilização", "Quem usa mal o dinheiro público pode ser responsabilizado.", true, "Verdadeiro. Há responsabilização por mau uso de recursos.", ["cf-prestar-contas"]],
          ["mc", "Cidadão e controle", "O cidadão participa do controle quando:", ["Acompanha e cobra o uso dos recursos", "Ignora a vida pública", "Esconde informações", "Nada faz"], 0, "Acompanhar e cobrar é exercer o controle social.", ["cf-prestar-contas"]],
        ],
      }),
      buildLesson({
        id: "o2",
        slug: "controle-externo-e-interno",
        order: 2,
        title: "Controle externo e interno",
        objective: "Diferenciar controle externo e interno.",
        sources: [S.fisc],
        teaching: [
          screen(
            "Dois tipos de controle",
            "Controle externo: feito pelo Legislativo, com auxílio do Tribunal de Contas, sobre os outros órgãos.",
            "Controle interno: cada Poder mantém seu próprio sistema para se autocontrolar.",
          ),
        ],
        specs: [
          ["mc", "Controle externo", "O controle externo é exercido:", ["Pelo Legislativo, com auxílio do Tribunal de Contas", "Só pelo próprio órgão fiscalizado", "Por empresas privadas", "Por ninguém"], 0, "O Legislativo faz o controle externo, auxiliado pelo TCU.", ["cf-fiscalizacao"]],
          ["mc", "Controle interno", "O controle interno é:", ["O sistema que cada Poder mantém para se autocontrolar", "Feito por outro país", "Proibido", "Apenas simbólico"], 0, "Cada Poder tem seu controle interno.", ["cf-fiscalizacao"]],
          ["tf", "Complementares", "Controle externo e interno se complementam.", true, "Verdadeiro. Os dois atuam de formas complementares.", ["cf-fiscalizacao"]],
          ["mc", "Quem auxilia o Congresso", "No controle externo, o Congresso é auxiliado:", ["Pelo Tribunal de Contas da União (TCU)", "Pelo Banco Central", "Pelo STF", "Pela imprensa"], 0, "O TCU auxilia o Congresso no controle externo.", ["cf-fiscalizacao"]],
          ["tf", "Autocontrole", "O controle interno ajuda um órgão a corrigir problemas antes que virem escândalos.", true, "Verdadeiro. O controle interno é preventivo e corretivo.", ["cf-fiscalizacao"]],
          ["mc", "Alvo do controle", "A fiscalização recai sobre:", ["O uso de recursos públicos pelos órgãos", "A vida privada dos cidadãos", "Opiniões políticas", "Resultados de futebol"], 0, "O foco é o uso dos recursos públicos.", ["cf-fiscalizacao"]],
          ["mc", "Base legal", "A fiscalização contábil, financeira e orçamentária está prevista:", ["Na Constituição", "Em nenhum lugar", "Só em decretos secretos", "Em regras de um clube"], 0, "A Constituição prevê esse controle (Arts. 70 a 75).", ["cf-fiscalizacao"]],
          ["tf", "Independência do controle", "Órgãos de controle precisam de autonomia para fiscalizar sem pressão.", true, "Verdadeiro. A autonomia é essencial para um controle efetivo.", ["cf-fiscalizacao"]],
        ],
      }),
      buildLesson({
        id: "o3",
        slug: "o-tribunal-de-contas",
        order: 3,
        title: "O Tribunal de Contas",
        objective: "Entender o papel do TCU.",
        sources: [S.fisc, TCU],
        teaching: [
          screen(
            "Quem confere as contas",
            "O Tribunal de Contas da União (TCU) auxilia o Congresso no controle externo: julga contas de administradores, aponta irregularidades e fiscaliza a aplicação de recursos federais.",
            "Nos estados e municípios há Tribunais de Contas correspondentes.",
          ),
        ],
        specs: [
          ["mc", "Papel do TCU", "O TCU:", ["Auxilia o Congresso no controle externo das contas públicas", "Faz as leis", "Governa estados", "Julga crimes comuns"], 0, "O TCU é o órgão auxiliar de controle externo.", ["cf-fiscalizacao"]],
          ["tf", "Julgar contas", "O TCU pode julgar as contas de administradores de recursos públicos federais.", true, "Verdadeiro. É uma de suas competências.", ["cf-fiscalizacao"]],
          ["mc", "Âmbito do TCU", "O TCU fiscaliza principalmente recursos:", ["Federais", "Apenas de uma cidade", "De empresas privadas sem repasse público", "De outros países"], 0, "O TCU atua sobre recursos federais.", ["cf-fiscalizacao"]],
          ["mc", "Nos estados", "A fiscalização de contas estaduais cabe, em regra:", ["Aos Tribunais de Contas dos estados", "Ao TCU apenas", "A ninguém", "Ao STF"], 0, "Há Tribunais de Contas estaduais para esse controle.", ["cf-fiscalizacao"]],
          ["tf", "Apontar irregularidades", "O TCU pode apontar irregularidades e recomendar providências.", true, "Verdadeiro. Ele identifica problemas e cobra correções.", ["cf-fiscalizacao"]],
          ["mc", "Auxílio ao Legislativo", "O TCU trabalha em apoio a qual Poder?", ["Legislativo", "Judiciário", "Executivo", "Nenhum"], 0, "O TCU auxilia o Legislativo no controle externo.", ["cf-fiscalizacao"]],
          ["tf", "Não é tribunal do Judiciário", "Apesar do nome, o Tribunal de Contas exerce função de controle, não é parte do Poder Judiciário comum.", true, "Verdadeiro. É órgão de controle, auxiliar do Legislativo.", ["cf-fiscalizacao"]],
          ["mc", "Resultado da fiscalização", "Se o TCU encontra um gasto irregular, pode:", ["Determinar correções e aplicar sanções previstas em lei", "Mandar prender qualquer um sem processo", "Criar impostos", "Eleger prefeitos"], 0, "O TCU atua nos limites legais de controle e sanção.", ["cf-fiscalizacao"]],
        ],
      }),
      buildLesson({
        id: "o4",
        slug: "acesso-a-informacao",
        order: 4,
        title: "Acesso à informação",
        objective: "Conhecer o direito de acesso à informação pública.",
        sources: [S.pub],
        teaching: [
          screen(
            "A regra é a transparência",
            "A publicidade é um princípio da administração (Art. 37) e o acesso à informação é um direito (Art. 5º, XXXIII).",
            "Órgãos públicos devem divulgar dados e responder a pedidos de informação, salvo exceções previstas em lei (como segredo justificado).",
          ),
        ],
        specs: [
          ["mc", "Regra geral", "Em relação às informações públicas, a regra é:", ["A transparência (publicidade)", "O sigilo total", "A venda das informações", "O esquecimento"], 0, "A publicidade é a regra; o sigilo é a exceção.", ["cf-publicidade"]],
          ["tf", "Direito à informação", "O cidadão tem direito de pedir e receber informações de órgãos públicos.", true, "Verdadeiro. É um direito constitucional (Art. 5º, XXXIII).", ["cf-publicidade"]],
          ["mc", "Portais de transparência", "Portais de transparência servem para:", ["Divulgar gastos e contratos públicos", "Esconder dados", "Vender produtos", "Fazer campanha"], 0, "Eles publicam dados sobre o uso dos recursos.", ["cf-publicidade"]],
          ["mc", "Exceções ao acesso", "O acesso pode ser restrito:", ["Em casos previstos em lei, como segurança e privacidade", "Sempre que a autoridade quiser", "Para esconder erros", "Nunca há exceção"], 0, "Há exceções legais e justificadas ao acesso.", ["cf-publicidade"]],
          ["tf", "Pedido de informação", "Qualquer pessoa pode fazer um pedido de informação a um órgão público.", true, "Verdadeiro. O acesso é amplo, com exceções legais.", ["cf-publicidade"]],
          ["mc", "Transparência ativa", "Quando o órgão divulga dados por conta própria (sem pedido), isso é:", ["Transparência ativa", "Sigilo", "Propaganda", "Crime"], 0, "Divulgar espontaneamente é transparência ativa.", ["cf-publicidade"]],
          ["tf", "Transparência e controle", "O acesso à informação fortalece o controle da sociedade sobre o poder.", true, "Verdadeiro. Informação é base do controle social.", ["cf-publicidade"]],
          ["mc", "Uso da informação", "Com dados públicos, o cidadão pode:", ["Acompanhar e cobrar o governo", "Nada fazer", "Apenas reclamar sem base", "Eleger juízes"], 0, "Dados públicos embasam a cobrança qualificada.", ["cf-publicidade"]],
        ],
      }),
      buildLesson({
        id: "o5",
        slug: "controle-social",
        order: 5,
        title: "Controle social",
        objective: "Entender como a sociedade participa do controle.",
        sources: [S.pub],
        teaching: [
          screen(
            "A sociedade também fiscaliza",
            "Controle social é a participação da sociedade na fiscalização do poder público: conselhos, ouvidorias, audiências e o uso de dados abertos.",
            "Você também fiscaliza quando consulta um portal de transparência e cobra explicações.",
          ),
        ],
        specs: [
          ["mc", "Controle social", "Controle social é:", ["A participação da sociedade na fiscalização do poder público", "O controle feito só por militares", "Um imposto", "Um partido"], 0, "É o cidadão e a sociedade acompanhando o poder.", ["cf-publicidade"]],
          ["mc", "Instrumento de controle social", "É um instrumento de controle social:", ["Conselhos e ouvidorias", "Grupos secretos", "Propaganda paga", "Nenhum canal"], 0, "Conselhos e ouvidorias canalizam a participação.", ["cf-publicidade"]],
          ["tf", "Dados abertos", "Dados públicos abertos facilitam o controle pela sociedade.", true, "Verdadeiro. Dados abertos ampliam a fiscalização cidadã.", ["cf-publicidade"]],
          ["mc", "Ouvidoria", "A ouvidoria serve para:", ["Receber reclamações, pedidos e sugestões", "Fazer campanha", "Julgar processos", "Emitir moeda"], 0, "A ouvidoria é um canal entre sociedade e órgão público.", ["cf-publicidade"]],
          ["tf", "Participar fiscalizando", "Consultar um portal de transparência e cobrar explicações é uma forma de controle social.", true, "Verdadeiro. É exercer a cidadania fiscalizadora.", ["cf-publicidade"]],
          ["mc", "Conselho de política", "Conselhos (de saúde, educação etc.) permitem:", ["Que a sociedade acompanhe e influencie políticas", "Que empresas decidam tudo", "Que ninguém participe", "Que se proíba o debate"], 0, "Conselhos abrem espaço de participação e controle.", ["cf-publicidade"]],
          ["tf", "Controle social e democracia", "O controle social fortalece a democracia.", true, "Verdadeiro. Cidadãos ativos melhoram as instituições.", ["cf-publicidade"]],
          ["mc", "Começo do controle", "Um primeiro passo do controle social é:", ["Informar-se com fontes oficiais", "Compartilhar boatos", "Ignorar os dados", "Acreditar em tudo"], 0, "Informar-se com fontes oficiais embasa o controle.", ["cf-publicidade"]],
        ],
      }),
    ],
  }),
);

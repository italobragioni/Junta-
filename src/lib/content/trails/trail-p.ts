import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria P — Partidos e representação. Publicada, Premium. */
const S = {
  part: cf("partidos", "Art. 17 (partidos políticos; liberdade de criação; caráter nacional)."),
  rep: cf("representacao", "Art. 1º, parágrafo único, e Art. 14 (representação e soberania popular)."),
};

export const trailP = publishTrail(
  buildTrail({
    id: "trilha-p",
    slug: "partidos-e-representacao",
    order: 16,
    title: "Partidos e representação",
    description:
      "O que são partidos, por que existem, como funciona a representação política e o que esperar de quem elegemos.",
    lessons: [
      buildLesson({
        id: "p1",
        slug: "o-que-e-representacao",
        order: 1,
        title: "O que é representação política",
        objective: "Entender a democracia representativa.",
        sources: [S.rep],
        teaching: [
          screen(
            "Decidir por meio de representantes",
            "Como não dá para todos decidirem tudo diretamente, elegemos representantes para legislar e governar em nosso nome.",
            "Isso é a democracia representativa — combinada, no Brasil, com formas de participação direta.",
          ),
        ],
        specs: [
          ["mc", "Democracia representativa", "Na democracia representativa:", ["Elegemos pessoas para decidir em nosso nome", "Cada um decide tudo sozinho", "Ninguém decide", "Só o presidente decide"], 0, "Representantes eleitos decidem em nome do povo.", ["cf-representacao"]],
          ["tf", "Origem do mandato", "O poder dos representantes vem do voto do povo.", true, "Verdadeiro. O mandato nasce da escolha popular.", ["cf-representacao"]],
          ["mc", "Por que representar", "A representação existe porque:", ["É inviável todos decidirem diretamente tudo o tempo todo", "O povo não importa", "A Constituição proíbe votar", "Representantes são donos do poder"], 0, "A representação viabiliza decisões coletivas em larga escala.", ["cf-representacao"]],
          ["tf", "Participação direta", "Além de eleger representantes, o cidadão pode participar diretamente (plebiscito, iniciativa popular).", true, "Verdadeiro. O Brasil combina representação e participação direta.", ["cf-representacao"]],
          ["mc", "Dever do representante", "Espera-se que o representante:", ["Atue no interesse público e preste contas", "Sirva só a si mesmo", "Ignore os eleitores", "Fique acima da lei"], 0, "O mandato é exercido no interesse público.", ["cf-representacao"]],
          ["mc", "Quem o deputado representa", "Um deputado, ao ser eleito, representa:", ["O povo", "Apenas quem votou nele", "Somente seu partido", "Apenas a si mesmo"], 0, "O eleito representa o conjunto do povo.", ["cf-representacao"]],
          ["tf", "Cobrança", "O cidadão pode acompanhar e cobrar seus representantes durante o mandato.", true, "Verdadeiro. A cobrança não se limita ao dia da eleição.", ["cf-representacao"]],
          ["mc", "Renovação", "A renovação periódica dos representantes acontece por meio:", ["Das eleições", "De sorteio", "De herança", "De indicação do governo"], 0, "As eleições renovam a representação.", ["cf-representacao"]],
        ],
      }),
      buildLesson({
        id: "p2",
        slug: "o-que-e-um-partido",
        order: 2,
        title: "O que é um partido político",
        objective: "Entender a função dos partidos.",
        sources: [S.part],
        teaching: [
          screen(
            "Associações para disputar o poder",
            "Partido é uma associação de pessoas com ideias afins que se organiza para disputar eleições e participar do poder.",
            "No Brasil, a criação de partidos é livre, respeitada a soberania nacional e o regime democrático (Art. 17).",
          ),
        ],
        specs: [
          ["mc", "Definição de partido", "Um partido político é:", ["Uma associação organizada para disputar eleições e participar do poder", "Um órgão do governo", "Um tribunal", "Uma empresa qualquer"], 0, "Partidos organizam a disputa política.", ["cf-partidos"]],
          ["tf", "Liberdade partidária", "No Brasil, a criação de partidos é livre, dentro das regras constitucionais.", true, "Verdadeiro. O Art. 17 assegura a liberdade partidária.", ["cf-partidos"]],
          ["mc", "Função dos partidos", "Entre as funções dos partidos está:", ["Agregar ideias e apresentar candidatos", "Julgar crimes", "Arrecadar impostos", "Comandar as Forças Armadas"], 0, "Partidos organizam propostas e lançam candidaturas.", ["cf-partidos"]],
          ["mc", "Caráter nacional", "A Constituição exige que os partidos tenham:", ["Caráter nacional", "Sede no exterior", "Fins lucrativos", "Caráter secreto"], 0, "Os partidos devem ter caráter nacional.", ["cf-partidos"]],
          ["tf", "Pluripartidarismo", "O Brasil adota o pluripartidarismo (vários partidos).", true, "Verdadeiro. O sistema admite múltiplos partidos.", ["cf-partidos"]],
          ["mc", "Filiação", "Para ser candidato, em regra, é preciso:", ["Ser filiado a um partido", "Ter uma empresa", "Ser servidor público", "Ter mais de 60 anos"], 0, "A filiação partidária é condição de elegibilidade.", ["cf-partidos"]],
          ["tf", "Partidos e democracia", "Partidos são peças importantes da democracia representativa.", true, "Verdadeiro. Eles estruturam a disputa e a representação.", ["cf-partidos"]],
          ["mc", "Programa partidário", "O programa de um partido expressa:", ["Suas ideias e propostas", "Um segredo de Estado", "Uma lei obrigatória", "Um imposto"], 0, "O programa reúne as propostas e valores do partido.", ["cf-partidos"]],
        ],
      }),
      buildLesson({
        id: "p3",
        slug: "como-os-partidos-atuam",
        order: 3,
        title: "Como os partidos atuam",
        objective: "Entender bancadas, situação e oposição.",
        sources: [S.part],
        teaching: [
          screen(
            "Dentro do Legislativo",
            "Eleitos de um mesmo partido formam bancadas. Quem apoia o governo é a situação; quem o contesta é a oposição.",
            "Partidos negociam, constroem maiorias e também fiscalizam.",
          ),
        ],
        specs: [
          ["mc", "Bancada", "Uma bancada é:", ["O conjunto de parlamentares de um partido", "Um banco de praça", "Um tribunal", "Um ministério"], 0, "Bancada é o grupo de eleitos de um partido numa Casa.", ["cf-partidos"]],
          ["mc", "Situação", "No Legislativo, a “situação” é formada por quem:", ["Apoia o governo", "Sempre se opõe ao governo", "Não vota", "É do Judiciário"], 0, "A situação reúne quem apoia o governo.", ["cf-partidos"]],
          ["mc", "Oposição", "A oposição é formada por quem:", ["Contesta e fiscaliza o governo", "Sempre concorda com o governo", "Não participa", "É neutro por lei"], 0, "A oposição critica e fiscaliza o governo.", ["cf-partidos"]],
          ["tf", "Papel da oposição", "A oposição é importante para fiscalizar e apresentar alternativas.", true, "Verdadeiro. Oposição forte faz parte de uma democracia saudável.", ["cf-partidos"]],
          ["mc", "Construir maioria", "Para aprovar leis, os partidos frequentemente:", ["Negociam e formam maiorias", "Decidem por sorteio", "Agem sempre sozinhos", "Ignoram o Plenário"], 0, "A formação de maiorias é parte do jogo legislativo.", ["cf-partidos"]],
          ["tf", "Coerência programática", "Idealmente, a atuação de um partido reflete seu programa.", true, "Verdadeiro. Espera-se coerência entre discurso e ação.", ["cf-partidos"]],
          ["mc", "Fiscalização pelos partidos", "Partidos de oposição ajudam a:", ["Fiscalizar o governo", "Esconder irregularidades", "Fazer leis sozinhos", "Julgar réus"], 0, "A oposição exerce fiscalização sobre o governo.", ["cf-partidos"]],
          ["mc", "Mudança de rumo", "Quando a maioria muda numa eleição, tende a mudar:", ["O equilíbrio entre situação e oposição", "A Constituição automaticamente", "O Judiciário", "A moeda"], 0, "Eleições redefinem maiorias e minorias no Legislativo.", ["cf-partidos"]],
        ],
      }),
      buildLesson({
        id: "p4",
        slug: "avaliar-candidatos",
        order: 4,
        title: "Como avaliar candidatos e partidos",
        objective: "Aplicar critérios para avaliar candidatos.",
        sources: [S.rep],
        teaching: [
          screen(
            "Olhe além do slogan",
            "Para avaliar, veja propostas concretas, histórico, coerência e viabilidade — não apenas o carisma ou o slogan.",
            "Confira informações em fontes oficiais e desconfie de promessas sem como cumprir.",
          ),
        ],
        specs: [
          ["mc", "Bom critério", "Um bom critério para avaliar um candidato é:", ["Analisar propostas concretas e histórico", "Só o carisma", "A quantidade de seguidores", "A beleza do cartaz"], 0, "Propostas e histórico dizem mais que carisma.", ["cf-representacao"]],
          ["tf", "Viabilidade", "Vale avaliar se as propostas são viáveis (têm como ser cumpridas).", true, "Verdadeiro. Promessas precisam de viabilidade.", ["cf-representacao"]],
          ["mc", "Fonte de informação", "Para checar um candidato, convém usar:", ["Fontes oficiais e dados verificáveis", "Apenas boatos", "Somente propaganda do próprio", "Nada"], 0, "Fontes oficiais embasam uma decisão informada.", ["cf-representacao"]],
          ["mc", "Sinal de alerta", "É um sinal de alerta em uma campanha:", ["Promessas sem explicar como cumprir", "Propostas com custo e prazo", "Histórico transparente", "Dados verificáveis"], 0, "Promessas vagas e sem fonte são um alerta.", ["cf-representacao"]],
          ["tf", "Coerência", "Verificar se o discurso combina com o histórico ajuda a avaliar.", true, "Verdadeiro. Coerência entre fala e ações importa.", ["cf-representacao"]],
          ["mc", "Voto consciente", "Votar de forma consciente significa:", ["Decidir com base em informação e critérios", "Decidir por impulso", "Seguir boatos", "Não se informar"], 0, "O voto consciente se apoia em informação.", ["cf-representacao"]],
          ["tf", "Avaliar o partido", "Também vale olhar o programa e a atuação do partido, não só a pessoa.", true, "Verdadeiro. Partido e candidato influenciam a atuação.", ["cf-representacao"]],
          ["mc", "Além do carisma", "Basear o voto só em carisma pode:", ["Ignorar propostas e histórico relevantes", "Garantir boa gestão", "Substituir a análise", "Checar os fatos"], 0, "Carisma não substitui a análise de propostas e histórico.", ["cf-representacao"]],
        ],
      }),
      buildLesson({
        id: "p5",
        slug: "financiamento-e-regras",
        order: 5,
        title: "Regras do jogo eleitoral",
        objective: "Entender, em linhas gerais, regras que organizam a disputa.",
        sources: [S.part],
        teaching: [
          screen(
            "Disputa com regras",
            "A disputa eleitoral tem regras: prazos, prestação de contas de campanha, limites e fiscalização pela Justiça Eleitoral.",
            "As regras buscam equilíbrio e lisura na competição.",
          ),
        ],
        specs: [
          ["mc", "Por que ter regras", "As regras eleitorais existem para:", ["Garantir uma disputa mais justa e transparente", "Favorecer um candidato", "Impedir eleições", "Esconder gastos"], 0, "As regras buscam equilíbrio e lisura.", ["cf-partidos"]],
          ["tf", "Prestação de contas de campanha", "Campanhas prestam contas de seus gastos à Justiça Eleitoral.", true, "Verdadeiro. A prestação de contas é obrigatória.", ["cf-partidos"]],
          ["mc", "Quem fiscaliza", "A disputa eleitoral é fiscalizada:", ["Pela Justiça Eleitoral", "Por cada candidato sobre si mesmo", "Por ninguém", "Pela imprensa apenas"], 0, "A Justiça Eleitoral fiscaliza o processo.", ["cf-partidos"]],
          ["tf", "Igualdade de condições", "As regras tentam evitar que o poder econômico distorça demais a disputa.", true, "Verdadeiro. Há limites para proteger o equilíbrio.", ["cf-partidos"]],
          ["mc", "Prazos", "Prazos eleitorais servem para:", ["Organizar as fases da disputa", "Confundir eleitores", "Beneficiar quem tem mais dinheiro", "Nada"], 0, "Prazos ordenam o calendário eleitoral.", ["cf-partidos"]],
          ["mc", "Abuso de poder", "A Justiça Eleitoral pode punir:", ["Abuso de poder econômico ou político na eleição", "Opiniões divergentes", "Quem vota", "Quem se informa"], 0, "Abusos que distorcem a disputa podem ser punidos.", ["cf-partidos"]],
          ["tf", "Transparência na campanha", "Saber de onde vêm os recursos de uma campanha é de interesse público.", true, "Verdadeiro. A transparência financeira protege a lisura.", ["cf-partidos"]],
          ["mc", "Função das regras", "No conjunto, as regras eleitorais buscam:", ["Uma competição equilibrada e confiável", "Um vencedor definido de antemão", "O fim dos partidos", "A ausência de fiscalização"], 0, "O objetivo é uma disputa justa e confiável.", ["cf-partidos"]],
        ],
      }),
    ],
  }),
);

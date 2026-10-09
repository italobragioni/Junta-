import type { LearningPath, Source } from "@/lib/content/types";

/**
 * Trilha D — Informação e participação. Complete DRAFT (rascunho), Premium.
 *
 * Teaches information literacy (fact vs. opinion, checking sources, reading
 * charts) and forms of participation. Participation mechanisms cite the
 * Constitution (Art. 14). Media-literacy framing is conceptual and flagged for
 * editorial review to attach suitable references.
 */

const CF_PARTICIPACAO: Source = {
  id: "cf88-participacao",
  title: "Constituição de 1988 — Art. 14 (soberania popular: voto, plebiscito, referendo, iniciativa popular)",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  consultedAt: "2026-10-09",
  excerpt:
    "Art. 14: a soberania popular é exercida pelo sufrágio universal e pelo voto, e também mediante plebiscito, referendo e iniciativa popular.",
  nature: "fato_institucional",
};

const LETRAMENTO: Source = {
  id: "d-letramento",
  title: "Letramento informacional — referência a definir em revisão",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  consultedAt: "2026-10-09",
  excerpt:
    "RASCUNHO: conceitos de checagem de informação e leitura de dados. Substituir por referência adequada (ex.: materiais oficiais de educação midiática) antes de publicar; a URL é apenas um marcador provisório.",
  nature: "conceito_interpretativo",
};

const draftMeta = {
  plan: "premium" as const,
  status: "rascunho" as const,
  version: 1,
  revisedAt: "2026-10-09",
};

export const trailD: LearningPath = {
  id: "trilha-d",
  slug: "informacao-e-participacao",
  order: 4,
  title: "Informação e participação",
  description:
    "Avaliar informação com cuidado — fato, opinião e previsão; checar fontes; ler gráficos — e participar além do voto.",
  lessons: [
    {
      id: "d1",
      slug: "fato-opiniao-previsao",
      order: 1,
      title: "Fato, opinião e previsão",
      objective: "Distinguir fato, opinião e previsão em afirmações do dia a dia.",
      ...draftMeta,
      sources: [LETRAMENTO],
      teaching: [
        {
          title: "Três coisas diferentes",
          body: [
            "Fato: algo que pode ser verificado (ex.: “a Constituição atual é de 1988”).",
            "Opinião: um juízo de valor ou preferência (ex.: “esta é a melhor política”).",
            "Previsão: uma afirmação sobre o futuro, que ainda não se realizou (ex.: “os preços vão subir no ano que vem”).",
          ],
        },
        {
          title: "Por que separar",
          body: [
            "Misturar os três gera confusão: uma previsão não é um fato consumado, e uma opinião não vira fato só porque é repetida.",
          ],
        },
      ],
      questions: [
        {
          id: "d1q1",
          kind: "multipla_escolha",
          objective: "Identificar um fato.",
          prompt: "Qual destas afirmações é um fato verificável?",
          options: [
            { id: "a", text: "“A Constituição atual do Brasil é de 1988”" },
            { id: "b", text: "“Essa é a melhor lei de todos os tempos”" },
            { id: "c", text: "“Ano que vem tudo vai melhorar”" },
            { id: "d", text: "“Política é chata”" },
          ],
          correctOptionId: "a",
          explanation:
            "A data da Constituição é verificável — um fato. As demais são opinião ou previsão.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d1q2",
          kind: "multipla_escolha",
          objective: "Identificar uma previsão.",
          prompt: "Qual destas é uma previsão?",
          options: [
            { id: "a", text: "“A inflação vai cair no próximo semestre”" },
            { id: "b", text: "“Hoje choveu na capital”" },
            { id: "c", text: "“O Brasil tem um Distrito Federal”" },
            { id: "d", text: "“A água ferve a 100°C ao nível do mar”" },
          ],
          correctOptionId: "a",
          explanation:
            "Falar do que ainda vai acontecer é uma previsão; as outras são fatos.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d1q3",
          kind: "verdadeiro_falso",
          objective: "Afastar opinião repetida = fato.",
          prompt:
            "Uma opinião se transforma em fato quando é repetida muitas vezes.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Repetição não transforma opinião em fato; fato é o que pode ser verificado.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d1q4",
          kind: "multipla_escolha",
          objective: "Identificar uma opinião.",
          prompt: "Qual destas é uma opinião?",
          options: [
            { id: "a", text: "“Esta é a política mais justa possível”" },
            { id: "b", text: "“O voto no Brasil é secreto”" },
            { id: "c", text: "“Brasília é a capital federal”" },
            { id: "d", text: "“A Câmara e o Senado formam o Congresso”" },
          ],
          correctOptionId: "a",
          explanation:
            "“Mais justa possível” é um juízo de valor — opinião. As demais são fatos verificáveis.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d1q5",
          kind: "verdadeiro_falso",
          objective: "Reconhecer que previsões podem falhar.",
          prompt:
            "Uma previsão, mesmo feita por especialistas, pode não se confirmar.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Previsões lidam com incerteza e podem não se realizar — por isso não são fatos.",
          sourceIds: ["d-letramento"],
        },
      ],
    },
    {
      id: "d2",
      slug: "conferir-a-fonte",
      order: 2,
      title: "Como conferir a fonte de uma afirmação",
      objective: "Aplicar passos simples para checar a origem de uma informação.",
      ...draftMeta,
      sources: [LETRAMENTO],
      teaching: [
        {
          title: "Pergunte: quem disse e com base em quê?",
          body: [
            "Antes de compartilhar, procure a fonte original. Quem afirmou? Com base em qual dado ou documento? A fonte é identificável e confiável?",
          ],
        },
        {
          title: "Sinais de alerta",
          body: [
            "Desconfie de afirmações sem autoria, sem data, com pedido de urgência para compartilhar e sem link para a origem.",
            "RASCUNHO: incluir, em revisão, um passo a passo e exemplos verificados.",
          ],
        },
      ],
      questions: [
        {
          id: "d2q1",
          kind: "multipla_escolha",
          objective: "Priorizar a fonte original.",
          prompt: "Ao receber uma informação importante, o primeiro passo é:",
          options: [
            { id: "a", text: "Procurar a fonte original e verificar quem afirmou" },
            { id: "b", text: "Compartilhar imediatamente" },
            { id: "c", text: "Acreditar porque veio de um conhecido" },
            { id: "d", text: "Ignorar a origem" },
          ],
          correctOptionId: "a",
          explanation:
            "Buscar a fonte original e a autoria é o passo inicial de uma checagem responsável.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d2q2",
          kind: "verdadeiro_falso",
          objective: "Afastar autoridade por proximidade.",
          prompt:
            "Se um amigo compartilhou, a informação já está automaticamente verificada.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. A confiança em quem compartilhou não substitui a checagem da fonte original.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d2q3",
          kind: "multipla_escolha",
          objective: "Reconhecer sinais de alerta.",
          prompt: "Qual destes é um sinal de alerta sobre uma informação?",
          options: [
            { id: "a", text: "Não ter autoria, data nem link para a origem" },
            { id: "b", text: "Citar a fonte oficial e a data" },
            { id: "c", text: "Trazer o documento original" },
            { id: "d", text: "Permitir verificação independente" },
          ],
          correctOptionId: "a",
          explanation:
            "Ausência de autoria, data e origem verificável é um forte sinal de alerta.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d2q4",
          kind: "verdadeiro_falso",
          objective: "Valorizar a fonte primária.",
          prompt:
            "Sempre que possível, é melhor consultar a fonte primária (o documento ou dado original).",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. A fonte primária reduz o risco de distorções de intermediários.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d2q5",
          kind: "multipla_escolha",
          objective: "Agir diante da dúvida.",
          prompt: "Se você não consegue confirmar uma informação, o melhor é:",
          options: [
            { id: "a", text: "Não compartilhar até verificar" },
            { id: "b", text: "Compartilhar com um aviso de que pode ser falso" },
            { id: "c", text: "Compartilhar mesmo assim" },
            { id: "d", text: "Alterar o texto e repassar" },
          ],
          correctOptionId: "a",
          explanation:
            "Na dúvida, não compartilhar evita ajudar a espalhar desinformação.",
          sourceIds: ["d-letramento"],
        },
      ],
    },
    {
      id: "d3",
      slug: "ler-graficos-e-percentuais",
      order: 3,
      title: "Como ler gráficos e percentuais sem se enganar",
      objective: "Identificar armadilhas comuns na leitura de gráficos e percentuais.",
      ...draftMeta,
      sources: [LETRAMENTO],
      teaching: [
        {
          title: "O eixo e a base importam",
          body: [
            "Um gráfico pode exagerar uma diferença se o eixo não começa do zero. E um percentual só faz sentido quando sabemos a base (percentual de quê?).",
          ],
        },
        {
          title: "Correlação não é causa",
          body: [
            "Dois números subirem juntos não prova que um causou o outro. Pode ser coincidência ou efeito de um terceiro fator.",
            "RASCUNHO: incluir, em revisão, exemplos visuais verificados.",
          ],
        },
      ],
      questions: [
        {
          id: "d3q1",
          kind: "verdadeiro_falso",
          objective: "Reconhecer o truque do eixo.",
          prompt:
            "Um gráfico cujo eixo não começa do zero pode exagerar visualmente uma diferença.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Cortar o eixo amplia visualmente diferenças pequenas — uma armadilha comum.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d3q2",
          kind: "multipla_escolha",
          objective: "Entender a base de um percentual.",
          prompt: "“Aumento de 100%” só é informativo se soubermos:",
          options: [
            { id: "a", text: "A base: 100% de qual valor inicial" },
            { id: "b", text: "A cor do gráfico" },
            { id: "c", text: "O nome de quem fez o gráfico" },
            { id: "d", text: "O dia da semana" },
          ],
          correctOptionId: "a",
          explanation:
            "Percentual depende da base: dobrar algo pequeno é diferente de dobrar algo grande.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d3q3",
          kind: "verdadeiro_falso",
          objective: "Distinguir correlação de causalidade.",
          prompt:
            "Se duas coisas aumentam ao mesmo tempo, está provado que uma causou a outra.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Correlação não é causalidade: pode haver coincidência ou um terceiro fator.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d3q4",
          kind: "multipla_escolha",
          objective: "Aplicar leitura crítica.",
          prompt: "Ao ver um gráfico impressionante, uma boa prática é:",
          options: [
            { id: "a", text: "Olhar os eixos, a escala, a base e a fonte" },
            { id: "b", text: "Confiar só na primeira impressão" },
            { id: "c", text: "Ignorar os números" },
            { id: "d", text: "Compartilhar sem ler" },
          ],
          correctOptionId: "a",
          explanation:
            "Verificar eixos, escala, base e fonte evita cair em distorções visuais.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d3q5",
          kind: "multipla_escolha",
          objective: "Reconhecer o papel do terceiro fator.",
          prompt:
            "Vendas de sorvete e casos de insolação sobem no verão. A explicação mais provável é:",
          options: [
            { id: "a", text: "Um terceiro fator (o calor) influencia os dois" },
            { id: "b", text: "Sorvete causa insolação" },
            { id: "c", text: "Insolação faz as pessoas comprarem sorvete" },
            { id: "d", text: "É impossível que subam juntos" },
          ],
          correctOptionId: "a",
          explanation:
            "O calor (terceiro fator) explica os dois — exemplo clássico de correlação sem causalidade direta.",
          sourceIds: ["d-letramento"],
        },
      ],
    },
    {
      id: "d4",
      slug: "avaliar-uma-proposta-politica",
      order: 4,
      title: "Como avaliar uma proposta política",
      objective: "Aplicar critérios para avaliar uma proposta política com isenção.",
      ...draftMeta,
      sources: [LETRAMENTO],
      teaching: [
        {
          title: "Separe o problema da solução",
          body: [
            "Uma proposta tem um problema que quer resolver e um meio para isso. Vale avaliar os dois: o problema é real? O meio é adequado e viável?",
          ],
        },
        {
          title: "Evite avaliar por quem propõe",
          body: [
            "Uma boa avaliação olha o conteúdo, não apenas quem propõe. A mesma ideia não fica melhor ou pior só por causa do autor.",
            "RASCUNHO: incluir, em revisão, um roteiro neutro de avaliação.",
          ],
        },
      ],
      questions: [
        {
          id: "d4q1",
          kind: "multipla_escolha",
          objective: "Avaliar conteúdo, não autor.",
          prompt: "Ao avaliar uma proposta, uma atitude isenta é:",
          options: [
            { id: "a", text: "Analisar o conteúdo, não só quem propõe" },
            { id: "b", text: "Aprovar porque gosta do autor" },
            { id: "c", text: "Rejeitar porque não gosta do autor" },
            { id: "d", text: "Decidir no cara ou coroa" },
          ],
          correctOptionId: "a",
          explanation:
            "Julgar pelo conteúdo, e não pelo autor, é mais justo e preciso.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d4q2",
          kind: "multipla_escolha",
          objective: "Separar problema e solução.",
          prompt: "Avaliar uma proposta envolve perguntar:",
          options: [
            { id: "a", text: "O problema é real e o meio proposto é adequado?" },
            { id: "b", text: "O autor é simpático?" },
            { id: "c", text: "A proposta tem muitas curtidas?" },
            { id: "d", text: "O texto é bonito?" },
          ],
          correctOptionId: "a",
          explanation:
            "Separar o problema (é real?) do meio (é adequado/viável?) organiza a avaliação.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d4q3",
          kind: "verdadeiro_falso",
          objective: "Reconhecer efeitos colaterais.",
          prompt:
            "Uma proposta pode ter efeitos colaterais que também precisam ser avaliados.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Além do efeito desejado, convém pensar em consequências não intencionais.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d4q4",
          kind: "verdadeiro_falso",
          objective: "Afastar o argumento de autoridade indevido.",
          prompt:
            "Uma ideia fica automaticamente correta porque uma pessoa famosa a defende.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Fama não garante acerto; o que importa é a qualidade do argumento e das evidências.",
          sourceIds: ["d-letramento"],
        },
        {
          id: "d4q5",
          kind: "multipla_escolha",
          objective: "Valorizar viabilidade e evidência.",
          prompt: "Uma proposta mais sólida costuma apresentar:",
          options: [
            { id: "a", text: "Diagnóstico do problema, meio viável e evidência" },
            { id: "b", text: "Apenas slogans" },
            { id: "c", text: "Ataques ao adversário" },
            { id: "d", text: "Promessas sem custo nem prazo" },
          ],
          correctOptionId: "a",
          explanation:
            "Diagnóstico, viabilidade e evidência tornam uma proposta mais avaliável e sólida.",
          sourceIds: ["d-letramento"],
        },
      ],
    },
    {
      id: "d5",
      slug: "participacao-alem-do-voto",
      order: 5,
      title: "Formas de participação além do voto",
      objective: "Conhecer formas de participação previstas além do voto.",
      ...draftMeta,
      sources: [CF_PARTICIPACAO],
      teaching: [
        {
          title: "O voto é o começo",
          body: [
            "A Constituição (Art. 14) diz que a soberania popular é exercida pelo voto e também por plebiscito, referendo e iniciativa popular.",
            "Além desses, há conselhos, audiências públicas, ouvidorias e o acompanhamento do orçamento.",
          ],
        },
        {
          title: "Participar o ano todo",
          body: [
            "A democracia não se resume ao dia da eleição. Participar ao longo do mandato ajuda a melhorar e cobrar decisões.",
            "RASCUNHO: confirmar, em revisão, os requisitos atuais de cada instrumento na fonte oficial.",
          ],
        },
      ],
      questions: [
        {
          id: "d5q1",
          kind: "multipla_escolha",
          objective: "Listar instrumentos do Art. 14.",
          prompt:
            "Segundo o Art. 14 da Constituição, além do voto, a soberania popular inclui:",
          options: [
            { id: "a", text: "Plebiscito, referendo e iniciativa popular" },
            { id: "b", text: "Apenas o voto, e nada mais" },
            { id: "c", text: "Sorteio de cargos" },
            { id: "d", text: "Compra de votos" },
          ],
          correctOptionId: "a",
          explanation:
            "O Art. 14 cita plebiscito, referendo e iniciativa popular como formas de exercer a soberania popular, além do voto.",
          sourceIds: ["cf88-participacao"],
        },
        {
          id: "d5q2",
          kind: "verdadeiro_falso",
          objective: "Afastar a ideia de participação só na eleição.",
          prompt:
            "A participação política só é possível no dia da eleição.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Há diversas formas de participar ao longo do mandato, como audiências, conselhos e ouvidorias.",
          sourceIds: ["cf88-participacao"],
        },
        {
          id: "d5q3",
          kind: "multipla_escolha",
          objective: "Reconhecer um canal de participação local.",
          prompt: "Um conselho municipal de saúde é um exemplo de:",
          options: [
            { id: "a", text: "Canal de participação na gestão pública" },
            { id: "b", text: "Partido político" },
            { id: "c", text: "Tribunal" },
            { id: "d", text: "Emissora de TV" },
          ],
          correctOptionId: "a",
          explanation:
            "Conselhos permitem à sociedade participar do acompanhamento e da formulação de políticas.",
          sourceIds: ["cf88-participacao"],
        },
        {
          id: "d5q4",
          kind: "verdadeiro_falso",
          objective: "Valorizar o acompanhamento contínuo.",
          prompt:
            "Acompanhar o orçamento e cobrar serviços é uma forma de participação.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Acompanhar e cobrar são formas legítimas e importantes de participação.",
          sourceIds: ["cf88-participacao"],
        },
        {
          id: "d5q5",
          kind: "multipla_escolha",
          objective: "Diferenciar plebiscito de referendo (noção geral).",
          prompt:
            "Plebiscito e referendo são consultas à população. Uma diferença geral é que:",
          options: [
            { id: "a", text: "O plebiscito costuma ser prévio e o referendo, posterior a um ato" },
            { id: "b", text: "São a mesma coisa com nomes diferentes" },
            { id: "c", text: "Ambos substituem a Constituição" },
            { id: "d", text: "Nenhum envolve a população" },
          ],
          correctOptionId: "a",
          explanation:
            "Em termos gerais, o plebiscito consulta antes de um ato e o referendo o confirma depois. (Rascunho: confirmar detalhes na fonte oficial.)",
          sourceIds: ["cf88-participacao"],
        },
      ],
    },
  ],
};

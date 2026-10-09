import type { LearningPath, Source } from "@/lib/content/types";

/**
 * Trilha B — Ideias e debates. Complete DRAFT (rascunho), Premium.
 *
 * These lessons deal with interpretive concepts (ideologies). They present
 * different currents honestly, without ranking beliefs or pushing any side.
 * Per the spec, interpretive content needs academic references added during
 * editorial review — this is flagged explicitly and the lessons stay as drafts
 * until an administrator verifies and publishes them.
 */

const CF_PLURALISMO: Source = {
  id: "cf88-pluralismo",
  title: "Constituição de 1988 — Art. 1º (fundamentos: cidadania, pluralismo político)",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  consultedAt: "2026-10-09",
  excerpt: "Art. 1º, incisos II (cidadania) e V (pluralismo político).",
  nature: "fato_institucional",
};

const PENDENCIA_ACADEMICA: Source = {
  id: "b-pendencia-academica",
  title: "Pendência: referências acadêmicas sobre ideologias (a adicionar em revisão)",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  consultedAt: "2026-10-09",
  excerpt:
    "RASCUNHO: substituir por referências acadêmicas revisadas sobre ideologias e conceitos políticos antes de publicar. A URL atual é apenas um marcador oficial provisório.",
  nature: "conceito_interpretativo",
};

const draftMeta = {
  plan: "premium" as const,
  status: "rascunho" as const,
  version: 1,
  revisedAt: "2026-10-09",
};

export const trailB: LearningPath = {
  id: "trilha-b",
  slug: "ideias-e-debates",
  order: 2,
  title: "Ideias e debates",
  description:
    "O vocabulário dos debates: ideologias, os eixos esquerda–direita, correntes econômicas e sociais, e o lugar do pluralismo.",
  lessons: [
    {
      id: "b1",
      slug: "o-que-sao-ideologias",
      order: 1,
      title: "O que são ideologias políticas",
      objective:
        "Compreender ideologia como um conjunto de ideias sobre como a sociedade deve se organizar.",
      ...draftMeta,
      sources: [PENDENCIA_ACADEMICA],
      teaching: [
        {
          title: "Um mapa de ideias",
          body: [
            "Ideologia política é um conjunto organizado de ideias sobre como a sociedade deveria funcionar: o papel do Estado, da liberdade, da igualdade e da tradição.",
            "Ideologias não são torcidas: são tentativas de responder perguntas difíceis. Pessoas sérias e bem-intencionadas discordam.",
          ],
        },
        {
          title: "Para que serve entender isso",
          body: [
            "Reconhecer ideologias ajuda a entender por que pessoas chegam a conclusões diferentes a partir dos mesmos fatos.",
            "RASCUNHO: adicionar, em revisão, referências acadêmicas e exemplos equilibrados de diferentes correntes.",
          ],
        },
      ],
      questions: [
        {
          id: "b1q1",
          kind: "multipla_escolha",
          objective: "Definir ideologia.",
          prompt: "Ideologia política é, em termos simples:",
          options: [
            { id: "a", text: "Um conjunto de ideias sobre como a sociedade deve se organizar" },
            { id: "b", text: "Um time para o qual se torce" },
            { id: "c", text: "Uma lei aprovada pelo Congresso" },
            { id: "d", text: "Um documento de identidade" },
          ],
          correctOptionId: "a",
          explanation:
            "Ideologia é um conjunto articulado de ideias sobre a organização da sociedade — não uma torcida nem uma lei.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b1q2",
          kind: "verdadeiro_falso",
          objective: "Afastar o julgamento de crenças como certas/erradas por si.",
          prompt:
            "Uma boa educação política deve dizer qual ideologia é a correta para todos.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. O objetivo é compreender as diferentes correntes com honestidade, não eleger uma como “certa” para todos.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b1q3",
          kind: "multipla_escolha",
          objective: "Reconhecer que ideologias tratam de valores em tensão.",
          prompt:
            "Ideologias costumam divergir sobre o equilíbrio entre valores como:",
          options: [
            { id: "a", text: "Liberdade, igualdade, tradição e o papel do Estado" },
            { id: "b", text: "Marcas de celular" },
            { id: "c", text: "Resultados de futebol" },
            { id: "d", text: "Gostos musicais" },
          ],
          correctOptionId: "a",
          explanation:
            "As correntes divergem em como equilibrar liberdade, igualdade, tradição e o tamanho e papel do Estado.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b1q4",
          kind: "verdadeiro_falso",
          objective: "Entender que pessoas podem discordar de boa-fé.",
          prompt:
            "Pessoas bem-informadas podem discordar sobre questões políticas e ainda assim agir de boa-fé.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. A partir dos mesmos fatos, valores diferentes levam a conclusões diferentes — sem que isso signifique má-fé.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b1q5",
          kind: "multipla_escolha",
          objective: "Distinguir fato de posição ideológica.",
          prompt:
            "Qual destas é uma afirmação ideológica (de valor), e não um fato verificável?",
          options: [
            { id: "a", text: "“O Estado deveria ter um papel menor na economia”" },
            { id: "b", text: "“O Brasil tem 26 estados e um Distrito Federal”" },
            { id: "c", text: "“A Constituição atual é de 1988”" },
            { id: "d", text: "“Brasília é a capital federal”" },
          ],
          correctOptionId: "a",
          explanation:
            "A primeira é uma posição de valor (ideológica). As outras são fatos verificáveis.",
          sourceIds: ["b-pendencia-academica"],
        },
      ],
    },
    {
      id: "b2",
      slug: "esquerda-direita-centro",
      order: 2,
      title: "Esquerda, direita e centro: contexto e limites",
      objective:
        "Entender os rótulos esquerda, direita e centro como aproximações úteis, mas limitadas.",
      ...draftMeta,
      sources: [PENDENCIA_ACADEMICA],
      teaching: [
        {
          title: "Rótulos são atalhos",
          body: [
            "“Esquerda” e “direita” nasceram como uma forma de agrupar posições. São atalhos úteis, mas imperfeitos: uma mesma pessoa pode ter posições de “esquerda” em um tema e de “direita” em outro.",
            "RASCUNHO: incluir, em revisão, a origem histórica dos termos com fonte acadêmica.",
          ],
        },
        {
          title: "Cuidado com caricaturas",
          body: [
            "Reduzir alguém a um rótulo costuma empobrecer o debate. É melhor perguntar o que a pessoa defende em cada tema do que supor tudo a partir de uma etiqueta.",
          ],
        },
      ],
      questions: [
        {
          id: "b2q1",
          kind: "verdadeiro_falso",
          objective: "Reconhecer o limite dos rótulos.",
          prompt:
            "Os rótulos “esquerda” e “direita” descrevem perfeitamente todas as posições de uma pessoa.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. São aproximações: uma pessoa pode combinar posições associadas a lados diferentes conforme o tema.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b2q2",
          kind: "multipla_escolha",
          objective: "Entender para que servem os rótulos.",
          prompt: "Os termos esquerda, direita e centro servem melhor como:",
          options: [
            { id: "a", text: "Atalhos aproximados para agrupar posições" },
            { id: "b", text: "Classificações exatas e definitivas" },
            { id: "c", text: "Insultos" },
            { id: "d", text: "Cargos públicos" },
          ],
          correctOptionId: "a",
          explanation:
            "Funcionam como atalhos aproximados; não são classificações exatas nem ofensas.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b2q3",
          kind: "multipla_escolha",
          objective: "Praticar olhar por tema.",
          prompt:
            "Uma forma mais precisa de entender a posição de alguém é:",
          options: [
            { id: "a", text: "Perguntar o que defende em cada tema concreto" },
            { id: "b", text: "Supor tudo a partir de um único rótulo" },
            { id: "c", text: "Olhar só a aparência" },
            { id: "d", text: "Ignorar o que a pessoa diz" },
          ],
          correctOptionId: "a",
          explanation:
            "Perguntar posição por posição evita caricaturas e aproxima da realidade das ideias de cada pessoa.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b2q4",
          kind: "verdadeiro_falso",
          objective: "Reconhecer que o significado dos rótulos varia.",
          prompt:
            "O que se entende por “esquerda” ou “direita” pode variar conforme o país e a época.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. O conteúdo desses rótulos muda com o contexto histórico e geográfico.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b2q5",
          kind: "multipla_escolha",
          objective: "Evitar a falácia do rótulo.",
          prompt:
            "Chamar um argumento de “coisa de esquerda” ou “de direita” para não respondê-lo é:",
          options: [
            { id: "a", text: "Uma forma de desviar do mérito do argumento" },
            { id: "b", text: "Uma prova de que o argumento é falso" },
            { id: "c", text: "Uma análise rigorosa" },
            { id: "d", text: "Um dado estatístico" },
          ],
          correctOptionId: "a",
          explanation:
            "Rotular para não responder desvia do mérito — não prova nada sobre a qualidade do argumento.",
          sourceIds: ["b-pendencia-academica"],
        },
      ],
    },
    {
      id: "b3",
      slug: "liberalismo-e-conservadorismo",
      order: 3,
      title: "Liberalismo e conservadorismo: dimensões econômica e social",
      objective:
        "Diferenciar as dimensões econômica e social ao falar de liberalismo e conservadorismo.",
      ...draftMeta,
      sources: [PENDENCIA_ACADEMICA],
      teaching: [
        {
          title: "Duas dimensões diferentes",
          body: [
            "É comum confundir a dimensão econômica (quanto o Estado deve intervir na economia) com a dimensão social/comportamental (quanto a sociedade deve preservar tradições ou ampliar mudanças).",
            "Uma pessoa pode ser liberal na economia e conservadora nos costumes — ou qualquer outra combinação.",
          ],
        },
        {
          title: "Por que separar ajuda",
          body: [
            "Separar as dimensões evita confusões e caricaturas, e torna o debate mais honesto.",
            "RASCUNHO: incluir definições acadêmicas revisadas de liberalismo e conservadorismo.",
          ],
        },
      ],
      questions: [
        {
          id: "b3q1",
          kind: "multipla_escolha",
          objective: "Identificar a dimensão econômica.",
          prompt:
            "A pergunta “quanto o Estado deve intervir na economia?” pertence à dimensão:",
          options: [
            { id: "a", text: "Econômica" },
            { id: "b", text: "Social/comportamental" },
            { id: "c", text: "Esportiva" },
            { id: "d", text: "Religiosa apenas" },
          ],
          correctOptionId: "a",
          explanation:
            "Trata-se da dimensão econômica: o grau de intervenção do Estado na economia.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b3q2",
          kind: "verdadeiro_falso",
          objective: "Entender que as dimensões podem se combinar.",
          prompt:
            "Uma pessoa pode ter posições liberais na economia e conservadoras nos costumes ao mesmo tempo.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. As dimensões são independentes e podem se combinar de várias formas.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b3q3",
          kind: "multipla_escolha",
          objective: "Identificar a dimensão social.",
          prompt:
            "Debates sobre costumes e tradições pertencem principalmente à dimensão:",
          options: [
            { id: "a", text: "Social/comportamental" },
            { id: "b", text: "Econômica" },
            { id: "c", text: "Monetária" },
            { id: "d", text: "Tributária" },
          ],
          correctOptionId: "a",
          explanation:
            "Costumes e tradições são tema da dimensão social/comportamental, distinta da econômica.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b3q4",
          kind: "verdadeiro_falso",
          objective: "Afastar a confusão entre as dimensões.",
          prompt:
            "Ser liberal na economia significa necessariamente ser liberal também nos costumes.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. São dimensões diferentes; uma não implica a outra.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b3q5",
          kind: "multipla_escolha",
          objective: "Aplicar a separação de dimensões.",
          prompt:
            "Separar a dimensão econômica da social ajuda principalmente a:",
          options: [
            { id: "a", text: "Evitar caricaturas e debater com mais honestidade" },
            { id: "b", text: "Provar que uma ideologia é superior" },
            { id: "c", text: "Eliminar o desacordo" },
            { id: "d", text: "Definir o resultado de eleições" },
          ],
          correctOptionId: "a",
          explanation:
            "A separação deixa o debate mais preciso e honesto; não serve para coroar uma ideologia nem acabar com o desacordo.",
          sourceIds: ["b-pendencia-academica"],
        },
      ],
    },
    {
      id: "b4",
      slug: "social-democracia-e-socialismo",
      order: 4,
      title: "Social-democracia e socialismo: conceitos e variações",
      objective:
        "Distinguir, em termos gerais, social-democracia e socialismo e suas variações.",
      ...draftMeta,
      sources: [PENDENCIA_ACADEMICA],
      teaching: [
        {
          title: "Famílias de ideias",
          body: [
            "“Social-democracia” e “socialismo” são famílias amplas de ideias, com muitas variações. Em linhas gerais, discutem o papel do Estado na redução de desigualdades e na organização da economia.",
            "RASCUNHO: definir com precisão, em revisão, cada termo com fontes acadêmicas, evitando generalizações.",
          ],
        },
        {
          title: "Evitar simplificações",
          body: [
            "Esses termos foram usados de formas muito diferentes ao longo da história. Vale desconfiar de definições que colocam tudo no mesmo saco.",
          ],
        },
      ],
      questions: [
        {
          id: "b4q1",
          kind: "verdadeiro_falso",
          objective: "Reconhecer a amplitude dos termos.",
          prompt:
            "“Socialismo” sempre significou exatamente a mesma coisa em todos os países e épocas.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. É uma família ampla de ideias, usada de formas diferentes ao longo da história.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b4q2",
          kind: "multipla_escolha",
          objective: "Entender o tema comum dessas correntes.",
          prompt:
            "Em geral, essas correntes debatem, entre outras coisas:",
          options: [
            { id: "a", text: "O papel do Estado na redução de desigualdades" },
            { id: "b", text: "O calendário de feriados" },
            { id: "c", text: "As regras do futebol" },
            { id: "d", text: "A cor das cédulas de dinheiro" },
          ],
          correctOptionId: "a",
          explanation:
            "Um tema central é o papel do Estado diante das desigualdades e da organização econômica.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b4q3",
          kind: "verdadeiro_falso",
          objective: "Valorizar a precisão conceitual.",
          prompt:
            "É prudente desconfiar de definições que tratam correntes muito diferentes como se fossem idênticas.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Generalizar demais apaga diferenças importantes e atrapalha o entendimento.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b4q4",
          kind: "multipla_escolha",
          objective: "Reconhecer variações internas.",
          prompt:
            "Dentro de uma mesma família ideológica, é esperado encontrar:",
          options: [
            { id: "a", text: "Variações e divergências internas" },
            { id: "b", text: "Opinião única e idêntica de todos" },
            { id: "c", text: "Ausência total de debate" },
            { id: "d", text: "Uma lei obrigatória de pensamento" },
          ],
          correctOptionId: "a",
          explanation:
            "Famílias ideológicas têm correntes internas que divergem entre si.",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b4q5",
          kind: "multipla_escolha",
          objective: "Praticar honestidade na comparação.",
          prompt:
            "Ao comparar correntes diferentes, uma postura honesta é:",
          options: [
            { id: "a", text: "Apresentar a versão mais forte de cada uma, sem distorcer" },
            { id: "b", text: "Mostrar só a pior versão da que você não gosta" },
            { id: "c", text: "Inventar dados para vencer" },
            { id: "d", text: "Ignorar as diferenças" },
          ],
          correctOptionId: "a",
          explanation:
            "Comparar de forma honesta é apresentar o melhor argumento de cada lado, sem criar espantalhos.",
          sourceIds: ["b-pendencia-academica"],
        },
      ],
    },
    {
      id: "b5",
      slug: "patriotismo-nacionalismo-pluralismo",
      order: 5,
      title: "Patriotismo, nacionalismo e pluralismo",
      objective:
        "Distinguir patriotismo, nacionalismo e pluralismo e reconhecer o pluralismo como fundamento constitucional.",
      ...draftMeta,
      sources: [CF_PLURALISMO, PENDENCIA_ACADEMICA],
      teaching: [
        {
          title: "Palavras próximas, sentidos diferentes",
          body: [
            "Patriotismo costuma ser descrito como apego ao país e ao bem comum. Nacionalismo é um termo mais amplo, com usos diversos — de defesa da soberania a formas excludentes, dependendo do contexto.",
            "RASCUNHO: detalhar, em revisão, as diferentes acepções com fontes acadêmicas.",
          ],
        },
        {
          title: "Pluralismo é regra no Brasil",
          body: [
            "A Constituição de 1988 coloca o “pluralismo político” entre os fundamentos da República (Art. 1º, V). Ou seja: conviver com a diversidade de ideias é parte das regras do jogo.",
          ],
        },
      ],
      questions: [
        {
          id: "b5q1",
          kind: "multipla_escolha",
          objective: "Identificar o pluralismo como fundamento da CF/88.",
          prompt:
            "Segundo a Constituição de 1988, o pluralismo político é:",
          options: [
            { id: "a", text: "Um dos fundamentos da República" },
            { id: "b", text: "Algo proibido por lei" },
            { id: "c", text: "Um imposto" },
            { id: "d", text: "Um cargo público" },
          ],
          correctOptionId: "a",
          explanation:
            "O Art. 1º, inciso V, lista o pluralismo político entre os fundamentos da República.",
          sourceIds: ["cf88-pluralismo"],
        },
        {
          id: "b5q2",
          kind: "verdadeiro_falso",
          objective: "Entender pluralismo como convivência de ideias.",
          prompt:
            "Pluralismo político significa aceitar a convivência de diferentes ideias e grupos.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Pluralismo é justamente a convivência legítima de ideias e grupos diversos.",
          sourceIds: ["cf88-pluralismo"],
        },
        {
          id: "b5q3",
          kind: "multipla_escolha",
          objective: "Distinguir patriotismo de nacionalismo.",
          prompt:
            "Uma diferença comum apontada entre os termos é que:",
          options: [
            { id: "a", text: "“Nacionalismo” é usado em sentidos mais variados conforme o contexto" },
            { id: "b", text: "“Patriotismo” é um tipo de imposto" },
            { id: "c", text: "Os dois significam exatamente a mesma coisa sempre" },
            { id: "d", text: "Nenhum tem relação com o país" },
          ],
          correctOptionId: "a",
          explanation:
            "“Nacionalismo” aparece em sentidos bem distintos conforme o contexto; não é idêntico a patriotismo. (Rascunho: detalhar em revisão.)",
          sourceIds: ["b-pendencia-academica"],
        },
        {
          id: "b5q4",
          kind: "verdadeiro_falso",
          objective: "Afastar a ideia de pensamento único.",
          prompt:
            "Em um país pluralista, espera-se que todos tenham exatamente a mesma opinião política.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Pluralismo pressupõe diversidade de opiniões convivendo sob as mesmas regras.",
          sourceIds: ["cf88-pluralismo"],
        },
        {
          id: "b5q5",
          kind: "multipla_escolha",
          objective: "Relacionar pluralismo e democracia.",
          prompt:
            "O respeito ao pluralismo é importante para a democracia porque:",
          options: [
            { id: "a", text: "Permite resolver desacordos por meios pacíficos e legítimos" },
            { id: "b", text: "Obriga todos a concordarem" },
            { id: "c", text: "Elimina o debate" },
            { id: "d", text: "Impede eleições" },
          ],
          correctOptionId: "a",
          explanation:
            "O pluralismo permite que desacordos sejam resolvidos por meios pacíficos e institucionais — um pilar da democracia.",
          sourceIds: ["cf88-pluralismo"],
        },
      ],
    },
  ],
};

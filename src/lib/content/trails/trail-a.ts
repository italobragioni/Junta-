import type { LearningPath, Source } from "@/lib/content/types";

/**
 * Trilha A — Como o Brasil funciona.
 *
 * Lessons A1–A3 are PUBLISHED and anchored on stable constitutional facts
 * (CF/88 Arts. 1º, 2º and 18), with the official Planalto source. As the spec
 * requires, this seed is a reviewable demonstration: the owner must do final
 * editorial verification and can archive any lesson from the admin panel.
 *
 * Lessons A4–A5 are complete DRAFTS (rascunho): real, but not shown to
 * learners until an administrator verifies the sources and publishes them.
 */

const CF88: Source = {
  id: "cf88",
  title: "Constituição da República Federativa do Brasil de 1988 (texto oficial)",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  consultedAt: "2026-10-09",
  excerpt:
    "Art. 1º, parágrafo único; Art. 2º; Art. 18, caput; Título IV (Da Organização dos Poderes).",
  nature: "fato_institucional",
};

const CAMARA_PROC: Source = {
  id: "camara-processo",
  title: "Câmara dos Deputados — Entenda o processo legislativo",
  url: "https://www.camara.leg.br/entenda-o-processo-legislativo/",
  consultedAt: "2026-10-09",
  excerpt:
    "Apresentação do projeto, análise nas comissões, votação em Plenário, revisão pela outra Casa, sanção/veto e publicação.",
  nature: "fato_institucional",
};

const SENADO_LEIS: Source = {
  id: "senado-leis",
  title: "Senado Federal — Como são feitas as leis",
  url: "https://www12.senado.leg.br/jovemsenador/home/paginas/como-sao-feitas-as-leis",
  consultedAt: "2026-10-09",
  excerpt:
    "Iniciativa, exame nas comissões, pareceres, dinâmica entre Câmara e Senado e envio para sanção presidencial.",
  nature: "fato_institucional",
};

export const trailA: LearningPath = {
  id: "trilha-a",
  slug: "como-o-brasil-funciona",
  order: 1,
  title: "Como o Brasil funciona",
  description:
    "Os fundamentos: o que é política, os três Poderes, os entes federativos, como nasce uma lei e como cobrar quem nos representa.",
  lessons: [
    // ---------------------------------------------------------------- A1
    {
      id: "a1",
      slug: "o-que-e-politica",
      order: 1,
      title: "O que é política e onde ela aparece na sua vida",
      objective:
        "Reconhecer política como a forma de tomar decisões coletivas e identificar onde ela aparece no dia a dia.",
      plan: "free",
      status: "publicado",
      version: 1,
      revisedAt: "2026-10-09",
      sources: [CF88],
      teaching: [
        {
          title: "Política é decidir junto",
          body: [
            "Política é o conjunto de processos pelos quais um grupo de pessoas toma decisões que valem para todos: quanto se paga de imposto, como funciona a escola pública, quem pode dirigir e com quais regras.",
            "Ela não acontece só em Brasília. Aparece quando o seu bairro decide onde fica a creche, quando a prefeitura define o trajeto do ônibus e quando o país escolhe suas prioridades.",
          ],
        },
        {
          title: "De onde vem o poder",
          body: [
            "No Brasil, a Constituição de 1988 diz que “todo o poder emana do povo, que o exerce por meio de representantes eleitos ou diretamente” (Art. 1º, parágrafo único).",
            "Isso significa que você participa de duas formas: elegendo representantes (voto) e participando diretamente (por exemplo, em conselhos, audiências públicas e iniciativa popular).",
          ],
        },
        {
          title: "Por que isso te afeta",
          body: [
            "Entender política ajuda a avaliar notícias, cobrar serviços e decidir melhor. Não é sobre torcer por um time: é sobre compreender regras que afetam o seu bolso, sua saúde e seu tempo.",
          ],
        },
      ],
      questions: [
        {
          id: "a1q1",
          kind: "multipla_escolha",
          objective: "Definir política como decisão coletiva.",
          prompt:
            "Qual frase descreve melhor o que é política, no sentido tratado nesta lição?",
          options: [
            { id: "a", text: "Um esporte em que se torce por um partido" },
            {
              id: "b",
              text: "O processo de tomar decisões que valem para toda a coletividade",
            },
            { id: "c", text: "Apenas o que acontece no Congresso Nacional" },
            { id: "d", text: "Uma opinião pessoal que não afeta os outros" },
          ],
          correctOptionId: "b",
          explanation:
            "Política é o processo de decidir coletivamente regras e prioridades que valem para todos — bem além de torcida ou do que ocorre só no Congresso.",
          sourceIds: ["cf88"],
        },
        {
          id: "a1q2",
          kind: "verdadeiro_falso",
          objective: "Identificar a origem do poder segundo a CF/88.",
          prompt:
            "Segundo a Constituição de 1988, todo o poder emana do povo, que o exerce por representantes eleitos ou diretamente.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "É o que diz o parágrafo único do Art. 1º da Constituição: o poder vem do povo, exercido por representantes eleitos ou diretamente.",
          sourceIds: ["cf88"],
        },
        {
          id: "a1q3",
          kind: "multipla_escolha",
          objective: "Reconhecer política no cotidiano.",
          prompt:
            "Qual destas situações é um exemplo de política aparecendo no dia a dia?",
          options: [
            { id: "a", text: "A prefeitura decidir o trajeto de uma linha de ônibus" },
            { id: "b", text: "Escolher a cor de uma camiseta para você" },
            { id: "c", text: "Decidir a senha do seu celular" },
            { id: "d", text: "Trocar o horário do seu despertador" },
          ],
          correctOptionId: "a",
          explanation:
            "Definir o trajeto de um ônibus é uma decisão pública que afeta muitas pessoas — política no cotidiano. As demais são escolhas estritamente individuais.",
          sourceIds: ["cf88"],
        },
        {
          id: "a1q4",
          kind: "multipla_escolha",
          objective: "Distinguir participação direta e representativa.",
          prompt:
            "Participar “diretamente” da política, e não só por representantes, inclui, por exemplo:",
          options: [
            { id: "a", text: "Participar de uma audiência pública ou de iniciativa popular" },
            { id: "b", text: "Assistir a um debate pela TV sem agir" },
            { id: "c", text: "Pagar uma conta de luz" },
            { id: "d", text: "Seguir um político nas redes sociais" },
          ],
          correctOptionId: "a",
          explanation:
            "Audiências públicas, conselhos e iniciativa popular são formas de participação direta previstas no nosso sistema. Assistir ou seguir alguém não é, por si só, participar da decisão.",
          sourceIds: ["cf88"],
        },
        {
          id: "a1q5",
          kind: "verdadeiro_falso",
          objective: "Afastar a ideia de que política só ocorre em eleição.",
          prompt:
            "Política só existe durante o período de eleições.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Eleições são um momento importante, mas decisões coletivas acontecem o tempo todo: no orçamento, nos serviços públicos e nas regras do dia a dia.",
          sourceIds: ["cf88"],
        },
      ],
    },

    // ---------------------------------------------------------------- A2
    {
      id: "a2",
      slug: "tres-poderes",
      order: 2,
      title: "Executivo, Legislativo e Judiciário",
      objective:
        "Distinguir as funções dos três Poderes e entender por que eles são independentes e harmônicos.",
      plan: "premium",
      status: "publicado",
      version: 1,
      revisedAt: "2026-10-09",
      sources: [CF88],
      teaching: [
        {
          title: "Três funções, um Estado",
          body: [
            "Para evitar que uma só pessoa concentre todo o poder, o Estado brasileiro divide o trabalho em três Poderes. A Constituição diz, no Art. 2º: “São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário”.",
          ],
        },
        {
          title: "O que cada um faz",
          body: [
            "Legislativo: faz as leis e fiscaliza (Câmara dos Deputados e Senado, no nível federal).",
            "Executivo: administra o país e executa as leis (Presidente, governadores e prefeitos, com seus ministérios e secretarias).",
            "Judiciário: julga conflitos e aplica as leis a casos concretos (juízes e tribunais).",
          ],
        },
        {
          title: "Independentes e harmônicos",
          body: [
            "“Independentes”: nenhum manda nos outros. “Harmônicos”: eles se controlam mutuamente (os chamados freios e contrapesos). Por exemplo, o Legislativo aprova uma lei, o Executivo pode vetá-la e o Judiciário pode analisar se ela respeita a Constituição.",
          ],
        },
      ],
      questions: [
        {
          id: "a2q1",
          kind: "multipla_escolha",
          objective: "Associar função ao Poder correto.",
          prompt: "Qual Poder tem como função típica elaborar as leis?",
          options: [
            { id: "a", text: "O Executivo" },
            { id: "b", text: "O Legislativo" },
            { id: "c", text: "O Judiciário" },
            { id: "d", text: "O Ministério Público" },
          ],
          correctOptionId: "b",
          explanation:
            "Elaborar leis é a função típica do Legislativo (Câmara e Senado, no nível federal). O Executivo administra; o Judiciário julga.",
          sourceIds: ["cf88"],
        },
        {
          id: "a2q2",
          kind: "multipla_escolha",
          objective: "Identificar a função do Executivo.",
          prompt:
            "Prefeitos, governadores e o Presidente da República integram qual Poder?",
          options: [
            { id: "a", text: "Legislativo" },
            { id: "b", text: "Judiciário" },
            { id: "c", text: "Executivo" },
            { id: "d", text: "Nenhum: são um quarto Poder" },
          ],
          correctOptionId: "c",
          explanation:
            "Prefeitos, governadores e Presidente chefiam o Executivo em cada nível de governo — o Poder que administra e executa as leis.",
          sourceIds: ["cf88"],
        },
        {
          id: "a2q3",
          kind: "verdadeiro_falso",
          objective: "Compreender a independência entre Poderes.",
          prompt:
            "Segundo o Art. 2º da Constituição, os três Poderes são independentes e harmônicos entre si.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Exatamente o texto do Art. 2º: Legislativo, Executivo e Judiciário são independentes e harmônicos entre si.",
          sourceIds: ["cf88"],
        },
        {
          id: "a2q4",
          kind: "multipla_escolha",
          objective: "Reconhecer a função do Judiciário.",
          prompt: "A função típica do Judiciário é:",
          options: [
            { id: "a", text: "Julgar conflitos e aplicar as leis a casos concretos" },
            { id: "b", text: "Arrecadar impostos" },
            { id: "c", text: "Aprovar o orçamento da União" },
            { id: "d", text: "Nomear ministros de Estado" },
          ],
          correctOptionId: "a",
          explanation:
            "O Judiciário julga conflitos e aplica a lei a casos concretos. Arrecadar e executar o orçamento são tarefas do Executivo; aprovar o orçamento é do Legislativo.",
          sourceIds: ["cf88"],
        },
        {
          id: "a2q5",
          kind: "multipla_escolha",
          objective: "Entender freios e contrapesos.",
          prompt:
            "O mecanismo de “freios e contrapesos” entre os Poderes serve principalmente para:",
          options: [
            {
              id: "a",
              text: "Garantir que nenhum Poder concentre controle absoluto, pois um limita o outro",
            },
            { id: "b", text: "Deixar o Judiciário acima dos demais" },
            { id: "c", text: "Permitir que o Executivo faça leis sozinho" },
            { id: "d", text: "Acabar com a necessidade de eleições" },
          ],
          correctOptionId: "a",
          explanation:
            "Freios e contrapesos distribuem o controle: cada Poder tem meios de limitar os outros, evitando a concentração de poder. Nenhum fica acima dos demais.",
          sourceIds: ["cf88"],
        },
      ],
    },

    // ---------------------------------------------------------------- A3
    {
      id: "a3",
      slug: "uniao-estados-municipios",
      order: 3,
      title: "União, estados e municípios",
      objective:
        "Entender a organização federativa do Brasil e de quem é a responsabilidade por cada serviço público.",
      plan: "premium",
      status: "publicado",
      version: 1,
      revisedAt: "2026-10-09",
      sources: [CF88],
      teaching: [
        {
          title: "Um país em três níveis",
          body: [
            "O Brasil é uma federação. A Constituição (Art. 18) diz que a organização político-administrativa “compreende a União, os Estados, o Distrito Federal e os Municípios, todos autônomos”.",
            "“Autônomos” quer dizer que cada nível tem seu próprio governo, suas leis e suas competências — dentro dos limites da Constituição.",
          ],
        },
        {
          title: "Quem cuida de quê",
          body: [
            "União: assuntos nacionais, como defesa, moeda e relações com outros países.",
            "Estados e Distrito Federal: temas regionais, como a polícia militar e parte da educação e da saúde.",
            "Municípios: o dia a dia local, como transporte urbano, coleta de lixo e a educação infantil.",
            "Muitas áreas são compartilhadas: saúde e educação, por exemplo, envolvem os três níveis.",
          ],
        },
        {
          title: "Por que isso importa",
          body: [
            "Saber de quem é a responsabilidade ajuda a cobrar a pessoa certa. Um buraco na rua costuma ser do município; uma rodovia federal, da União.",
          ],
        },
      ],
      questions: [
        {
          id: "a3q1",
          kind: "multipla_escolha",
          objective: "Listar os entes federativos.",
          prompt:
            "Segundo o Art. 18 da Constituição, a organização político-administrativa do Brasil compreende:",
          options: [
            { id: "a", text: "Apenas a União e os Estados" },
            { id: "b", text: "A União, os Estados, o Distrito Federal e os Municípios" },
            { id: "c", text: "Somente os Municípios" },
            { id: "d", text: "A União e as regiões (Norte, Sul etc.)" },
          ],
          correctOptionId: "b",
          explanation:
            "O Art. 18 lista quatro entes autônomos: União, Estados, Distrito Federal e Municípios. As “regiões” são agrupamentos, não entes federativos.",
          sourceIds: ["cf88"],
        },
        {
          id: "a3q2",
          kind: "verdadeiro_falso",
          objective: "Compreender a autonomia dos entes.",
          prompt:
            "Na federação brasileira, União, estados, DF e municípios são todos autônomos.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. O Art. 18 afirma que todos esses entes são autônomos — cada um com governo e competências próprias, dentro da Constituição.",
          sourceIds: ["cf88"],
        },
        {
          id: "a3q3",
          kind: "multipla_escolha",
          objective: "Atribuir um serviço local ao município.",
          prompt:
            "A coleta de lixo e o transporte urbano de uma cidade são, tipicamente, responsabilidade de qual nível?",
          options: [
            { id: "a", text: "Da União" },
            { id: "b", text: "Do estado" },
            { id: "c", text: "Do município" },
            { id: "d", text: "De nenhum governo" },
          ],
          correctOptionId: "c",
          explanation:
            "Serviços de interesse local, como coleta de lixo e transporte urbano, são típicos do município — o nível mais próximo do dia a dia.",
          sourceIds: ["cf88"],
        },
        {
          id: "a3q4",
          kind: "multipla_escolha",
          objective: "Atribuir um assunto nacional à União.",
          prompt: "Qual destes assuntos é tipicamente responsabilidade da União?",
          options: [
            { id: "a", text: "A defesa nacional e a emissão de moeda" },
            { id: "b", text: "A creche do seu bairro" },
            { id: "c", text: "O conserto de um buraco na rua da sua casa" },
            { id: "d", text: "A limpeza de uma praça municipal" },
          ],
          correctOptionId: "a",
          explanation:
            "Defesa nacional e moeda são assuntos de alcance nacional, próprios da União. Creche, buraco na rua e praça são, em regra, locais (município).",
          sourceIds: ["cf88"],
        },
        {
          id: "a3q5",
          kind: "verdadeiro_falso",
          objective: "Reconhecer competências compartilhadas.",
          prompt:
            "Saúde e educação são áreas em que os três níveis de governo podem atuar de forma compartilhada.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Saúde e educação envolvem União, estados e municípios em conjunto — por isso a responsabilidade pode ser compartilhada.",
          sourceIds: ["cf88"],
        },
      ],
    },

    // ---------------------------------------------------------------- A4 (draft)
    {
      id: "a4",
      slug: "como-uma-proposta-vira-lei",
      order: 4,
      title: "Como uma proposta se torna lei",
      objective:
        "Descrever, em linhas gerais, o caminho de um projeto de lei até virar lei.",
      plan: "premium",
      status: "rascunho",
      version: 1,
      revisedAt: "2026-10-09",
      sources: [CAMARA_PROC, SENADO_LEIS],
      teaching: [
        {
          title: "Da ideia ao projeto",
          body: [
            "Uma lei começa como um projeto de lei. Ele pode ser proposto por parlamentares, pelo Executivo, por certos órgãos e até pela população (iniciativa popular).",
            "RASCUNHO: confirmar na fonte oficial quem pode propor em cada caso antes de publicar.",
          ],
        },
        {
          title: "O caminho nas duas Casas",
          body: [
            "No nível federal, o projeto costuma ser analisado em comissões e votado em Plenário em uma Casa (Câmara ou Senado) e, depois, revisado pela outra.",
            "Aprovado pelo Congresso, segue para o Presidente, que pode sancionar (aprovar) ou vetar. Vetos podem ser analisados pelo Congresso.",
          ],
        },
      ],
      questions: [
        {
          id: "a4q1",
          kind: "multipla_escolha",
          objective: "Identificar o ponto de partida de uma lei.",
          prompt: "Uma lei federal, em regra, começa como:",
          options: [
            { id: "a", text: "Uma decisão isolada de um juiz" },
            { id: "b", text: "Um projeto de lei" },
            { id: "c", text: "Um decreto do prefeito" },
            { id: "d", text: "Uma pesquisa de opinião" },
          ],
          correctOptionId: "b",
          explanation:
            "O ponto de partida é um projeto de lei, que depois tramita no Legislativo.",
          sourceIds: ["camara-processo", "senado-leis"],
        },
        {
          id: "a4q2",
          kind: "verdadeiro_falso",
          objective: "Diferenciar projeto de lei de lei vigente.",
          prompt:
            "Um projeto de lei que ainda tramita no Congresso já é uma lei em vigor.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Projeto de lei é proposta em tramitação; só vira lei vigente após aprovação, sanção/promulgação e publicação. Não confunda os dois.",
          sourceIds: ["camara-processo", "senado-leis"],
        },
        {
          id: "a4q3",
          kind: "multipla_escolha",
          objective: "Reconhecer o papel do Presidente ao fim da tramitação.",
          prompt:
            "Depois de o Congresso aprovar um projeto, o Presidente da República pode:",
          options: [
            { id: "a", text: "Apenas assistir, sem papel no processo" },
            { id: "b", text: "Sancionar ou vetar o projeto" },
            { id: "c", text: "Prender os parlamentares que votaram contra" },
            { id: "d", text: "Transformar o projeto em emenda constitucional sozinho" },
          ],
          correctOptionId: "b",
          explanation:
            "Cabe ao Presidente sancionar (aprovar) ou vetar o projeto aprovado pelo Congresso. (Rascunho: validar detalhes na fonte oficial.)",
          sourceIds: ["camara-processo", "senado-leis"],
        },
        {
          id: "a4q4",
          kind: "multipla_escolha",
          objective: "Entender a revisão entre as Casas.",
          prompt:
            "No Congresso Nacional, após uma Casa aprovar o projeto, o que costuma acontecer?",
          options: [
            { id: "a", text: "A outra Casa revisa o projeto" },
            { id: "b", text: "O projeto vira lei automaticamente" },
            { id: "c", text: "O Judiciário vota o projeto" },
            { id: "d", text: "O projeto é arquivado sempre" },
          ],
          correctOptionId: "a",
          explanation:
            "O Congresso é bicameral: o que uma Casa aprova é, em regra, revisado pela outra antes de seguir para sanção.",
          sourceIds: ["camara-processo", "senado-leis"],
        },
        {
          id: "a4q5",
          kind: "verdadeiro_falso",
          objective: "Reconhecer a iniciativa popular.",
          prompt:
            "A população pode, em certas condições, propor projetos de lei (iniciativa popular).",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. A iniciativa popular permite que cidadãos proponham projetos, cumpridos os requisitos. (Rascunho: confirmar os requisitos atuais na fonte oficial.)",
          sourceIds: ["camara-processo", "senado-leis"],
        },
      ],
    },

    // ---------------------------------------------------------------- A5 (draft)
    {
      id: "a5",
      slug: "acompanhar-e-cobrar-representantes",
      order: 5,
      title: "Como acompanhar e cobrar representantes",
      objective:
        "Conhecer canais oficiais para acompanhar e cobrar quem ocupa cargos públicos.",
      plan: "premium",
      status: "rascunho",
      version: 1,
      revisedAt: "2026-10-09",
      sources: [CF88],
      teaching: [
        {
          title: "Transparência é um direito",
          body: [
            "Você tem direito de acompanhar como o dinheiro público é usado e o que fazem seus representantes. Existem portais de transparência, diários oficiais e canais de ouvidoria.",
            "RASCUNHO: incluir, após verificação, os endereços oficiais dos portais de transparência e ouvidorias de cada nível de governo.",
          ],
        },
        {
          title: "Formas de cobrar",
          body: [
            "Acompanhar votações e presença de parlamentares, pedir informações por canais oficiais, participar de audiências e registrar manifestações em ouvidorias são formas legítimas de cobrança.",
          ],
        },
      ],
      questions: [
        {
          id: "a5q1",
          kind: "multipla_escolha",
          objective: "Identificar uma forma legítima de cobrança.",
          prompt: "Uma forma legítima de cobrar representantes é:",
          options: [
            { id: "a", text: "Acompanhar votações e pedir informações por canais oficiais" },
            { id: "b", text: "Ameaçar quem pensa diferente" },
            { id: "c", text: "Espalhar boatos sem checar" },
            { id: "d", text: "Ignorar completamente a vida pública" },
          ],
          correctOptionId: "a",
          explanation:
            "Acompanhar o trabalho e usar canais oficiais de informação são formas legítimas e eficazes de cobrança.",
          sourceIds: ["cf88"],
        },
        {
          id: "a5q2",
          kind: "verdadeiro_falso",
          objective: "Reconhecer o direito à informação pública.",
          prompt:
            "Cidadãos têm direito de acessar informações sobre o uso do dinheiro público.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. A transparência pública é um direito; há portais e leis que garantem o acesso à informação.",
          sourceIds: ["cf88"],
        },
        {
          id: "a5q3",
          kind: "multipla_escolha",
          objective: "Associar transparência a seus instrumentos.",
          prompt: "Qual destes é um instrumento de transparência pública?",
          options: [
            { id: "a", text: "Um portal de transparência oficial" },
            { id: "b", text: "Um grupo de mensagens privado" },
            { id: "c", text: "Um perfil anônimo em rede social" },
            { id: "d", text: "Um panfleto de campanha" },
          ],
          correctOptionId: "a",
          explanation:
            "Portais de transparência oficiais reúnem dados sobre gastos e contratos — fontes confiáveis para acompanhar o poder público.",
          sourceIds: ["cf88"],
        },
        {
          id: "a5q4",
          kind: "multipla_escolha",
          objective: "Entender a função da ouvidoria.",
          prompt: "Uma ouvidoria pública serve para:",
          options: [
            { id: "a", text: "Receber pedidos, reclamações e sugestões da população" },
            { id: "b", text: "Fazer campanha para um candidato" },
            { id: "c", text: "Julgar processos criminais" },
            { id: "d", text: "Emitir moeda" },
          ],
          correctOptionId: "a",
          explanation:
            "A ouvidoria é um canal para a população registrar pedidos, reclamações e sugestões a um órgão público.",
          sourceIds: ["cf88"],
        },
        {
          id: "a5q5",
          kind: "verdadeiro_falso",
          objective: "Afastar a ideia de que cobrança só ocorre no voto.",
          prompt:
            "A única forma de influenciar a vida pública é votando a cada eleição.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Além do voto, é possível acompanhar, pedir informações, participar de audiências e usar ouvidorias ao longo de todo o mandato.",
          sourceIds: ["cf88"],
        },
      ],
    },
  ],
};

import type { LearningPath, Source } from "@/lib/content/types";

/**
 * Trilha C — Política no bolso. Complete DRAFT (rascunho), Premium.
 *
 * Teaches public money concepts without any dated statistic — figures change
 * and must be verified at the source at publication time. Sources point to the
 * responsible official portals (Banco Central, IBGE) and to the Constitution's
 * budget provisions. Specific indicators/numbers must be added only after
 * verification during editorial review.
 */

const BCB: Source = {
  id: "bcb",
  title: "Banco Central do Brasil — portal oficial",
  url: "https://www.bcb.gov.br",
  consultedAt: "2026-10-09",
  excerpt:
    "Conceitos de inflação, índices de preços e política monetária. RASCUNHO: citar a página e o indicador específicos ao publicar.",
  nature: "fato_institucional",
};

const IBGE: Source = {
  id: "ibge",
  title: "IBGE — portal oficial",
  url: "https://www.ibge.gov.br",
  consultedAt: "2026-10-09",
  excerpt:
    "Índices de preços e indicadores sociais e econômicos. RASCUNHO: citar a página e o período do dado ao publicar.",
  nature: "fato_institucional",
};

const CF_ORCAMENTO: Source = {
  id: "cf88-orcamento",
  title: "Constituição de 1988 — Das Finanças Públicas e do Orçamento (Título VI)",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  consultedAt: "2026-10-09",
  excerpt: "Título VI (Da Tributação e do Orçamento), incluindo os arts. sobre orçamento público.",
  nature: "fato_institucional",
};

const draftMeta = {
  plan: "premium" as const,
  status: "rascunho" as const,
  version: 1,
  revisedAt: "2026-10-09",
};

export const trailC: LearningPath = {
  id: "trilha-c",
  slug: "politica-no-bolso",
  order: 3,
  title: "Política no bolso",
  description:
    "O dinheiro público: de onde vêm os recursos, o que é orçamento, o que é inflação e como avaliar promessas econômicas.",
  lessons: [
    {
      id: "c1",
      slug: "de-onde-vem-o-dinheiro-publico",
      order: 1,
      title: "De onde vêm os recursos públicos",
      objective: "Entender que os recursos públicos vêm, em grande parte, de tributos.",
      ...draftMeta,
      sources: [CF_ORCAMENTO],
      teaching: [
        {
          title: "O bolo vem de tributos",
          body: [
            "A maior parte do dinheiro público vem de tributos (impostos, taxas e contribuições) pagos por pessoas e empresas.",
            "Esses recursos financiam serviços como saúde, educação, segurança e infraestrutura.",
          ],
        },
        {
          title: "Quem define as regras",
          body: [
            "As regras de arrecadação e gasto são definidas por lei, dentro dos limites da Constituição.",
            "RASCUNHO: incluir, em revisão, exemplos de tributos por nível de governo, verificados na fonte oficial.",
          ],
        },
      ],
      questions: [
        {
          id: "c1q1",
          kind: "multipla_escolha",
          objective: "Identificar a origem dos recursos públicos.",
          prompt: "A maior parte dos recursos públicos vem de:",
          options: [
            { id: "a", text: "Tributos pagos por pessoas e empresas" },
            { id: "b", text: "Doações voluntárias de outros países" },
            { id: "c", text: "Venda de bilhetes de cinema" },
            { id: "d", text: "Mesadas dos governantes" },
          ],
          correctOptionId: "a",
          explanation:
            "A principal fonte são os tributos (impostos, taxas e contribuições) pagos pela sociedade.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c1q2",
          kind: "verdadeiro_falso",
          objective: "Relacionar tributos a serviços.",
          prompt: "Tributos financiam serviços como saúde, educação e segurança.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. A arrecadação custeia serviços públicos essenciais.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c1q3",
          kind: "multipla_escolha",
          objective: "Reconhecer tipos de tributo.",
          prompt: "São exemplos de tributos:",
          options: [
            { id: "a", text: "Impostos, taxas e contribuições" },
            { id: "b", text: "Curtidas em redes sociais" },
            { id: "c", text: "Senhas bancárias" },
            { id: "d", text: "Horas de sono" },
          ],
          correctOptionId: "a",
          explanation:
            "Impostos, taxas e contribuições são espécies de tributos.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c1q4",
          kind: "verdadeiro_falso",
          objective: "Entender que gasto segue regras legais.",
          prompt:
            "O governo pode gastar o dinheiro público de qualquer forma, sem regras.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Arrecadação e gasto seguem regras legais e constitucionais.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c1q5",
          kind: "multipla_escolha",
          objective: "Ligar o cidadão ao financiamento público.",
          prompt:
            "Quando você compra um produto com imposto embutido, você está:",
          options: [
            { id: "a", text: "Contribuindo para o financiamento público" },
            { id: "b", text: "Recebendo um salário do governo" },
            { id: "c", text: "Emprestando dinheiro a um banco" },
            { id: "d", text: "Votando em uma eleição" },
          ],
          correctOptionId: "a",
          explanation:
            "Parte do preço de muitos produtos são tributos — então o consumo também financia o setor público.",
          sourceIds: ["cf88-orcamento"],
        },
      ],
    },
    {
      id: "c2",
      slug: "o-que-e-orcamento-publico",
      order: 2,
      title: "O que é orçamento público",
      objective: "Entender o orçamento como um plano de receitas e despesas aprovado por lei.",
      ...draftMeta,
      sources: [CF_ORCAMENTO],
      teaching: [
        {
          title: "Um plano com força de lei",
          body: [
            "O orçamento público é um plano que estima quanto o governo vai arrecadar e autoriza quanto e onde vai gastar em um período.",
            "No Brasil, ele é aprovado por lei, com participação do Executivo (que propõe) e do Legislativo (que analisa e aprova).",
          ],
        },
        {
          title: "Por que acompanhar",
          body: [
            "O orçamento revela prioridades: onde há mais dinheiro, há mais prioridade declarada.",
            "RASCUNHO: incluir, em revisão, os nomes e o ciclo das leis orçamentárias, verificados na fonte oficial.",
          ],
        },
      ],
      questions: [
        {
          id: "c2q1",
          kind: "multipla_escolha",
          objective: "Definir orçamento público.",
          prompt: "O orçamento público é, essencialmente:",
          options: [
            { id: "a", text: "Um plano de receitas e despesas aprovado por lei" },
            { id: "b", text: "Uma conta bancária pessoal de um ministro" },
            { id: "c", text: "Uma pesquisa de opinião" },
            { id: "d", text: "Um tipo de imposto" },
          ],
          correctOptionId: "a",
          explanation:
            "É um plano que estima receitas e autoriza despesas, aprovado por lei.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c2q2",
          kind: "verdadeiro_falso",
          objective: "Reconhecer a participação do Legislativo.",
          prompt:
            "No Brasil, o Legislativo participa da análise e aprovação do orçamento.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. O Executivo propõe e o Legislativo analisa e aprova o orçamento.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c2q3",
          kind: "multipla_escolha",
          objective: "Ler prioridades no orçamento.",
          prompt:
            "Se uma área recebe uma fatia maior do orçamento, isso indica, em princípio:",
          options: [
            { id: "a", text: "Maior prioridade declarada para aquela área" },
            { id: "b", text: "Que a área será extinta" },
            { id: "c", text: "Que ninguém vai usar aquele dinheiro" },
            { id: "d", text: "Que o imposto vai acabar" },
          ],
          correctOptionId: "a",
          explanation:
            "Mais recursos sinalizam maior prioridade declarada — ainda que a execução precise ser acompanhada.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c2q4",
          kind: "verdadeiro_falso",
          objective: "Distinguir previsão de execução.",
          prompt:
            "O que está no orçamento é sempre executado exatamente como previsto.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. O orçamento é uma previsão/autorização; a execução real pode diferir e precisa ser acompanhada.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c2q5",
          kind: "multipla_escolha",
          objective: "Entender o papel do Executivo no orçamento.",
          prompt: "No ciclo orçamentário, cabe ao Executivo, em regra:",
          options: [
            { id: "a", text: "Propor o orçamento" },
            { id: "b", text: "Julgar crimes" },
            { id: "c", text: "Aprovar sozinho sem o Legislativo" },
            { id: "d", text: "Definir a Constituição" },
          ],
          correctOptionId: "a",
          explanation:
            "O Executivo propõe o orçamento, que depois é apreciado pelo Legislativo.",
          sourceIds: ["cf88-orcamento"],
        },
      ],
    },
    {
      id: "c3",
      slug: "o-que-e-inflacao",
      order: 3,
      title: "O que é inflação e como ler um indicador",
      objective: "Compreender inflação como aumento geral de preços e ler um índice com cuidado.",
      ...draftMeta,
      sources: [BCB, IBGE],
      teaching: [
        {
          title: "Preços subindo no conjunto",
          body: [
            "Inflação é o aumento geral e contínuo dos preços ao longo do tempo. Quando há inflação, o seu dinheiro compra menos do que antes.",
            "Índices de preços medem essa variação acompanhando uma “cesta” de produtos e serviços.",
          ],
        },
        {
          title: "Cuidado ao interpretar",
          body: [
            "Inflação menor não significa preços menores: significa que eles sobem mais devagar. Para os preços caírem no conjunto, seria preciso deflação.",
            "RASCUNHO: ao publicar, citar o índice específico e o período, verificados em IBGE/Banco Central.",
          ],
        },
      ],
      questions: [
        {
          id: "c3q1",
          kind: "multipla_escolha",
          objective: "Definir inflação.",
          prompt: "Inflação é:",
          options: [
            { id: "a", text: "O aumento geral e contínuo dos preços ao longo do tempo" },
            { id: "b", text: "A queda do número de habitantes" },
            { id: "c", text: "Um tipo de imposto sobre renda" },
            { id: "d", text: "O nome de uma eleição" },
          ],
          correctOptionId: "a",
          explanation:
            "Inflação é a alta geral e contínua dos preços — o dinheiro passa a comprar menos.",
          sourceIds: ["bcb", "ibge"],
        },
        {
          id: "c3q2",
          kind: "verdadeiro_falso",
          objective: "Corrigir o erro inflação menor = preços menores.",
          prompt:
            "Se a inflação cai de um mês para o outro, significa que os preços, no conjunto, ficaram mais baratos.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Inflação menor significa preços subindo mais devagar — não preços caindo. Para cair no conjunto seria preciso deflação.",
          sourceIds: ["bcb", "ibge"],
        },
        {
          id: "c3q3",
          kind: "multipla_escolha",
          objective: "Entender como se mede a inflação.",
          prompt: "Um índice de preços mede a inflação ao:",
          options: [
            { id: "a", text: "Acompanhar a variação de preços de uma cesta de itens" },
            { id: "b", text: "Contar quantas pessoas votaram" },
            { id: "c", text: "Medir a altura média da população" },
            { id: "d", text: "Somar o número de leis aprovadas" },
          ],
          correctOptionId: "a",
          explanation:
            "Índices acompanham uma cesta representativa de bens e serviços para medir a variação de preços.",
          sourceIds: ["ibge"],
        },
        {
          id: "c3q4",
          kind: "verdadeiro_falso",
          objective: "Relacionar inflação e poder de compra.",
          prompt:
            "Com inflação alta e salário parado, o poder de compra tende a diminuir.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Se os preços sobem e a renda não acompanha, compra-se menos com o mesmo valor.",
          sourceIds: ["bcb"],
        },
        {
          id: "c3q5",
          kind: "multipla_escolha",
          objective: "Promover a checagem de dados datados.",
          prompt:
            "Ao ver um número de inflação numa notícia, uma atitude cuidadosa é:",
          options: [
            { id: "a", text: "Verificar o índice, o período e a fonte oficial" },
            { id: "b", text: "Acreditar sem checar" },
            { id: "c", text: "Supor que vale para sempre" },
            { id: "d", text: "Confundir com a taxa de desemprego" },
          ],
          correctOptionId: "a",
          explanation:
            "Dados são datados: confira qual índice, de que período e em qual fonte oficial (IBGE/Banco Central).",
          sourceIds: ["bcb", "ibge"],
        },
      ],
    },
    {
      id: "c4",
      slug: "servicos-publicos-e-politicas-sociais",
      order: 4,
      title: "Serviços públicos e políticas sociais",
      objective: "Entender a diferença entre serviços públicos universais e políticas sociais focalizadas.",
      ...draftMeta,
      sources: [CF_ORCAMENTO],
      teaching: [
        {
          title: "Dois conceitos próximos",
          body: [
            "Serviços públicos (como saúde e educação públicas) tendem a ser universais: disponíveis a todos.",
            "Políticas sociais podem ser focalizadas: voltadas a grupos específicos, segundo critérios definidos em lei.",
          ],
        },
        {
          title: "Escolhas e trade-offs",
          body: [
            "Universalizar ou focalizar envolve escolhas e custos. Há argumentos de diferentes lados, e os dados ajudam a avaliar resultados.",
            "RASCUNHO: incluir, em revisão, exemplos concretos verificados e evitar generalizações.",
          ],
        },
      ],
      questions: [
        {
          id: "c4q1",
          kind: "multipla_escolha",
          objective: "Definir serviço universal.",
          prompt: "Um serviço público universal caracteriza-se por:",
          options: [
            { id: "a", text: "Estar disponível, em princípio, a todos" },
            { id: "b", text: "Ser exclusivo de uma empresa" },
            { id: "c", text: "Depender de sorteio mensal" },
            { id: "d", text: "Ser proibido por lei" },
          ],
          correctOptionId: "a",
          explanation:
            "Universal significa acesso em princípio aberto a todos — caso típico de saúde e educação públicas.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c4q2",
          kind: "multipla_escolha",
          objective: "Definir política focalizada.",
          prompt: "Uma política social focalizada é aquela que:",
          options: [
            { id: "a", text: "Atende grupos específicos conforme critérios definidos" },
            { id: "b", text: "Atende obrigatoriamente toda a população" },
            { id: "c", text: "Não tem regras" },
            { id: "d", text: "É decidida por uma única pessoa sem lei" },
          ],
          correctOptionId: "a",
          explanation:
            "Focalizada significa dirigida a grupos específicos, segundo critérios previstos em lei.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c4q3",
          kind: "verdadeiro_falso",
          objective: "Reconhecer trade-offs.",
          prompt:
            "Decidir entre universalizar ou focalizar um benefício envolve escolhas e custos.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Cada caminho tem custos e efeitos diferentes — por isso é objeto de debate.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c4q4",
          kind: "verdadeiro_falso",
          objective: "Valorizar avaliação por resultados.",
          prompt:
            "Dados e avaliação de resultados ajudam a julgar se uma política social funciona.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Avaliar resultados com dados é essencial para saber se uma política atinge seus objetivos.",
          sourceIds: ["cf88-orcamento"],
        },
        {
          id: "c4q5",
          kind: "multipla_escolha",
          objective: "Aplicar a distinção.",
          prompt:
            "Um atendimento de saúde aberto a qualquer pessoa é um exemplo de:",
          options: [
            { id: "a", text: "Serviço público universal" },
            { id: "b", text: "Política focalizada" },
            { id: "c", text: "Tributo" },
            { id: "d", text: "Emenda constitucional" },
          ],
          correctOptionId: "a",
          explanation:
            "Atendimento aberto a qualquer pessoa é a lógica de um serviço universal.",
          sourceIds: ["cf88-orcamento"],
        },
      ],
    },
    {
      id: "c5",
      slug: "como-avaliar-uma-promessa-economica",
      order: 5,
      title: "Como avaliar uma promessa econômica",
      objective: "Aplicar perguntas de verificação a promessas econômicas.",
      ...draftMeta,
      sources: [BCB, IBGE],
      teaching: [
        {
          title: "Toda promessa tem custo",
          body: [
            "Gastar mais em algo exige, em geral, arrecadar mais, cortar outro gasto ou se endividar. Uma promessa séria explica de onde virá o dinheiro.",
          ],
        },
        {
          title: "Perguntas que ajudam",
          body: [
            "Quanto custa? De onde vem o recurso? Em quanto tempo? Com base em quais dados? Há evidência de que funciona?",
            "RASCUNHO: incluir, em revisão, um checklist verificado e exemplos neutros, sem favorecer candidatos.",
          ],
        },
      ],
      questions: [
        {
          id: "c5q1",
          kind: "multipla_escolha",
          objective: "Reconhecer o custo de oportunidade.",
          prompt:
            "Para gastar mais em uma área sem aumentar a dívida, em geral é preciso:",
          options: [
            { id: "a", text: "Arrecadar mais ou cortar outro gasto" },
            { id: "b", text: "Apenas desejar com força" },
            { id: "c", text: "Imprimir dinheiro sem limites, sem efeitos" },
            { id: "d", text: "Nada: dinheiro público é infinito" },
          ],
          correctOptionId: "a",
          explanation:
            "Recursos são limitados: mais gasto costuma exigir mais arrecadação, corte em outra área ou endividamento.",
          sourceIds: ["bcb"],
        },
        {
          id: "c5q2",
          kind: "multipla_escolha",
          objective: "Aplicar perguntas de verificação.",
          prompt:
            "Qual pergunta ajuda a avaliar uma promessa econômica?",
          options: [
            { id: "a", text: "De onde virá o dinheiro e quanto custa?" },
            { id: "b", text: "Qual a cor preferida do candidato?" },
            { id: "c", text: "Quantos seguidores ele tem?" },
            { id: "d", text: "Em que time ele torce?" },
          ],
          correctOptionId: "a",
          explanation:
            "Perguntar custo e fonte do recurso é central para avaliar a viabilidade de uma promessa.",
          sourceIds: ["bcb", "ibge"],
        },
        {
          id: "c5q3",
          kind: "verdadeiro_falso",
          objective: "Afastar a ideia de dinheiro infinito.",
          prompt:
            "O orçamento público é ilimitado, então qualquer promessa cabe nele.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "f",
          explanation:
            "Falso. Os recursos são limitados; promessas precisam caber no orçamento ou indicar a fonte.",
          sourceIds: ["bcb"],
        },
        {
          id: "c5q4",
          kind: "verdadeiro_falso",
          objective: "Valorizar evidência.",
          prompt:
            "Perguntar se há evidência de que uma medida funcionou antes é parte de uma avaliação cuidadosa.",
          options: [
            { id: "v", text: "Verdadeiro" },
            { id: "f", text: "Falso" },
          ],
          correctOptionId: "v",
          explanation:
            "Verdadeiro. Evidência sobre resultados passados ajuda a julgar propostas.",
          sourceIds: ["ibge"],
        },
        {
          id: "c5q5",
          kind: "multipla_escolha",
          objective: "Reconhecer sinais de promessa frágil.",
          prompt: "Uma promessa econômica frágil costuma:",
          options: [
            { id: "a", text: "Não explicar custo nem de onde vem o recurso" },
            { id: "b", text: "Trazer números, fonte e prazo" },
            { id: "c", text: "Citar dados oficiais verificáveis" },
            { id: "d", text: "Admitir trade-offs" },
          ],
          correctOptionId: "a",
          explanation:
            "A ausência de custo e de fonte do recurso é um sinal de alerta sobre a viabilidade da promessa.",
          sourceIds: ["bcb", "ibge"],
        },
      ],
    },
  ],
};

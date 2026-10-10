import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria M — Orçamento público. Publicada, Premium. */
const S = {
  leis: cf("orcamento-leis", "Art. 165 (PPA, LDO e LOA)."),
  exec: cf("orcamento-exec", "Art. 166 a 169 (processo orçamentário; limites de despesa)."),
};

export const trailM = publishTrail(
  buildTrail({
    id: "trilha-m",
    slug: "orcamento-publico",
    order: 13,
    title: "Orçamento público",
    description:
      "Como o governo planeja receitas e gastos: o PPA, a LDO e a LOA, déficit e superávit, dívida pública e responsabilidade fiscal.",
    lessons: [
      buildLesson({
        id: "m1",
        slug: "o-que-e-orcamento",
        order: 1,
        title: "O que é o orçamento público",
        objective: "Entender o orçamento como plano de receitas e despesas aprovado por lei.",
        sources: [S.leis],
        teaching: [
          screen(
            "Um plano com força de lei",
            "O orçamento estima quanto o governo vai arrecadar e autoriza quanto e onde gastar em um período.",
            "O Executivo propõe e o Legislativo analisa e aprova. É aprovado por lei.",
          ),
        ],
        specs: [
          ["mc", "Definição", "O orçamento público é:", ["Um plano de receitas e despesas aprovado por lei", "Uma conta pessoal de um ministro", "Uma pesquisa de opinião", "Um imposto novo"], 0, "É o plano que estima receitas e autoriza despesas.", ["cf-orcamento-leis"]],
          ["tf", "Quem propõe", "O Executivo propõe o orçamento e o Legislativo o aprova.", true, "Verdadeiro. É o ciclo básico do orçamento.", ["cf-orcamento-leis"]],
          ["mc", "Força do orçamento", "O orçamento é aprovado por:", ["Lei", "Decreto secreto", "Ordem verbal", "Portaria de um banco"], 0, "O orçamento vira lei após aprovação legislativa.", ["cf-orcamento-leis"]],
          ["tf", "Previsão x execução", "O orçamento é uma previsão/autorização; a execução real pode diferir.", true, "Verdadeiro. Previsto não é o mesmo que executado.", ["cf-orcamento-leis"]],
          ["mc", "Ler prioridades", "Mais recursos para uma área indicam, em princípio:", ["Maior prioridade declarada", "Que a área vai acabar", "Que o dinheiro não será usado", "Que o imposto acabou"], 0, "A fatia do orçamento sinaliza prioridade declarada.", ["cf-orcamento-leis"]],
          ["tf", "Transparência", "O cidadão tem direito de acompanhar o orçamento público.", true, "Verdadeiro. O orçamento é público e acompanhável.", ["cf-orcamento-leis"]],
          ["mc", "Papel do Legislativo", "Ao analisar o orçamento, o Legislativo:", ["Discute e pode alterar a proposta, dentro das regras", "Apenas assiste", "Não participa", "Decide sozinho sem o Executivo"], 0, "O Legislativo debate, emenda e aprova o orçamento.", ["cf-orcamento-leis"]],
          ["mc", "Função do orçamento", "O orçamento serve para:", ["Organizar e autorizar o uso do dinheiro público", "Eleger governantes", "Julgar processos", "Emitir moeda"], 0, "Ele planeja e autoriza as finanças públicas.", ["cf-orcamento-leis"]],
        ],
      }),
      buildLesson({
        id: "m2",
        slug: "ppa-ldo-loa",
        order: 2,
        title: "PPA, LDO e LOA",
        objective: "Diferenciar as três leis orçamentárias.",
        sources: [S.leis],
        teaching: [
          screen(
            "As três leis do orçamento",
            "PPA (Plano Plurianual): planeja para quatro anos, com diretrizes e metas.",
            "LDO (Lei de Diretrizes Orçamentárias): orienta a elaboração do orçamento do ano seguinte.",
            "LOA (Lei Orçamentária Anual): o orçamento de cada ano, com receitas e despesas.",
          ),
        ],
        specs: [
          ["mc", "PPA", "O Plano Plurianual (PPA) planeja para:", ["Quatro anos", "Um mês", "Dez anos", "Um dia"], 0, "O PPA tem horizonte de quatro anos.", ["cf-orcamento-leis"]],
          ["mc", "LOA", "A Lei Orçamentária Anual (LOA) traz:", ["As receitas e despesas de cada ano", "O planejamento de 4 anos", "Apenas diretrizes", "O Código Penal"], 0, "A LOA é o orçamento anual propriamente dito.", ["cf-orcamento-leis"]],
          ["mc", "LDO", "A LDO serve para:", ["Orientar a elaboração do orçamento do ano seguinte", "Julgar crimes", "Criar impostos novos", "Eleger o presidente"], 0, "A LDO fixa diretrizes e metas para a LOA.", ["cf-orcamento-leis"]],
          ["tf", "Integração", "PPA, LDO e LOA se articulam: o plano orienta as diretrizes, que orientam o orçamento anual.", true, "Verdadeiro. São três instrumentos encadeados.", ["cf-orcamento-leis"]],
          ["mc", "Horizonte anual", "Qual lei é anual?", ["A LOA", "O PPA", "A Constituição", "O Código Civil"], 0, "A LOA é a lei orçamentária de cada ano.", ["cf-orcamento-leis"]],
          ["tf", "PPA e metas", "O PPA traz metas e diretrizes de médio prazo.", true, "Verdadeiro. O PPA organiza o planejamento plurianual.", ["cf-orcamento-leis"]],
          ["mc", "Encadeamento", "A ordem lógica de planejamento é:", ["PPA → LDO → LOA", "LOA → PPA → LDO", "LDO → PPA → LOA", "Nenhuma ordem"], 0, "O plano (PPA) orienta as diretrizes (LDO) e o orçamento anual (LOA).", ["cf-orcamento-leis"]],
          ["mc", "Quem aprova", "PPA, LDO e LOA são:", ["Aprovados pelo Legislativo", "Decididos por um banco", "Secretos", "Definidos pelo Judiciário"], 0, "As três leis passam pelo Legislativo.", ["cf-orcamento-leis"]],
        ],
      }),
      buildLesson({
        id: "m3",
        slug: "deficit-e-superavit",
        order: 3,
        title: "Déficit e superávit",
        objective: "Entender déficit, superávit e resultado primário.",
        sources: [S.exec],
        teaching: [
          screen(
            "Quando falta e quando sobra",
            "Déficit: o governo gasta mais do que arrecada. Superávit: arrecada mais do que gasta.",
            "O resultado primário mede receitas menos despesas, sem contar os juros da dívida.",
          ),
        ],
        specs: [
          ["mc", "Déficit", "Há déficit quando o governo:", ["Gasta mais do que arrecada", "Arrecada mais do que gasta", "Não gasta nada", "Emite moeda"], 0, "Déficit é gastar além da arrecadação.", ["cf-orcamento-exec"]],
          ["mc", "Superávit", "Há superávit quando o governo:", ["Arrecada mais do que gasta", "Gasta mais do que arrecada", "Fecha as contas no zero sempre", "Não arrecada"], 0, "Superávit é arrecadar acima do que se gasta.", ["cf-orcamento-exec"]],
          ["tf", "Déficit e dívida", "Déficits seguidos tendem a aumentar a dívida pública.", true, "Verdadeiro. Gastar mais do que se arrecada costuma exigir endividamento.", ["cf-orcamento-exec"]],
          ["mc", "Resultado primário", "O resultado primário considera receitas menos despesas:", ["Sem contar os juros da dívida", "Contando só os juros", "Apenas de um município", "Somente de empresas"], 0, "O primário exclui o pagamento de juros da dívida.", ["cf-orcamento-exec"]],
          ["tf", "Nem todo déficit é igual", "Um déficit pode ser aceitável em certas circunstâncias (ex.: crises), mas déficits crônicos trazem riscos.", true, "Verdadeiro. O contexto importa ao avaliar o déficit.", ["cf-orcamento-exec"]],
          ["mc", "Equilíbrio", "Equilíbrio fiscal significa, em termos simples:", ["Manter as contas públicas sustentáveis ao longo do tempo", "Nunca gastar", "Gastar o máximo sempre", "Não arrecadar"], 0, "Equilíbrio é sustentar as contas no tempo, não zerar gastos.", ["cf-orcamento-exec"]],
          ["mc", "Cuidado ao interpretar", "Um governo que corta gastos pode, no curto prazo:", ["Melhorar o resultado fiscal, com possíveis efeitos sociais a avaliar", "Nunca afetar ninguém", "Aumentar automaticamente a dívida", "Acabar com impostos"], 0, "Cortes melhoram o resultado, mas seus efeitos precisam ser avaliados.", ["cf-orcamento-exec"]],
          ["tf", "Superávit sempre bom?", "Superávit é sempre melhor do que qualquer gasto, em qualquer situação.", false, "Falso. Depende do contexto; gastar em áreas essenciais também importa.", ["cf-orcamento-exec"]],
        ],
      }),
      buildLesson({
        id: "m4",
        slug: "divida-publica",
        order: 4,
        title: "Dívida pública",
        objective: "Entender o que é a dívida pública e por que importa.",
        sources: [S.exec],
        teaching: [
          screen(
            "O que o governo deve",
            "Dívida pública é o total que o governo deve, geralmente por ter gasto mais do que arrecadou ao longo do tempo.",
            "Ela não é necessariamente ruim: o problema é quando cresce rápido demais e os juros pesam no orçamento.",
          ),
        ],
        specs: [
          ["mc", "Dívida pública", "Dívida pública é:", ["O total que o governo deve", "O dinheiro em caixa do governo", "O imposto de renda", "O salário dos servidores"], 0, "É o estoque do que o governo deve.", ["cf-orcamento-exec"]],
          ["tf", "Origem da dívida", "A dívida costuma crescer quando o governo gasta mais do que arrecada por muito tempo.", true, "Verdadeiro. Déficits seguidos alimentam a dívida.", ["cf-orcamento-exec"]],
          ["mc", "Juros da dívida", "Pagar juros altos da dívida:", ["Consome parte do orçamento que poderia ir a serviços", "Não afeta o orçamento", "Aumenta a arrecadação", "Elimina a dívida"], 0, "Os juros competem com gastos em serviços públicos.", ["cf-orcamento-exec"]],
          ["tf", "Dívida é sempre ruim?", "Toda dívida pública é necessariamente ruim.", false, "Falso. Dívida pode financiar investimentos; o risco é o descontrole.", ["cf-orcamento-exec"]],
          ["mc", "Sustentabilidade", "A dívida é mais preocupante quando:", ["Cresce mais rápido que a capacidade de pagamento", "Fica estável em relação à economia", "Diminui", "É transparente"], 0, "O risco está no crescimento acima da capacidade de pagar.", ["cf-orcamento-exec"]],
          ["mc", "Como se mede", "Para avaliar a dívida, costuma-se compará-la:", ["Ao tamanho da economia (PIB)", "Ao número de ministérios", "À população de uma cidade", "Ao número de leis"], 0, "A relação dívida/PIB é uma medida comum de sustentabilidade.", ["cf-orcamento-exec"]],
          ["tf", "Confiança", "Dívida sob controle ajuda a manter a confiança e juros mais baixos.", true, "Verdadeiro. Previsibilidade fiscal tende a reduzir o custo da dívida.", ["cf-orcamento-exec"]],
          ["mc", "Decisão de endividar", "Endividar-se para investir em algo produtivo é diferente de:", ["Endividar-se apenas para cobrir gastos correntes sem fim", "Investir em infraestrutura", "Planejar o retorno", "Avaliar o custo"], 0, "Dívida para investimento difere de dívida crônica por gasto corrente.", ["cf-orcamento-exec"]],
        ],
      }),
      buildLesson({
        id: "m5",
        slug: "responsabilidade-fiscal",
        order: 5,
        title: "Responsabilidade fiscal",
        objective: "Entender a lógica da responsabilidade fiscal.",
        sources: [S.exec],
        teaching: [
          screen(
            "Regras para gastar com responsabilidade",
            "A responsabilidade fiscal busca impedir que governos gastem além do que podem, deixando dívidas insustentáveis.",
            "Há regras, como limites para gasto com pessoal e metas fiscais, para dar previsibilidade e proteger o futuro.",
          ),
        ],
        specs: [
          ["mc", "Responsabilidade fiscal", "A responsabilidade fiscal busca:", ["Evitar gastos insustentáveis e dívidas descontroladas", "Proibir qualquer gasto", "Aumentar impostos sempre", "Esconder as contas"], 0, "Ela visa a sustentabilidade das contas públicas.", ["cf-orcamento-exec"]],
          ["tf", "Limite de pessoal", "Existem limites para o quanto um governo pode gastar com pessoal.", true, "Verdadeiro. Há limites legais de despesa com pessoal.", ["cf-orcamento-exec"]],
          ["mc", "Metas fiscais", "Metas fiscais servem para:", ["Dar previsibilidade e disciplina às contas", "Eliminar o orçamento", "Acabar com a arrecadação", "Decidir eleições"], 0, "Metas orientam e disciplinam o gasto público.", ["cf-orcamento-exec"]],
          ["tf", "Transparência fiscal", "A responsabilidade fiscal também envolve transparência sobre as contas.", true, "Verdadeiro. Prestar contas é parte da responsabilidade fiscal.", ["cf-orcamento-exec"]],
          ["mc", "Proteger o futuro", "Gastar com responsabilidade protege:", ["A capacidade do Estado de prestar serviços no futuro", "Apenas o governo atual", "Somente os bancos", "Nada"], 0, "Contas sustentáveis preservam serviços futuros.", ["cf-orcamento-exec"]],
          ["mc", "Avaliar promessas", "Ao ouvir uma promessa de gasto, uma pergunta fiscal é:", ["De onde vem o dinheiro e cabe no orçamento?", "O candidato é simpático?", "Quantos seguidores ele tem?", "Qual a cor da campanha?"], 0, "Viabilidade fiscal depende da fonte do recurso.", ["cf-orcamento-exec"]],
          ["tf", "Regras e democracia", "Regras fiscais convivem com a democracia: o debate é sobre como gastar bem, não sobre ignorar limites.", true, "Verdadeiro. As escolhas são democráticas, dentro de regras de sustentabilidade.", ["cf-orcamento-exec"]],
          ["mc", "Risco do descontrole", "Ignorar a responsabilidade fiscal pode levar a:", ["Dívida alta, juros maiores e menos recursos para serviços", "Mais dinheiro para tudo sempre", "Fim dos impostos", "Nenhuma consequência"], 0, "O descontrole fiscal reduz a capacidade de investir em serviços.", ["cf-orcamento-exec"]],
        ],
      }),
    ],
  }),
);

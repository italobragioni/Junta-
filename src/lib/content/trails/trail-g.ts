import { buildLesson, buildTrail, screen } from "../builders";
import { cf, CAMARA, SENADO } from "../sources";

/** Categoria G — O Poder Legislativo por dentro. DRAFT, Premium. */
const S = {
  org: cf("legislativo-org", "Art. 44 a 47 (Congresso Nacional: Câmara e Senado)."),
  cam: cf("camara", "Art. 45 (Câmara dos Deputados) e Art. 51 (competências)."),
  sen: cf("senado", "Art. 46 (Senado Federal) e Art. 52 (competências)."),
  proc: cf("processo", "Art. 59 a 69 (processo legislativo)."),
};

export const trailG = buildTrail({
  id: "trilha-g",
  slug: "poder-legislativo-por-dentro",
  order: 7,
  title: "O Poder Legislativo por dentro",
  description:
    "Câmara e Senado, o que cada Casa faz, como são eleitos deputados e senadores e como as leis realmente tramitam.",
  lessons: [
    buildLesson({
      id: "g1",
      slug: "congresso-nacional",
      order: 1,
      title: "O Congresso Nacional",
      objective: "Entender que o Legislativo federal é bicameral.",
      sources: [S.org, CAMARA, SENADO],
      teaching: [
        screen(
          "Duas Casas",
          "No nível federal, o Poder Legislativo é o Congresso Nacional, formado por duas Casas: a Câmara dos Deputados e o Senado Federal.",
          "Esse formato é chamado de bicameral.",
        ),
      ],
      specs: [
        ["mc", "Composição do Congresso", "O Congresso Nacional é formado por:", ["Câmara dos Deputados e Senado Federal", "Apenas o Senado", "Câmara e STF", "Presidência e ministérios"], 0, "O Congresso é bicameral: Câmara e Senado.", ["cf-legislativo-org"]],
        ["tf", "Bicameralismo", "O Legislativo federal brasileiro é bicameral.", true, "Verdadeiro. São duas Casas: Câmara e Senado.", ["cf-legislativo-org"]],
        ["mc", "Funções do Legislativo", "As funções típicas do Legislativo são:", ["Legislar e fiscalizar", "Julgar crimes comuns", "Administrar hospitais", "Comandar o Exército"], 0, "Legislar e fiscalizar o Executivo são funções do Legislativo.", ["cf-legislativo-org"]],
        ["mc", "Número de deputados federais", "A Câmara dos Deputados tem:", ["513 deputados federais", "81 deputados", "1000 deputados", "27 deputados"], 0, "São 513 cadeiras na Câmara dos Deputados.", ["cf-camara"]],
        ["mc", "Número de senadores", "O Senado Federal tem:", ["81 senadores", "513 senadores", "26 senadores", "100 senadores"], 0, "São 81 senadores (3 por estado e pelo DF).", ["cf-senado"]],
        ["tf", "Representação do Senado", "Cada estado e o Distrito Federal elegem o mesmo número de senadores.", true, "Verdadeiro. Cada um elege 3 senadores, independentemente do tamanho.", ["cf-senado"]],
        ["mc", "Representação da Câmara", "O número de deputados de cada estado é, em regra, proporcional à:", ["População do estado", "Área do estado", "Renda do governador", "Ordem alfabética"], 0, "A Câmara representa o povo, com cadeiras proporcionais à população.", ["cf-camara"]],
        ["tf", "Quem o Senado representa", "O Senado representa os estados e o Distrito Federal.", true, "Verdadeiro. O Senado é a casa de representação dos entes federativos.", ["cf-senado"]],
      ],
    }),
    buildLesson({
      id: "g2",
      slug: "camara-dos-deputados",
      order: 2,
      title: "A Câmara dos Deputados",
      objective: "Conhecer o papel e a eleição dos deputados federais.",
      sources: [S.cam, CAMARA],
      teaching: [
        screen(
          "A casa do povo",
          "A Câmara dos Deputados representa o povo. São 513 deputados federais, eleitos por voto proporcional, com mandato de 4 anos.",
          "A idade mínima para ser deputado federal é 21 anos.",
        ),
      ],
      specs: [
        ["mc", "Quem a Câmara representa", "A Câmara dos Deputados representa:", ["O povo", "Os estados", "Os municípios", "As empresas"], 0, "A Câmara é a casa de representação do povo.", ["cf-camara"]],
        ["mc", "Mandato de deputado", "O mandato de deputado federal dura:", ["4 anos", "8 anos", "2 anos", "6 anos"], 0, "Deputados federais têm mandato de 4 anos.", ["cf-camara"]],
        ["mc", "Idade mínima (deputado)", "A idade mínima para ser deputado federal é:", ["21 anos", "18 anos", "35 anos", "30 anos"], 0, "São exigidos 21 anos para deputado federal.", ["cf-camara"]],
        ["mc", "Sistema de eleição", "Deputados são eleitos pelo sistema:", ["Proporcional", "Majoritário puro", "Por sorteio", "Por indicação do presidente"], 0, "A Câmara usa o sistema proporcional.", ["cf-camara"]],
        ["tf", "Iniciativa de leis", "A Câmara, em regra, é a Casa onde começam a tramitar muitos projetos de lei.", true, "Verdadeiro. Em geral a Câmara é a Casa iniciadora.", ["cf-processo"]],
        ["mc", "Competência exclusiva", "É papel típico da Câmara, entre outros:", ["Autorizar a instauração de processo contra o Presidente", "Julgar o Presidente por crime de responsabilidade", "Nomear ministros do STF", "Comandar as Forças Armadas"], 0, "Cabe à Câmara autorizar a instauração de processo; o julgamento é do Senado.", ["cf-camara"]],
        ["tf", "Fiscalização", "A Câmara também fiscaliza o Poder Executivo.", true, "Verdadeiro. Fiscalizar o Executivo é função do Legislativo.", ["cf-camara"]],
        ["mc", "Tamanho da Câmara", "O número total de deputados federais é:", ["513", "81", "27", "308"], 0, "São 513 deputados federais.", ["cf-camara"]],
      ],
    }),
    buildLesson({
      id: "g3",
      slug: "senado-federal",
      order: 3,
      title: "O Senado Federal",
      objective: "Conhecer o papel e a eleição dos senadores.",
      sources: [S.sen, SENADO],
      teaching: [
        screen(
          "A casa dos estados",
          "O Senado representa os estados e o DF: 81 senadores (3 por unidade), com mandato de 8 anos.",
          "A idade mínima para ser senador é 35 anos.",
        ),
      ],
      specs: [
        ["mc", "Mandato de senador", "O mandato de senador dura:", ["8 anos", "4 anos", "2 anos", "6 anos"], 0, "Senadores têm mandato de 8 anos.", ["cf-senado"]],
        ["mc", "Senadores por estado", "Cada estado (e o DF) elege:", ["3 senadores", "1 senador", "5 senadores", "10 senadores"], 0, "São 3 senadores por estado e pelo DF, totalizando 81.", ["cf-senado"]],
        ["mc", "Idade mínima (senador)", "A idade mínima para ser senador é:", ["35 anos", "21 anos", "18 anos", "30 anos"], 0, "São exigidos 35 anos para senador.", ["cf-senado"]],
        ["mc", "Competência do Senado", "Compete privativamente ao Senado:", ["Julgar o Presidente por crime de responsabilidade", "Aprovar o próprio salário do povo", "Nomear o técnico da seleção", "Definir o preço do combustível"], 0, "O julgamento por crime de responsabilidade cabe ao Senado.", ["cf-senado"]],
        ["tf", "Casa revisora", "O Senado frequentemente atua como Casa revisora de projetos iniciados na Câmara.", true, "Verdadeiro. A revisão pela outra Casa é parte do bicameralismo.", ["cf-processo"]],
        ["mc", "Aprovar autoridades", "O Senado também participa da escolha de autoridades ao:", ["Aprovar indicações, como ministros do STF", "Nomear deputados", "Demitir governadores", "Criar municípios"], 0, "O Senado sabatina e aprova indicações, como ministros do STF.", ["cf-senado"]],
        ["tf", "Igualdade entre estados no Senado", "No Senado, um estado pequeno tem o mesmo número de senadores que um estado grande.", true, "Verdadeiro. Todos elegem 3 senadores, independentemente do tamanho.", ["cf-senado"]],
        ["mc", "Total de senadores", "O número total de senadores é:", ["81", "513", "27", "54"], 0, "São 81 senadores no total.", ["cf-senado"]],
      ],
    }),
    buildLesson({
      id: "g4",
      slug: "como-tramita-uma-lei",
      order: 4,
      title: "Como tramita uma lei",
      objective: "Descrever as fases do processo legislativo.",
      sources: [S.proc, CAMARA],
      teaching: [
        screen(
          "Da proposta à lei",
          "Em linhas gerais: iniciativa → análise em comissões → votação no Plenário de uma Casa → revisão na outra Casa → sanção ou veto do Presidente → promulgação e publicação.",
        ),
      ],
      specs: [
        ["mc", "Início da tramitação", "A primeira fase do processo legislativo é:", ["A iniciativa (apresentação do projeto)", "A sanção", "A promulgação", "A publicação"], 0, "Tudo começa com a iniciativa/apresentação do projeto.", ["cf-processo"]],
        ["mc", "Papel das comissões", "As comissões servem para:", ["Analisar o mérito e dar pareceres sobre os projetos", "Eleger o presidente", "Julgar crimes", "Arrecadar impostos"], 0, "As comissões temáticas analisam e emitem pareceres.", ["cf-processo"]],
        ["tf", "Revisão bicameral", "Um projeto aprovado numa Casa é, em regra, revisado pela outra.", true, "Verdadeiro. É o papel da Casa revisora.", ["cf-processo"]],
        ["mc", "Sanção e veto", "Após o Congresso aprovar, o Presidente pode:", ["Sancionar ou vetar", "Apenas assistir", "Prender parlamentares", "Reescrever a Constituição"], 0, "Cabe ao Presidente sancionar ou vetar o projeto aprovado.", ["cf-processo"]],
        ["mc", "Derrubada de veto", "Um veto presidencial pode ser:", ["Analisado e derrubado pelo Congresso", "Mantido para sempre sem análise", "Transformado em emenda", "Ignorado pelo Judiciário sempre"], 0, "O Congresso pode manter ou derrubar o veto.", ["cf-processo"]],
        ["tf", "Projeto x lei", "Enquanto tramita, um projeto de lei ainda não é lei em vigor.", true, "Verdadeiro. Só vira lei após aprovação, sanção/promulgação e publicação.", ["cf-processo"]],
        ["mc", "Promulgação e publicação", "As últimas etapas, que dão existência e conhecimento à lei, são:", ["Promulgação e publicação", "Iniciativa e discussão", "Sanção e veto", "Emenda e arquivamento"], 0, "A lei é promulgada e publicada para passar a valer.", ["cf-processo"]],
        ["mc", "Iniciativa popular", "Além de parlamentares e do Executivo, quem mais pode propor lei?", ["A população, por iniciativa popular", "Apenas o STF", "Apenas empresas", "Ninguém"], 0, "A iniciativa popular permite à população propor projetos.", ["cf-processo"]],
      ],
    }),
    buildLesson({
      id: "g5",
      slug: "fiscalizar-o-executivo",
      order: 5,
      title: "Fiscalizar o Executivo",
      objective: "Entender instrumentos de fiscalização do Legislativo.",
      sources: [S.org, CAMARA],
      teaching: [
        screen(
          "Controle sobre o governo",
          "O Legislativo fiscaliza o Executivo: convoca autoridades, pede informações, aprova o orçamento e julga as contas, e pode criar Comissões Parlamentares de Inquérito (CPIs).",
        ),
      ],
      specs: [
        ["mc", "O que é uma CPI", "Uma CPI serve para:", ["Investigar fato determinado por prazo certo", "Aprovar o orçamento", "Julgar crimes comuns", "Nomear ministros"], 0, "A CPI investiga fato determinado, com poderes de investigação próprios.", ["cf-legislativo-org"]],
        ["tf", "Fiscalização orçamentária", "Aprovar e acompanhar o orçamento é uma forma de o Legislativo fiscalizar o Executivo.", true, "Verdadeiro. O orçamento passa pelo Legislativo.", ["cf-legislativo-org"]],
        ["mc", "Convocar autoridades", "O Legislativo pode:", ["Convocar ministros para prestar informações", "Demitir ministros diretamente", "Nomear o presidente", "Fechar o Judiciário"], 0, "Pode convocar autoridades para prestar esclarecimentos.", ["cf-legislativo-org"]],
        ["mc", "Apoio técnico ao controle", "No controle externo das contas, o Congresso é auxiliado pelo:", ["Tribunal de Contas da União (TCU)", "Banco Central", "STF", "Ministério da Educação"], 0, "O TCU auxilia o Congresso no controle externo.", ["cf-legislativo-org"]],
        ["tf", "Pedido de informação", "Parlamentares podem requerer informações a autoridades do Executivo.", true, "Verdadeiro. É um instrumento de fiscalização.", ["cf-legislativo-org"]],
        ["mc", "Limite da CPI", "Uma CPI deve ter:", ["Fato determinado e prazo certo", "Poder de prender qualquer um sem regras", "Duração eterna", "Poder de condenar réus"], 0, "A CPI investiga fato determinado por prazo certo; não condena.", ["cf-legislativo-org"]],
        ["tf", "Separação ao fiscalizar", "Ao fiscalizar, o Legislativo não substitui o Judiciário: investiga, mas não julga crimes.", true, "Verdadeiro. A CPI investiga; cabe a outros órgãos processar e julgar.", ["cf-legislativo-org"]],
        ["mc", "Por que fiscalizar", "A fiscalização do Executivo pelo Legislativo é importante para:", ["Controlar o uso do poder e do dinheiro público", "Enfraquecer a democracia", "Favorecer o governo", "Impedir eleições"], 0, "O controle entre Poderes protege a democracia e o erário.", ["cf-legislativo-org"]],
      ],
    }),
  ],
});

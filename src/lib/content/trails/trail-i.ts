import { buildLesson, buildTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria I — O Poder Judiciário por dentro. DRAFT, Premium. */
const S = {
  org: cf("judiciario-org", "Art. 92 a 98 (órgãos do Poder Judiciário)."),
  stf: cf("stf", "Art. 101 a 103 (Supremo Tribunal Federal)."),
  gar: cf("judiciario-garantias", "Art. 95 (garantias dos juízes) e Art. 93."),
  mp: cf("ministerio-publico", "Art. 127 a 130 (Ministério Público, função essencial à Justiça)."),
};

export const trailI = buildTrail({
  id: "trilha-i",
  slug: "poder-judiciario-por-dentro",
  order: 9,
  title: "O Poder Judiciário por dentro",
  description:
    "Quem julga o quê, o papel do STF, as instâncias, as garantias dos juízes e o Ministério Público.",
  lessons: [
    buildLesson({
      id: "i1",
      slug: "o-que-faz-o-judiciario",
      order: 1,
      title: "O que faz o Judiciário",
      objective: "Entender a função de julgar e aplicar a lei.",
      sources: [S.org],
      teaching: [
        screen(
          "Quem resolve conflitos",
          "O Judiciário julga conflitos e aplica as leis a casos concretos, com imparcialidade.",
          "Ele garante que direitos sejam respeitados e que ninguém faça justiça com as próprias mãos.",
        ),
      ],
      specs: [
        ["mc", "Função do Judiciário", "A função típica do Judiciário é:", ["Julgar conflitos aplicando a lei", "Fazer leis", "Administrar ministérios", "Arrecadar impostos"], 0, "O Judiciário julga e aplica as leis a casos concretos.", ["cf-judiciario-org"]],
        ["tf", "Imparcialidade", "O juiz deve decidir com imparcialidade, segundo a lei e as provas.", true, "Verdadeiro. A imparcialidade é essencial à função de julgar.", ["cf-judiciario-org"]],
        ["mc", "Acesso à Justiça", "Lesão ou ameaça a direito:", ["Pode ser levada ao Judiciário", "Nunca pode ser apreciada", "Só é vista pelo Executivo", "Depende de autorização do presidente"], 0, "A lei não pode afastar do Judiciário lesão ou ameaça a direito.", ["cf-judiciario-org"]],
        ["tf", "Justiça pelas próprias mãos", "A existência do Judiciário dispensa as pessoas de fazerem justiça por conta própria.", true, "Verdadeiro. O Estado assume a função de resolver conflitos.", ["cf-judiciario-org"]],
        ["mc", "Órgãos do Judiciário", "São órgãos do Judiciário, entre outros:", ["STF, STJ, tribunais e juízes", "Câmara e Senado", "Ministérios", "Prefeituras"], 0, "O Art. 92 lista STF, STJ, tribunais e juízes.", ["cf-judiciario-org"]],
        ["mc", "Decisão judicial", "Uma decisão judicial transitada em julgado:", ["Deve ser cumprida", "Pode ser ignorada", "Vale só se o Executivo quiser", "Não obriga ninguém"], 0, "Decisões definitivas devem ser cumpridas.", ["cf-judiciario-org"]],
        ["tf", "Judiciário e leis", "O Judiciário aplica as leis, mas não as cria do zero como o Legislativo.", true, "Verdadeiro. Legislar é do Legislativo; julgar é do Judiciário.", ["cf-judiciario-org"]],
        ["mc", "Papel na democracia", "Um Judiciário independente é importante porque:", ["Protege direitos e controla abusos de poder", "Serve ao governo de plantão", "Elimina o debate", "Faz campanha eleitoral"], 0, "A independência judicial protege direitos e limita o poder.", ["cf-judiciario-org"]],
      ],
    }),
    buildLesson({
      id: "i2",
      slug: "o-supremo-tribunal-federal",
      order: 2,
      title: "O Supremo Tribunal Federal",
      objective: "Conhecer o papel do STF como guardião da Constituição.",
      sources: [S.stf],
      teaching: [
        screen(
          "A guarda da Constituição",
          "O STF é o órgão de cúpula do Judiciário e o guardião da Constituição. Tem 11 ministros, nomeados pelo Presidente após aprovação do Senado.",
          "Julga, por exemplo, ações sobre a constitucionalidade de leis.",
        ),
      ],
      specs: [
        ["mc", "Papel do STF", "O STF é o:", ["Guardião da Constituição", "Chefe do Executivo", "Órgão que faz as leis", "Tribunal de contas"], 0, "O STF tem a missão principal de guardar a Constituição.", ["cf-stf"]],
        ["mc", "Número de ministros", "O STF é composto por:", ["11 ministros", "27 ministros", "81 ministros", "5 ministros"], 0, "São 11 ministros no STF.", ["cf-stf"]],
        ["mc", "Nomeação de ministros", "Os ministros do STF são:", ["Nomeados pelo Presidente, após aprovação do Senado", "Eleitos pelo povo", "Escolhidos por sorteio", "Indicados pela Câmara apenas"], 0, "O Presidente nomeia e o Senado aprova.", ["cf-stf"]],
        ["tf", "Controle de constitucionalidade", "O STF pode declarar uma lei inconstitucional.", true, "Verdadeiro. É parte do controle de constitucionalidade.", ["cf-stf"]],
        ["mc", "Requisitos do ministro", "Para ser ministro do STF exige-se, entre outros:", ["Notável saber jurídico e reputação ilibada", "Ser deputado", "Ser militar", "Ter mais de 80 anos"], 0, "Exige-se notável saber jurídico e reputação ilibada, entre 35 e 70 anos.", ["cf-stf"]],
        ["tf", "Última palavra constitucional", "Em matéria constitucional, o STF dá a palavra final no Judiciário.", true, "Verdadeiro. O STF é a instância máxima em questões constitucionais.", ["cf-stf"]],
        ["mc", "O que o STF NÃO faz", "O STF NÃO:", ["Edita leis como o Congresso", "Julga ações constitucionais", "Guarda a Constituição", "Decide conflitos entre Poderes"], 0, "Legislar é do Congresso; o STF julga, não legisla.", ["cf-stf"]],
        ["mc", "Importância da guarda", "Guardar a Constituição significa:", ["Assegurar que leis e atos respeitem a Constituição", "Mudar a Constituição livremente", "Ignorar a Constituição", "Fazer campanha"], 0, "O STF zela pela supremacia da Constituição.", ["cf-stf"]],
      ],
    }),
    buildLesson({
      id: "i3",
      slug: "instancias-e-recursos",
      order: 3,
      title: "Instâncias e recursos",
      objective: "Entender a ideia de instâncias e o duplo grau.",
      sources: [S.org],
      teaching: [
        screen(
          "Rever decisões",
          "Em geral, um caso começa na primeira instância (juiz) e pode ser revisto por tribunais (segunda instância) e, em certos casos, por tribunais superiores.",
          "Esse sistema permite corrigir erros — é o duplo grau de jurisdição.",
        ),
      ],
      specs: [
        ["mc", "Primeira instância", "Em regra, um processo começa:", ["Na primeira instância, com um juiz", "No STF", "No Senado", "Na prefeitura"], 0, "O caso começa, em geral, na primeira instância.", ["cf-judiciario-org"]],
        ["tf", "Duplo grau", "Uma decisão de primeira instância pode, em regra, ser revista por um tribunal.", true, "Verdadeiro. É o duplo grau de jurisdição.", ["cf-judiciario-org"]],
        ["mc", "Função do recurso", "Um recurso serve para:", ["Pedir a revisão de uma decisão", "Criar uma nova lei", "Eleger um juiz", "Arrecadar imposto"], 0, "O recurso busca a reanálise da decisão por instância superior.", ["cf-judiciario-org"]],
        ["mc", "Tribunais superiores", "Tribunais superiores (como STJ e STF):", ["Julgam questões específicas e recursos de todo o país", "Fazem leis", "Comandam a polícia", "Aprovam o orçamento"], 0, "Os superiores uniformizam e julgam recursos conforme sua competência.", ["cf-judiciario-org"]],
        ["tf", "Corrigir erros", "O sistema de instâncias ajuda a corrigir eventuais erros de julgamento.", true, "Verdadeiro. A revisão por outra instância reduz erros.", ["cf-judiciario-org"]],
        ["mc", "Trânsito em julgado", "Quando não cabem mais recursos, a decisão:", ["Transita em julgado e deve ser cumprida", "Pode ser ignorada", "É anulada automaticamente", "Vira lei"], 0, "Esgotados os recursos, a decisão se torna definitiva.", ["cf-judiciario-org"]],
        ["mc", "Justiças especializadas", "Além da Justiça comum, há Justiças especializadas, como a:", ["Justiça do Trabalho e a Eleitoral", "Justiça do Futebol", "Justiça das Empresas", "Justiça da TV"], 0, "Há Justiça do Trabalho, Eleitoral e Militar, entre outras.", ["cf-judiciario-org"]],
        ["tf", "Acesso a recursos", "Nem todo caso chega aos tribunais superiores; há requisitos para isso.", true, "Verdadeiro. O acesso aos superiores tem requisitos específicos.", ["cf-judiciario-org"]],
      ],
    }),
    buildLesson({
      id: "i4",
      slug: "garantias-dos-juizes",
      order: 4,
      title: "Garantias e imparcialidade dos juízes",
      objective: "Entender por que juízes têm garantias.",
      sources: [S.gar],
      teaching: [
        screen(
          "Independência para julgar",
          "Para julgar sem pressão, juízes têm garantias como a vitaliciedade, a inamovibilidade e a irredutibilidade de subsídios (Art. 95).",
          "Em troca, têm deveres e vedações (não podem, por exemplo, exercer atividade político-partidária).",
        ),
      ],
      specs: [
        ["mc", "Por que garantias", "As garantias dos juízes existem para:", ["Permitir decisões independentes, sem pressão", "Dar privilégios sem motivo", "Enriquecer juízes", "Favorecer o governo"], 0, "As garantias protegem a imparcialidade e a independência.", ["cf-judiciario-garantias"]],
        ["tf", "Inamovibilidade", "Em regra, um juiz não pode ser removido de onde atua contra a sua vontade, salvo exceções legais.", true, "Verdadeiro. A inamovibilidade protege contra remoções como punição.", ["cf-judiciario-garantias"]],
        ["mc", "Vedações", "Juízes NÃO podem:", ["Exercer atividade político-partidária", "Julgar casos", "Fundamentar decisões", "Aplicar a lei"], 0, "A Constituição veda atividade político-partidária aos juízes.", ["cf-judiciario-garantias"]],
        ["mc", "Fundamentação", "As decisões judiciais devem ser:", ["Fundamentadas (explicar os motivos)", "Secretas sempre", "Sem explicação", "Decididas por sorteio"], 0, "A fundamentação das decisões é exigência constitucional.", ["cf-judiciario-garantias"]],
        ["tf", "Garantias x privilégios", "As garantias dos juízes servem ao cidadão, pois asseguram julgamentos imparciais.", true, "Verdadeiro. Protegem o jurisdicionado, não só o juiz.", ["cf-judiciario-garantias"]],
        ["mc", "Ingresso na carreira", "O ingresso na magistratura, em regra, se dá por:", ["Concurso público de provas e títulos", "Indicação política", "Herança", "Eleição popular"], 0, "A carreira inicia-se por concurso público.", ["cf-judiciario-garantias"]],
        ["mc", "Irredutibilidade", "A irredutibilidade de subsídios impede:", ["A redução do salário do juiz como forma de pressão", "Qualquer salário", "A aposentadoria", "A promoção"], 0, "Protege contra retaliação via corte de remuneração.", ["cf-judiciario-garantias"]],
        ["tf", "Transparência", "Os julgamentos do Judiciário, em regra, são públicos.", true, "Verdadeiro. A publicidade é a regra, com exceções previstas em lei.", ["cf-judiciario-garantias"]],
      ],
    }),
    buildLesson({
      id: "i5",
      slug: "ministerio-publico",
      order: 5,
      title: "O Ministério Público",
      objective: "Entender o papel do MP como fiscal da lei e defensor da sociedade.",
      sources: [S.mp],
      teaching: [
        screen(
          "Defensor da sociedade",
          "O Ministério Público (MP) não é um dos três Poderes: é uma instituição permanente, essencial à Justiça, que defende a ordem jurídica e os interesses da sociedade.",
          "Promotores e procuradores podem, por exemplo, propor ações para proteger direitos coletivos.",
        ),
      ],
      specs: [
        ["mc", "O que é o MP", "O Ministério Público é:", ["Instituição essencial à Justiça, defensora da sociedade", "Um quarto Poder que manda nos outros", "Parte do Executivo comum", "Um partido político"], 0, "O MP é instituição permanente, essencial à função jurisdicional.", ["cf-ministerio-publico"]],
        ["tf", "MP é Poder?", "O Ministério Público é um dos três Poderes da República.", false, "Falso. O MP é função essencial à Justiça, não um dos três Poderes.", ["cf-ministerio-publico"]],
        ["mc", "Função do MP", "Cabe ao MP, entre outras funções:", ["Defender a ordem jurídica e os interesses sociais", "Fazer leis", "Governar estados", "Julgar e condenar réus"], 0, "O MP defende a ordem jurídica; quem julga é o juiz.", ["cf-ministerio-publico"]],
        ["mc", "Ação penal", "Em crimes de ação pública, quem acusa em juízo é, em regra:", ["O Ministério Público", "A vítima sozinha", "O juiz", "A polícia"], 0, "O MP é o titular da ação penal pública.", ["cf-ministerio-publico"]],
        ["tf", "Direitos coletivos", "O MP pode atuar na defesa de direitos difusos e coletivos (meio ambiente, consumidor etc.).", true, "Verdadeiro. É uma de suas funções constitucionais.", ["cf-ministerio-publico"]],
        ["mc", "Independência do MP", "A autonomia do MP serve para:", ["Permitir que fiscalize até o poder público sem pressão", "Favorecer o governo", "Eliminar a defesa dos réus", "Substituir o Judiciário"], 0, "A autonomia garante fiscalização imparcial, inclusive do Estado.", ["cf-ministerio-publico"]],
        ["mc", "MP e juiz", "No processo penal, MP e juiz têm papéis:", ["Diferentes: o MP acusa, o juiz julga", "Idênticos", "Trocados livremente", "Decididos pelo réu"], 0, "O MP acusa; o juiz julga — papéis distintos.", ["cf-ministerio-publico"]],
        ["tf", "Fiscal da lei", "O MP também atua como fiscal da aplicação da lei.", true, "Verdadeiro. É conhecido como “fiscal da lei” em muitas atuações.", ["cf-ministerio-publico"]],
      ],
    }),
  ],
});

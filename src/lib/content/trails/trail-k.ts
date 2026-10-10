import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria K — Federalismo na prática. Publicada, Premium. */
const S = {
  entes: cf("entes", "Art. 18 (entes federativos autônomos)."),
  uniao: cf("uniao-comp", "Art. 21 e 22 (competências da União)."),
  estados: cf("estados-comp", "Art. 25 (estados) e Art. 24 (competência concorrente)."),
  mun: cf("municipios-comp", "Art. 29 e 30 (municípios; interesse local)."),
  comum: cf("comum", "Art. 23 (competência comum) e Art. 24 (concorrente)."),
};

export const trailK = publishTrail(
  buildTrail({
    id: "trilha-k",
    slug: "federalismo-na-pratica",
    order: 11,
    title: "Federalismo na prática",
    description:
      "União, estados, DF e municípios: quem é autônomo, quem cuida de quê e por que tantas áreas são compartilhadas.",
    lessons: [
      buildLesson({
        id: "k1",
        slug: "o-que-e-federalismo",
        order: 1,
        title: "O que é federalismo",
        objective: "Entender a federação como união de entes autônomos.",
        sources: [S.entes],
        teaching: [
          screen(
            "Um país, vários governos",
            "Federalismo é um modo de organizar o Estado em que vários entes têm governo próprio e dividem o poder.",
            "No Brasil, os entes são a União, os estados, o Distrito Federal e os municípios — todos autônomos (Art. 18).",
          ),
        ],
        specs: [
          ["mc", "Definir federalismo", "Federalismo é:", ["A divisão do poder entre entes com governo próprio", "Um único governo central que decide tudo", "Um tipo de imposto", "Um partido político"], 0, "Na federação, o poder é dividido entre entes autônomos.", ["cf-entes"]],
          ["mc", "Entes da federação", "São entes da federação brasileira:", ["União, estados, DF e municípios", "Apenas a União", "Apenas estados e municípios", "As regiões Norte, Sul etc."], 0, "O Art. 18 lista União, estados, DF e municípios.", ["cf-entes"]],
          ["tf", "Autonomia", "Na federação brasileira, cada ente tem autonomia (governo e competências próprios).", true, "Verdadeiro. Todos os entes são autônomos, dentro da Constituição.", ["cf-entes"]],
          ["mc", "O município é ente?", "No Brasil, o município:", ["É um ente federativo autônomo", "É só um bairro", "Não tem governo próprio", "Pertence à União"], 0, "O município brasileiro é ente federativo autônomo — uma peculiaridade do nosso federalismo.", ["cf-entes"]],
          ["tf", "Federalismo x unitário", "Num Estado unitário há vários governos autônomos como numa federação.", false, "Falso. No Estado unitário o poder é concentrado; na federação ele é dividido.", ["cf-entes"]],
          ["mc", "Vantagem do federalismo", "Uma vantagem apontada do federalismo é:", ["Aproximar decisões das realidades locais", "Concentrar tudo numa só pessoa", "Acabar com eleições", "Proibir leis locais"], 0, "A descentralização aproxima decisões das necessidades locais.", ["cf-entes"]],
          ["tf", "Limites da autonomia", "A autonomia dos entes é exercida dentro dos limites da Constituição.", true, "Verdadeiro. Autonomia não é independência absoluta.", ["cf-entes"]],
          ["mc", "Distrito Federal", "O Distrito Federal:", ["É um ente autônomo e acumula competências de estado e município", "É um município comum", "Pertence a um estado", "Não tem governo"], 0, "O DF é ente autônomo com competências estaduais e municipais.", ["cf-entes"]],
        ],
      }),
      buildLesson({
        id: "k2",
        slug: "o-que-cabe-a-uniao",
        order: 2,
        title: "O que cabe à União",
        objective: "Reconhecer competências típicas da União.",
        sources: [S.uniao],
        teaching: [
          screen(
            "Assuntos nacionais",
            "À União cabem assuntos de alcance nacional: defesa, relações exteriores, moeda, correios, diretrizes gerais de muitas áreas.",
            "Ela também legisla sobre temas de interesse de todo o país.",
          ),
        ],
        specs: [
          ["mc", "Competência da União", "É competência típica da União:", ["Emitir moeda e cuidar da defesa nacional", "Coletar o lixo do seu bairro", "Definir o IPTU da sua casa", "Organizar a creche municipal"], 0, "Moeda e defesa são assuntos nacionais, da União.", ["cf-uniao-comp"]],
          ["tf", "Relações exteriores", "Manter relações com outros países é competência da União.", true, "Verdadeiro. As relações exteriores cabem à União.", ["cf-uniao-comp"]],
          ["mc", "Moeda", "Quem pode emitir moeda no Brasil?", ["A União (por meio do sistema oficial)", "Cada estado", "Cada município", "Qualquer banco privado"], 0, "A emissão de moeda é competência exclusiva da União.", ["cf-uniao-comp"]],
          ["mc", "Defesa nacional", "As Forças Armadas estão ligadas a qual ente?", ["À União", "Aos municípios", "Aos estados", "Ao DF apenas"], 0, "A defesa nacional e as Forças Armadas são da União.", ["cf-uniao-comp"]],
          ["tf", "Diretrizes gerais", "A União pode estabelecer diretrizes gerais para áreas como educação.", true, "Verdadeiro. A União fixa normas gerais em diversas áreas.", ["cf-uniao-comp"]],
          ["mc", "Assunto nacional", "Qual destes é assunto de alcance nacional?", ["Política monetária", "Trajeto do ônibus da cidade", "Tapa-buraco de uma rua", "Praça do bairro"], 0, "Política monetária é nacional; os demais são locais.", ["cf-uniao-comp"]],
          ["tf", "União e serviços locais", "A União é responsável por consertar os buracos das ruas do seu bairro.", false, "Falso. Serviços locais são, em regra, do município.", ["cf-uniao-comp"]],
          ["mc", "Correios", "O serviço postal é, em regra, competência:", ["Da União", "Do município", "Do estado", "De cada bairro"], 0, "O serviço postal é competência da União.", ["cf-uniao-comp"]],
        ],
      }),
      buildLesson({
        id: "k3",
        slug: "o-que-cabe-aos-estados",
        order: 3,
        title: "O que cabe aos estados",
        objective: "Reconhecer competências típicas dos estados.",
        sources: [S.estados],
        teaching: [
          screen(
            "O nível regional",
            "Os estados cuidam de temas regionais e têm competências remanescentes (o que não é da União nem dos municípios).",
            "Exemplos: polícia militar e civil, parte da educação e da saúde, organização do próprio governo.",
          ),
        ],
        specs: [
          ["mc", "Competência estadual", "É típico dos estados:", ["Manter a polícia militar e a polícia civil", "Emitir moeda", "Cuidar das relações exteriores", "Definir o serviço postal"], 0, "A segurança pública ostensiva estadual cabe às polícias militar e civil.", ["cf-estados-comp"]],
          ["tf", "Competência remanescente", "Cabem aos estados as competências que não foram atribuídas à União nem aos municípios.", true, "Verdadeiro. É a chamada competência remanescente dos estados.", ["cf-estados-comp"]],
          ["mc", "Constituição estadual", "Cada estado:", ["Tem sua própria Constituição, respeitando a federal", "Não pode ter Constituição", "Usa a Constituição de outro país", "Depende do município"], 0, "Estados têm Constituições próprias, subordinadas à federal.", ["cf-estados-comp"]],
          ["mc", "Polícia militar", "A polícia militar é mantida, em regra, pelo:", ["Estado", "Município", "União apenas", "Bairro"], 0, "A PM é uma força estadual.", ["cf-estados-comp"]],
          ["tf", "Autonomia estadual", "Os estados organizam seu próprio governo (Executivo, Legislativo e Judiciário estaduais).", true, "Verdadeiro. Cada estado tem sua estrutura de Poderes.", ["cf-estados-comp"]],
          ["mc", "Governo estadual", "O Legislativo estadual é:", ["A Assembleia Legislativa", "A Câmara dos Vereadores", "O Senado", "A Câmara dos Deputados"], 0, "No estado, o Legislativo é a Assembleia Legislativa.", ["cf-estados-comp"]],
          ["tf", "Educação e saúde", "Estados também atuam em áreas compartilhadas, como educação e saúde.", true, "Verdadeiro. São áreas de atuação conjunta entre os entes.", ["cf-estados-comp"]],
          ["mc", "Assunto regional", "Um exemplo de assunto mais regional é:", ["A segurança pública estadual", "A moeda nacional", "A creche do bairro", "O serviço postal"], 0, "A segurança pública estadual tem alcance regional.", ["cf-estados-comp"]],
        ],
      }),
      buildLesson({
        id: "k4",
        slug: "o-que-cabe-aos-municipios",
        order: 4,
        title: "O que cabe aos municípios",
        objective: "Reconhecer competências típicas dos municípios.",
        sources: [S.mun],
        teaching: [
          screen(
            "O interesse local",
            "Os municípios cuidam de assuntos de interesse local (Art. 30): transporte urbano, coleta de lixo, iluminação, educação infantil, uso do solo urbano.",
            "Cada município tem sua Lei Orgânica, uma espécie de “constituição municipal”.",
          ),
        ],
        specs: [
          ["mc", "Competência municipal", "É típico dos municípios:", ["Organizar o transporte coletivo urbano", "Emitir moeda", "Cuidar das Forças Armadas", "Definir a política externa"], 0, "O transporte urbano é interesse local, do município.", ["cf-municipios-comp"]],
          ["tf", "Interesse local", "Os municípios cuidam de assuntos de interesse local.", true, "Verdadeiro. É a base da competência municipal (Art. 30).", ["cf-municipios-comp"]],
          ["mc", "Lei Orgânica", "A “constituição” de um município é:", ["A Lei Orgânica do município", "A Constituição Federal", "A Constituição estadual", "O regimento da Câmara dos Deputados"], 0, "Cada município se organiza por sua Lei Orgânica.", ["cf-municipios-comp"]],
          ["mc", "Educação infantil", "A educação infantil (creches e pré-escola) é responsabilidade principal:", ["Do município", "Da União", "Do estado", "Do bairro"], 0, "A educação infantil é prioridade municipal.", ["cf-municipios-comp"]],
          ["tf", "Coleta de lixo", "A coleta de lixo urbano é um serviço de interesse local.", true, "Verdadeiro. É típico do município.", ["cf-municipios-comp"]],
          ["mc", "Legislativo municipal", "O Legislativo do município é:", ["A Câmara dos Vereadores", "A Assembleia Legislativa", "O Senado", "O Congresso"], 0, "No município, o Legislativo é a Câmara dos Vereadores.", ["cf-municipios-comp"]],
          ["tf", "Cobrar a pessoa certa", "Saber de quem é a competência ajuda a cobrar o governo certo.", true, "Verdadeiro. Um buraco na rua local, por exemplo, é com o município.", ["cf-municipios-comp"]],
          ["mc", "Uso do solo urbano", "Definir regras de uso do solo urbano (zoneamento) é, em regra:", ["Do município", "Da União", "Do estado", "Do governo federal apenas"], 0, "O ordenamento do solo urbano é competência municipal.", ["cf-municipios-comp"]],
        ],
      }),
      buildLesson({
        id: "k5",
        slug: "competencias-compartilhadas",
        order: 5,
        title: "Competências compartilhadas",
        objective: "Entender competências comuns e concorrentes.",
        sources: [S.comum],
        teaching: [
          screen(
            "Quando todos atuam juntos",
            "Em muitas áreas, mais de um ente atua: é a competência comum (Art. 23), como saúde, educação e proteção do meio ambiente.",
            "Há também a competência concorrente (Art. 24): a União fixa normas gerais e os estados detalham.",
          ),
        ],
        specs: [
          ["mc", "Competência comum", "Saúde e educação são exemplos de competência:", ["Comum (vários entes atuam)", "Exclusiva da União", "Só dos municípios", "De nenhum ente"], 0, "São áreas de competência comum entre os entes.", ["cf-comum"]],
          ["tf", "Meio ambiente", "Proteger o meio ambiente é competência comum da União, estados, DF e municípios.", true, "Verdadeiro. Consta entre as competências comuns (Art. 23).", ["cf-comum"]],
          ["mc", "Competência concorrente", "Na competência concorrente, em regra:", ["A União fixa normas gerais e os estados detalham", "Só o município legisla", "Ninguém pode legislar", "Só a União pode tudo"], 0, "Na concorrente, a União dá normas gerais e os estados suplementam.", ["cf-comum"]],
          ["mc", "Por que compartilhar", "Competências compartilhadas existem porque:", ["Muitos problemas exigem atuação de vários níveis", "Um só nível resolve tudo sempre", "É proibido cooperar", "Ninguém quer responsabilidade"], 0, "Áreas complexas, como saúde, pedem cooperação entre entes.", ["cf-comum"]],
          ["tf", "Cooperação federativa", "Os entes podem cooperar entre si para prestar serviços.", true, "Verdadeiro. A cooperação federativa é prevista e incentivada.", ["cf-comum"]],
          ["mc", "Exemplo de atuação conjunta", "O SUS (saúde pública) é um exemplo de:", ["Atuação conjunta de União, estados e municípios", "Serviço só federal", "Serviço só municipal", "Serviço privado"], 0, "O SUS integra os três níveis de governo.", ["cf-comum"]],
          ["tf", "Conflito de competências", "Quando há dúvida sobre de quem é a competência, o Judiciário pode decidir.", true, "Verdadeiro. Conflitos de competência podem ir ao Judiciário.", ["cf-comum"]],
          ["mc", "Norma geral e específica", "Na competência concorrente, se o estado detalha uma norma, ele deve:", ["Respeitar as normas gerais da União", "Ignorar a União", "Criar moeda", "Legislar sobre defesa nacional"], 0, "O detalhamento estadual respeita as normas gerais federais.", ["cf-comum"]],
        ],
      }),
    ],
  }),
);

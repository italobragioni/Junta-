import { buildLesson, buildTrail, screen } from "../builders";
import { cf, TSE } from "../sources";

/** Categoria J — Eleições e voto. DRAFT, Premium. */
const S = {
  voto: cf("voto", "Art. 14 (soberania popular; voto; alistamento)."),
  eleg: cf("elegibilidade", "Art. 14, § 3º (condições de elegibilidade) e § 1º (obrigatoriedade do voto)."),
  sist: cf("sistema-eleitoral", "Art. 45 (proporcional) e Art. 46 (majoritário no Senado)."),
};

export const trailJ = buildTrail({
  id: "trilha-j",
  slug: "eleicoes-e-voto",
  order: 10,
  title: "Eleições e voto",
  description:
    "Como funciona o voto no Brasil, quem pode votar e ser votado, os sistemas eleitorais e o papel da Justiça Eleitoral.",
  lessons: [
    buildLesson({
      id: "j1",
      slug: "o-voto-no-brasil",
      order: 1,
      title: "O voto no Brasil",
      objective: "Entender as características do voto (direto, secreto, universal, periódico).",
      sources: [S.voto, TSE],
      teaching: [
        screen(
          "Como é o nosso voto",
          "No Brasil, o voto é direto, secreto, universal e periódico (Art. 14).",
          "“Direto”: você vota diretamente no candidato. “Secreto”: ninguém pode saber seu voto. “Universal”: amplo a todos os cidadãos aptos. “Periódico”: há eleições regulares.",
        ),
      ],
      specs: [
        ["mc", "Características do voto", "O voto no Brasil é:", ["Direto, secreto, universal e periódico", "Indireto e aberto", "Comprado e vendido", "Decidido pelo governo"], 0, "O Art. 14 define o voto como direto, secreto, universal e periódico.", ["cf-voto"]],
        ["tf", "Voto secreto", "Ninguém pode ser obrigado a revelar em quem votou.", true, "Verdadeiro. O voto é secreto.", ["cf-voto"]],
        ["mc", "Voto direto", "“Voto direto” significa que:", ["O eleitor vota diretamente no candidato", "Outra pessoa vota por você", "O governo escolhe", "O voto é por sorteio"], 0, "No voto direto, o eleitor escolhe diretamente.", ["cf-voto"]],
        ["tf", "Periodicidade", "Eleições periódicas são uma característica da democracia.", true, "Verdadeiro. A renovação periódica do poder é essencial.", ["cf-voto"]],
        ["mc", "Soberania popular", "O voto é uma expressão da:", ["Soberania popular", "Vontade de um só poder", "Decisão judicial", "Ordem militar"], 0, "Pelo voto, o povo exerce a soberania popular.", ["cf-voto"]],
        ["mc", "Voto universal", "“Universal” quer dizer que o direito de votar é:", ["Amplo, para os cidadãos aptos, sem restrições indevidas", "Só para ricos", "Só para quem tem diploma", "Só para homens"], 0, "O sufrágio universal não admite restrições de renda, sexo ou instrução.", ["cf-voto"]],
        ["tf", "Compra de votos", "Comprar ou vender votos é permitido.", false, "Falso. Compra de votos é crime eleitoral.", ["cf-voto"]],
        ["mc", "Importância do voto", "O voto permite ao cidadão:", ["Escolher representantes e influenciar os rumos do país", "Nada mudar", "Apenas assistir", "Eleger juízes do STF"], 0, "Pelo voto, elegemos representantes e influenciamos políticas.", ["cf-voto"]],
      ],
    }),
    buildLesson({
      id: "j2",
      slug: "quem-pode-votar",
      order: 2,
      title: "Quem pode (e deve) votar",
      objective: "Distinguir voto obrigatório e facultativo.",
      sources: [S.eleg, TSE],
      teaching: [
        screen(
          "Obrigatório e facultativo",
          "O voto é obrigatório para quem tem entre 18 e 70 anos.",
          "É facultativo para quem tem 16 ou 17 anos, para maiores de 70 e para analfabetos.",
        ),
      ],
      specs: [
        ["mc", "Voto obrigatório", "O voto é obrigatório para pessoas com:", ["Entre 18 e 70 anos", "Menos de 16 anos", "Mais de 70 anos", "Qualquer idade"], 0, "A obrigatoriedade vale dos 18 aos 70 anos.", ["cf-elegibilidade"]],
        ["mc", "Voto facultativo (jovens)", "Para jovens de 16 e 17 anos, o voto é:", ["Facultativo", "Obrigatório", "Proibido", "Decidido pelos pais"], 0, "Aos 16 e 17 anos, o voto é facultativo.", ["cf-elegibilidade"]],
        ["tf", "Maiores de 70", "Para maiores de 70 anos, o voto é facultativo.", true, "Verdadeiro. Acima de 70 anos, votar é uma opção.", ["cf-elegibilidade"]],
        ["mc", "Analfabetos", "Para pessoas analfabetas, o voto é:", ["Facultativo", "Obrigatório", "Proibido", "Indireto"], 0, "O voto é facultativo para analfabetos.", ["cf-elegibilidade"]],
        ["tf", "Idade mínima para votar", "É possível tirar o título e votar a partir dos 16 anos.", true, "Verdadeiro. A partir dos 16 o voto é facultativo.", ["cf-elegibilidade"]],
        ["mc", "Título de eleitor", "Para votar, o cidadão precisa:", ["Estar com o alistamento eleitoral em dia (título)", "Pagar uma taxa por voto", "Ser filiado a um partido", "Ter ensino superior"], 0, "O alistamento eleitoral (título) é condição para votar.", ["cf-voto"]],
        ["mc", "Quem não pode votar", "Não podem alistar-se como eleitores:", ["Estrangeiros e conscritos no serviço militar obrigatório", "Jovens de 16 anos", "Idosos", "Analfabetos"], 0, "Estrangeiros e conscritos não se alistam (Art. 14, § 2º).", ["cf-elegibilidade"]],
        ["tf", "Justificar ausência", "Quem tem voto obrigatório e não vota deve justificar a ausência.", true, "Verdadeiro. A ausência deve ser justificada para evitar penalidades.", ["cf-elegibilidade"]],
      ],
    }),
    buildLesson({
      id: "j3",
      slug: "quem-pode-ser-votado",
      order: 3,
      title: "Quem pode ser votado",
      objective: "Conhecer condições de elegibilidade e idades mínimas.",
      sources: [S.eleg],
      teaching: [
        screen(
          "Para se candidatar",
          "Há condições de elegibilidade: nacionalidade brasileira, alistamento, domicílio eleitoral, filiação partidária e idade mínima para cada cargo.",
          "Idades: 35 (Presidente e Senador), 30 (Governador), 21 (Deputado e Prefeito), 18 (Vereador).",
        ),
      ],
      specs: [
        ["mc", "Idade para Presidente", "A idade mínima para Presidente é:", ["35 anos", "18 anos", "21 anos", "30 anos"], 0, "Exige-se 35 anos para Presidente (e Senador).", ["cf-elegibilidade"]],
        ["mc", "Idade para Vereador", "A idade mínima para Vereador é:", ["18 anos", "21 anos", "30 anos", "35 anos"], 0, "São 18 anos para Vereador.", ["cf-elegibilidade"]],
        ["mc", "Idade para Deputado/Prefeito", "A idade mínima para Deputado e Prefeito é:", ["21 anos", "18 anos", "30 anos", "35 anos"], 0, "São 21 anos para Deputado (fed./est.) e Prefeito.", ["cf-elegibilidade"]],
        ["mc", "Idade para Governador", "A idade mínima para Governador é:", ["30 anos", "21 anos", "35 anos", "18 anos"], 0, "São 30 anos para Governador.", ["cf-elegibilidade"]],
        ["tf", "Filiação partidária", "Para se candidatar, em regra, é preciso ser filiado a um partido.", true, "Verdadeiro. A filiação partidária é condição de elegibilidade.", ["cf-elegibilidade"]],
        ["mc", "Condição de elegibilidade", "É condição de elegibilidade:", ["Ser brasileiro e estar com o alistamento em dia", "Ter conta em banco específico", "Ser dono de empresa", "Ter mais de 60 anos"], 0, "Nacionalidade e alistamento são condições de elegibilidade.", ["cf-elegibilidade"]],
        ["tf", "Domicílio eleitoral", "Candidatos precisam ter domicílio eleitoral na circunscrição em que concorrem.", true, "Verdadeiro. O domicílio eleitoral é exigido.", ["cf-elegibilidade"]],
        ["mc", "Inelegibilidade", "Pessoas inelegíveis são aquelas que:", ["Não preenchem requisitos ou estão impedidas por lei", "Têm qualquer idade", "Moram em capital", "Estudaram muito"], 0, "A inelegibilidade decorre de não cumprir requisitos ou de impedimentos legais.", ["cf-elegibilidade"]],
      ],
    }),
    buildLesson({
      id: "j4",
      slug: "sistemas-eleitorais",
      order: 4,
      title: "Sistemas eleitorais: majoritário e proporcional",
      objective: "Diferenciar os sistemas majoritário e proporcional.",
      sources: [S.sist],
      teaching: [
        screen(
          "Dois jeitos de contar votos",
          "Majoritário: vence quem tem mais votos (usado para Presidente, Governador, Prefeito e Senador).",
          "Proporcional: as cadeiras são distribuídas conforme os votos dos partidos/coligações (usado para Deputado e Vereador).",
        ),
      ],
      specs: [
        ["mc", "Sistema majoritário", "No sistema majoritário:", ["Vence quem tem mais votos", "As cadeiras são proporcionais", "Decide-se por sorteio", "O governo escolhe"], 0, "No majoritário, vence o mais votado.", ["cf-sistema-eleitoral"]],
        ["mc", "Cargos majoritários", "São eleitos pelo sistema majoritário:", ["Presidente, Governador, Prefeito e Senador", "Deputado federal", "Vereador", "Deputado estadual"], 0, "Executivos e o Senado usam o majoritário.", ["cf-sistema-eleitoral"]],
        ["mc", "Sistema proporcional", "No sistema proporcional:", ["As cadeiras se distribuem conforme a votação dos partidos", "Vence só o mais votado", "Não há partidos", "O juiz decide"], 0, "O proporcional distribui cadeiras conforme a votação partidária.", ["cf-sistema-eleitoral"]],
        ["mc", "Cargos proporcionais", "São eleitos pelo sistema proporcional:", ["Deputados e Vereadores", "Presidente", "Governador", "Senador"], 0, "Câmaras legislativas usam o proporcional.", ["cf-sistema-eleitoral"]],
        ["tf", "Segundo turno", "Em eleições majoritárias de maior porte, pode haver segundo turno se ninguém tiver maioria.", true, "Verdadeiro. Há segundo turno quando nenhum candidato alcança o mínimo exigido.", ["cf-sistema-eleitoral"]],
        ["mc", "Por que proporcional", "O sistema proporcional busca:", ["Refletir a diversidade de preferências na composição do Legislativo", "Dar tudo ao mais votado", "Eliminar partidos pequenos sempre", "Acabar com o voto"], 0, "O proporcional espelha a pluralidade de votos no Legislativo.", ["cf-sistema-eleitoral"]],
        ["tf", "Voto no partido", "No sistema proporcional, os votos dos candidatos de um partido influenciam o total do partido.", true, "Verdadeiro. A votação da legenda conta para a distribuição de cadeiras.", ["cf-sistema-eleitoral"]],
        ["mc", "Comparando sistemas", "A diferença central entre os sistemas é:", ["Como os votos viram cadeiras/cargos", "A cor da urna", "O dia da semana", "O tamanho do estado"], 0, "Os sistemas diferem na forma de converter votos em representação.", ["cf-sistema-eleitoral"]],
      ],
    }),
    buildLesson({
      id: "j5",
      slug: "justica-eleitoral",
      order: 5,
      title: "A Justiça Eleitoral",
      objective: "Entender o papel da Justiça Eleitoral (TSE e TREs).",
      sources: [S.voto, TSE],
      teaching: [
        screen(
          "Quem organiza as eleições",
          "A Justiça Eleitoral organiza, fiscaliza e julga as eleições. No topo está o TSE (Tribunal Superior Eleitoral), com os TREs nos estados.",
          "Ela cuida do alistamento, da votação, da apuração e da diplomação dos eleitos.",
        ),
      ],
      specs: [
        ["mc", "Papel da Justiça Eleitoral", "A Justiça Eleitoral:", ["Organiza, fiscaliza e julga as eleições", "Faz as leis eleitorais sozinha", "Governa os estados", "Define o orçamento"], 0, "Ela administra e julga o processo eleitoral.", ["cf-voto"]],
        ["mc", "Órgão de cúpula", "No topo da Justiça Eleitoral está o:", ["TSE (Tribunal Superior Eleitoral)", "STF", "TCU", "Senado"], 0, "O TSE é o órgão máximo da Justiça Eleitoral.", ["cf-voto"]],
        ["tf", "TREs", "Cada estado conta com um Tribunal Regional Eleitoral (TRE).", true, "Verdadeiro. Os TREs atuam nos estados.", ["cf-voto"]],
        ["mc", "Apuração", "A contagem dos votos e a divulgação do resultado são feitas:", ["Pela Justiça Eleitoral", "Por cada partido", "Pela imprensa", "Pelo presidente"], 0, "A apuração oficial é da Justiça Eleitoral.", ["cf-voto"]],
        ["tf", "Fiscalização de campanhas", "A Justiça Eleitoral pode fiscalizar campanhas e punir abusos.", true, "Verdadeiro. Ela julga irregularidades eleitorais.", ["cf-voto"]],
        ["mc", "Diplomação", "Após a eleição, os eleitos são:", ["Diplomados pela Justiça Eleitoral", "Nomeados pelo presidente", "Sorteados", "Escolhidos pela imprensa"], 0, "A diplomação dos eleitos cabe à Justiça Eleitoral.", ["cf-voto"]],
        ["mc", "Confiança no processo", "Uma Justiça Eleitoral independente serve para:", ["Dar confiança e lisura ao processo eleitoral", "Favorecer um candidato", "Eliminar o voto", "Aumentar impostos"], 0, "A independência assegura eleições limpas e confiáveis.", ["cf-voto"]],
        ["tf", "Alistamento", "O alistamento eleitoral (título) é cuidado pela Justiça Eleitoral.", true, "Verdadeiro. Ela administra o cadastro de eleitores.", ["cf-voto"]],
      ],
    }),
  ],
});

import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf, GOVBR } from "../sources";

/** Categoria H — O Poder Executivo por dentro. DRAFT, Premium. */
const S = {
  org: cf("executivo-org", "Art. 76 a 83 (Presidente e Vice; exercício do Executivo)."),
  comp: cf("executivo-comp", "Art. 84 (competências do Presidente da República)."),
  resp: cf("executivo-resp", "Art. 85 e 86 (crimes de responsabilidade; processo)."),
  mp: cf("medida-provisoria", "Art. 62 (medidas provisórias)."),
};

export const trailH = publishTrail(buildTrail({
  id: "trilha-h",
  slug: "poder-executivo-por-dentro",
  order: 8,
  title: "O Poder Executivo por dentro",
  description:
    "Quem é o Executivo em cada nível, o que o Presidente pode e não pode, ministérios, decretos e medidas provisórias.",
  lessons: [
    buildLesson({
      id: "h1",
      slug: "quem-e-o-executivo",
      order: 1,
      title: "Quem é o Executivo",
      objective: "Identificar os chefes do Executivo em cada nível.",
      sources: [S.org, GOVBR],
      teaching: [
        screen(
          "Quem administra",
          "O Executivo administra o país e executa as leis. No nível federal, o chefe é o Presidente; nos estados, os governadores; nos municípios, os prefeitos.",
          "Cada um é auxiliado por ministros ou secretários.",
        ),
      ],
      specs: [
        ["mc", "Chefe do Executivo federal", "O chefe do Poder Executivo federal é:", ["O Presidente da República", "O presidente do Senado", "O presidente do STF", "O procurador-geral"], 0, "O Presidente chefia o Executivo federal.", ["cf-executivo-org"]],
        ["mc", "Executivo estadual", "No estado, o Executivo é chefiado pelo:", ["Governador", "Prefeito", "Senador", "Desembargador"], 0, "O governador chefia o Executivo estadual.", ["cf-executivo-org"]],
        ["mc", "Executivo municipal", "No município, o Executivo é chefiado pelo:", ["Prefeito", "Vereador", "Governador", "Juiz"], 0, "O prefeito chefia o Executivo municipal.", ["cf-executivo-org"]],
        ["tf", "Função do Executivo", "Executar as leis e administrar os serviços públicos é função do Executivo.", true, "Verdadeiro. O Executivo administra e executa as leis.", ["cf-executivo-org"]],
        ["mc", "Auxiliares do Presidente", "O Presidente é auxiliado por:", ["Ministros de Estado", "Deputados", "Juízes", "Senadores"], 0, "Os ministros auxiliam o Presidente na administração.", ["cf-executivo-org"]],
        ["mc", "Vice-Presidente", "O Vice-Presidente, entre outras funções:", ["Substitui o Presidente em impedimentos e o sucede em caso de vaga", "Julga crimes", "Preside o Senado", "Comanda o STF"], 0, "O Vice substitui e sucede o Presidente conforme a Constituição.", ["cf-executivo-org"]],
        ["tf", "Nível local", "O prefeito cuida, em regra, dos assuntos de interesse local.", true, "Verdadeiro. O município trata do interesse local.", ["cf-executivo-org"]],
        ["mc", "Secretários", "Governadores e prefeitos são auxiliados por:", ["Secretários", "Ministros do STF", "Senadores", "Promotores"], 0, "Secretários estaduais e municipais auxiliam o Executivo local.", ["cf-executivo-org"]],
      ],
    }),
    buildLesson({
      id: "h2",
      slug: "o-que-o-presidente-pode",
      order: 2,
      title: "O que o Presidente pode fazer",
      objective: "Conhecer competências do Presidente (Art. 84).",
      sources: [S.comp],
      teaching: [
        screen(
          "Poderes e limites",
          "O Presidente sanciona e veta leis, edita decretos, nomeia ministros, representa o país no exterior e comanda as Forças Armadas — sempre nos limites da Constituição.",
        ),
      ],
      specs: [
        ["mc", "Competência presidencial", "É competência do Presidente:", ["Sancionar e vetar leis", "Julgar processos criminais", "Aprovar leis sozinho", "Legislar sem o Congresso"], 0, "Sancionar e vetar leis é competência do Presidente.", ["cf-executivo-comp"]],
        ["tf", "Nomear ministros", "O Presidente nomeia e exonera livremente os ministros de Estado.", true, "Verdadeiro. A nomeação de ministros é competência do Presidente.", ["cf-executivo-comp"]],
        ["mc", "Decretos", "O Presidente pode editar:", ["Decretos para regulamentar leis", "Leis sem o Congresso", "Sentenças judiciais", "Emendas constitucionais sozinho"], 0, "O decreto regulamenta a lei; não a substitui.", ["cf-executivo-comp"]],
        ["mc", "Relações exteriores", "Nas relações com outros países, o Presidente:", ["Representa o país e celebra tratados (sujeitos a referendo do Congresso)", "Não tem nenhum papel", "Decide tudo sem limites", "Precisa da autorização do STF para tudo"], 0, "O Presidente representa o país; tratados dependem do Congresso.", ["cf-executivo-comp"]],
        ["tf", "Limite constitucional", "Mesmo com muitos poderes, o Presidente está submetido à Constituição.", true, "Verdadeiro. Nenhuma autoridade está acima da Constituição.", ["cf-executivo-comp"]],
        ["mc", "O que o Presidente NÃO faz", "O Presidente NÃO pode:", ["Julgar e condenar réus", "Vetar um projeto", "Editar um decreto", "Nomear um ministro"], 0, "Julgar é função do Judiciário, não do Executivo.", ["cf-executivo-comp"]],
        ["mc", "Comando militar", "O Presidente é o comandante supremo:", ["Das Forças Armadas", "Do Congresso", "Dos tribunais", "Dos municípios"], 0, "O Presidente é o comandante supremo das Forças Armadas.", ["cf-executivo-comp"]],
        ["tf", "Sanção obrigatória", "O Presidente é obrigado a sancionar qualquer projeto que o Congresso aprovar.", false, "Falso. Ele pode vetar, total ou parcialmente.", ["cf-executivo-comp"]],
      ],
    }),
    buildLesson({
      id: "h3",
      slug: "ministerios-e-administracao",
      order: 3,
      title: "Ministérios e administração pública",
      objective: "Entender a estrutura administrativa do Executivo.",
      sources: [S.org, GOVBR],
      teaching: [
        screen(
          "A máquina pública",
          "O Executivo se organiza em ministérios e órgãos que executam políticas (saúde, educação, infraestrutura etc.).",
          "A administração pública deve seguir princípios: legalidade, impessoalidade, moralidade, publicidade e eficiência (Art. 37).",
        ),
      ],
      specs: [
        ["mc", "Princípios da administração", "São princípios da administração pública (Art. 37):", ["Legalidade, impessoalidade, moralidade, publicidade e eficiência", "Sigilo e favorecimento", "Pressa e informalidade", "Lucro e concorrência desleal"], 0, "O Art. 37 lista esses cinco princípios.", ["cf-executivo-org"]],
        ["tf", "Legalidade", "O administrador público só pode fazer o que a lei autoriza.", true, "Verdadeiro. Na administração, vale a legalidade estrita.", ["cf-executivo-org"]],
        ["mc", "Impessoalidade", "A impessoalidade exige que o administrador:", ["Trate todos sem favorecimento pessoal", "Beneficie amigos", "Esconda informações", "Aja por interesse próprio"], 0, "A impessoalidade veda favorecimentos pessoais.", ["cf-executivo-org"]],
        ["mc", "Publicidade", "O princípio da publicidade significa que, em regra, os atos públicos devem ser:", ["Transparentes e acessíveis", "Secretos", "Vendidos", "Esquecidos"], 0, "A publicidade garante transparência dos atos, salvo exceções legais.", ["cf-executivo-org"]],
        ["tf", "Concurso público", "Em regra, a investidura em cargo público efetivo depende de concurso público.", true, "Verdadeiro. O acesso a cargos efetivos exige concurso (Art. 37, II).", ["cf-executivo-org"]],
        ["mc", "Função dos ministérios", "Os ministérios servem para:", ["Executar políticas em suas áreas (saúde, educação etc.)", "Julgar processos", "Aprovar leis", "Fiscalizar o Judiciário"], 0, "Ministérios executam políticas setoriais.", ["cf-executivo-org"]],
        ["mc", "Eficiência", "O princípio da eficiência cobra da administração:", ["Bons resultados com bom uso de recursos", "Gastar o máximo possível", "Demorar ao máximo", "Ignorar o cidadão"], 0, "Eficiência é fazer bem com bom uso de recursos.", ["cf-executivo-org"]],
        ["tf", "Moralidade", "A administração deve agir conforme padrões de honestidade e boa-fé.", true, "Verdadeiro. É o princípio da moralidade administrativa.", ["cf-executivo-org"]],
      ],
    }),
    buildLesson({
      id: "h4",
      slug: "medidas-provisorias-e-decretos",
      order: 4,
      title: "Medidas provisórias e decretos",
      objective: "Diferenciar decreto, medida provisória e lei.",
      sources: [S.mp],
      teaching: [
        screen(
          "Instrumentos do Executivo",
          "Decreto regulamenta uma lei existente. Medida provisória (MP) tem força de lei imediata em casos de relevância e urgência, mas precisa ser aprovada pelo Congresso para continuar valendo.",
        ),
      ],
      specs: [
        ["mc", "Medida provisória", "Uma medida provisória:", ["Tem força de lei imediata, mas depende de aprovação do Congresso", "É uma sentença judicial", "Vale para sempre sem o Congresso", "É um decreto municipal"], 0, "A MP tem força de lei, mas precisa ser convertida em lei pelo Congresso.", ["cf-medida-provisoria"]],
        ["tf", "Requisitos da MP", "A medida provisória exige relevância e urgência.", true, "Verdadeiro. São requisitos do Art. 62.", ["cf-medida-provisoria"]],
        ["mc", "Decreto x lei", "Um decreto do Presidente serve para:", ["Regulamentar a aplicação de uma lei", "Substituir a Constituição", "Criar impostos sozinho", "Condenar réus"], 0, "O decreto regulamenta; não cria direito novo contra a lei.", ["cf-executivo-comp"]],
        ["tf", "MP sem Congresso", "Se o Congresso não aprovar, a medida provisória perde a validade.", true, "Verdadeiro. Não convertida em lei no prazo, a MP perde eficácia.", ["cf-medida-provisoria"]],
        ["mc", "Limite da MP", "A medida provisória NÃO pode:", ["Tratar de qualquer matéria vedada pela Constituição", "Ter força de lei", "Ser apreciada pelo Congresso", "Ser editada pelo Presidente"], 0, "Há matérias vedadas à MP pela Constituição.", ["cf-medida-provisoria"]],
        ["mc", "Controle do Congresso", "A necessidade de o Congresso aprovar a MP mostra:", ["O controle do Legislativo sobre o Executivo", "Que o Presidente legisla sozinho", "Que o Judiciário faz leis", "Que a MP é eterna"], 0, "A conversão pelo Congresso é um controle entre Poderes.", ["cf-medida-provisoria"]],
        ["tf", "Decreto contra a lei", "Um decreto pode contrariar a lei que regulamenta.", false, "Falso. O decreto deve obedecer à lei; não pode contrariá-la.", ["cf-executivo-comp"]],
        ["mc", "Por que existe a MP", "A medida provisória existe para:", ["Permitir resposta rápida em situações urgentes, sob controle do Congresso", "Dar poder ilimitado ao Presidente", "Acabar com o Legislativo", "Substituir o Judiciário"], 0, "A MP dá agilidade em urgências, mas com controle legislativo.", ["cf-medida-provisoria"]],
      ],
    }),
    buildLesson({
      id: "h5",
      slug: "limites-e-responsabilidade",
      order: 5,
      title: "Limites e responsabilidade do Presidente",
      objective: "Entender crimes de responsabilidade e o impeachment.",
      sources: [S.resp],
      teaching: [
        screen(
          "Ninguém acima da lei",
          "O Presidente pode responder por crimes de responsabilidade (atos que atentam contra a Constituição).",
          "O processo de impeachment é autorizado pela Câmara e julgado pelo Senado.",
        ),
      ],
      specs: [
        ["mc", "Crime de responsabilidade", "Crimes de responsabilidade do Presidente são:", ["Atos que atentam contra a Constituição e as instituições", "Qualquer opinião política", "Faltas escolares", "Multas de trânsito"], 0, "São infrações político-administrativas contra a Constituição.", ["cf-executivo-resp"]],
        ["mc", "Quem autoriza o processo", "A abertura do processo de impeachment é autorizada pela:", ["Câmara dos Deputados", "Polícia Federal", "OAB", "Imprensa"], 0, "A Câmara autoriza a instauração do processo.", ["cf-executivo-resp"]],
        ["mc", "Quem julga", "O julgamento do Presidente por crime de responsabilidade cabe ao:", ["Senado Federal", "STF", "TSE", "Congresso em peso"], 0, "O Senado julga o Presidente nesse caso.", ["cf-executivo-resp"]],
        ["tf", "Presidente e a lei", "O Presidente pode ser responsabilizado por seus atos.", true, "Verdadeiro. Ninguém está acima da lei, inclusive o Presidente.", ["cf-executivo-resp"]],
        ["mc", "Resultado do impeachment", "Se condenado em impeachment, o Presidente:", ["Perde o cargo", "Ganha mandato maior", "Vira senador", "Nada acontece"], 0, "A condenação leva à perda do cargo e inabilitação por período.", ["cf-executivo-resp"]],
        ["tf", "Devido processo", "O impeachment deve seguir o devido processo legal, com direito de defesa.", true, "Verdadeiro. Garante-se ampla defesa e contraditório.", ["cf-executivo-resp"]],
        ["mc", "Freio ao Executivo", "O impeachment é um exemplo de:", ["Controle sobre o chefe do Executivo", "Poder absoluto do Presidente", "Função do Judiciário comum", "Ato sem regras"], 0, "É um mecanismo de responsabilização e controle.", ["cf-executivo-resp"]],
        ["mc", "Separação de papéis", "No impeachment, Câmara e Senado têm papéis:", ["Diferentes: a Câmara autoriza, o Senado julga", "Idênticos", "Irrelevantes", "Decididos pelo Presidente"], 0, "Câmara autoriza; Senado julga — papéis distintos.", ["cf-executivo-resp"]],
      ],
    }),
  ],
}));

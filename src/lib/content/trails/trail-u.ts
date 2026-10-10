import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria U — Meio ambiente e sociedade. Publicada, Premium. */
const S = {
  amb: cf("meio-ambiente", "Art. 225 (direito ao meio ambiente ecologicamente equilibrado)."),
  comp: cf("competencia-ambiental", "Art. 23 e 24 (competência comum e concorrente em matéria ambiental)."),
};

export const trailU = publishTrail(
  buildTrail({
    id: "trilha-u",
    slug: "meio-ambiente-e-sociedade",
    order: 21,
    title: "Meio ambiente e sociedade",
    description:
      "O direito ao meio ambiente equilibrado, de quem é a responsabilidade e como a política ambiental afeta a vida.",
    lessons: [
      buildLesson({
        id: "u1",
        slug: "direito-ao-meio-ambiente",
        order: 1,
        title: "O direito ao meio ambiente equilibrado",
        objective: "Entender o meio ambiente como direito de todos e dever coletivo.",
        sources: [S.amb],
        teaching: [
          screen(
            "De todos, para todos",
            "O Art. 225 garante a todos o direito ao meio ambiente ecologicamente equilibrado, bem de uso comum do povo e essencial à qualidade de vida.",
            "E impõe ao poder público E à coletividade o dever de defendê-lo e preservá-lo para as presentes e futuras gerações.",
          ),
        ],
        specs: [
          ["mc", "Direito", "Segundo o Art. 225, o meio ambiente equilibrado é:", ["Direito de todos e essencial à qualidade de vida", "Propriedade de uma empresa", "Assunto só de cientistas", "Opcional"], 0, "É bem de uso comum do povo.", ["cf-meio-ambiente"]],
          ["tf", "Dever coletivo", "A defesa do meio ambiente é dever do poder público e também da coletividade.", true, "Verdadeiro. O Art. 225 impõe esse dever a ambos.", ["cf-meio-ambiente"]],
          ["mc", "Futuras gerações", "A Constituição manda preservar o meio ambiente para:", ["As presentes e futuras gerações", "Só a geração atual", "Só os donos de terra", "Ninguém"], 0, "O texto cita as presentes e futuras gerações.", ["cf-meio-ambiente"]],
          ["tf", "Qualidade de vida", "Um meio ambiente saudável está ligado à saúde e à qualidade de vida.", true, "Verdadeiro. São diretamente relacionados.", ["cf-meio-ambiente"]],
          ["mc", "Bem de uso comum", "Dizer que o meio ambiente é 'bem de uso comum do povo' significa:", ["Que pertence a todos e deve ser preservado por todos", "Que não tem dono nem regras", "Que é privado", "Que pode ser destruído"], 0, "É um bem coletivo, protegido por lei.", ["cf-meio-ambiente"]],
          ["mc", "Base legal", "O direito ao meio ambiente está:", ["No Art. 225 da Constituição", "Fora da Constituição", "Só em tratados", "Num decreto"], 0, "O Art. 225 é a base constitucional.", ["cf-meio-ambiente"]],
          ["tf", "Responsabilidade", "Quem polui pode ser obrigado a reparar o dano ambiental.", true, "Verdadeiro. Há responsabilização por danos (Art. 225, §3º).", ["cf-meio-ambiente"]],
          ["mc", "Exemplo de cuidado", "Um exemplo de cuidado ambiental cotidiano é:", ["Descartar lixo corretamente e economizar água", "Desmatar sem controle", "Poluir rios", "Queimar lixo"], 0, "Pequenas atitudes somam na preservação.", ["cf-meio-ambiente"]],
        ],
      }),
      buildLesson({
        id: "u2",
        slug: "de-quem-e-a-responsabilidade",
        order: 2,
        title: "De quem é a responsabilidade ambiental",
        objective: "Entender a divisão de competências entre os entes federativos.",
        sources: [S.comp],
        teaching: [
          screen(
            "Todos têm um papel",
            "Proteger o meio ambiente é competência COMUM de União, estados, Distrito Federal e municípios (Art. 23).",
            "E legislar sobre florestas, caça, pesca e proteção ambiental é competência CONCORRENTE (Art. 24): a União faz normas gerais e os estados complementam.",
          ),
        ],
        specs: [
          ["mc", "Competência comum", "Proteger o meio ambiente é competência:", ["Comum de União, estados, DF e municípios", "Só da União", "Só dos municípios", "De nenhum ente"], 0, "O Art. 23 define como competência comum.", ["cf-competencia-ambiental"]],
          ["tf", "Municípios", "Os municípios também têm papel na proteção ambiental.", true, "Verdadeiro. Integram a competência comum.", ["cf-competencia-ambiental"]],
          ["mc", "Competência concorrente", "Na competência concorrente, a União:", ["Edita normas gerais; os estados complementam", "Faz tudo sozinha", "Não participa", "Só fiscaliza"], 0, "A União faz normas gerais (Art. 24).", ["cf-competencia-ambiental"]],
          ["tf", "Cooperação", "Os entes devem cooperar para proteger o meio ambiente.", true, "Verdadeiro. A atuação conjunta é prevista.", ["cf-competencia-ambiental"]],
          ["mc", "Licenciamento", "Antes de uma grande obra que afeta o ambiente, costuma-se exigir:", ["Licenciamento ambiental", "Nada", "Apenas um aviso", "Só a opinião do dono"], 0, "O licenciamento avalia impactos antes da obra.", ["cf-meio-ambiente"]],
          ["mc", "Órgãos ambientais", "Fiscalizar e licenciar cabe a:", ["Órgãos ambientais dos três níveis (ex.: Ibama, estaduais, municipais)", "Nenhum órgão", "Só empresas", "Só ONGs"], 0, "Há órgãos ambientais em cada nível.", ["cf-competencia-ambiental"]],
          ["tf", "Estudo de impacto", "Obras com grande impacto podem exigir estudo prévio de impacto ambiental.", true, "Verdadeiro. O EIA é previsto no Art. 225.", ["cf-meio-ambiente"]],
          ["mc", "Papel do cidadão", "O cidadão pode:", ["Denunciar crimes ambientais aos órgãos competentes", "Ignorar tudo", "Poluir livremente", "Impedir qualquer fiscalização"], 0, "A denúncia é uma forma de participação.", ["cf-meio-ambiente"]],
        ],
      }),
      buildLesson({
        id: "u3",
        slug: "politica-ambiental-no-dia-a-dia",
        order: 3,
        title: "Política ambiental no dia a dia",
        objective: "Relacionar decisões públicas ambientais com a vida das pessoas.",
        sources: [S.amb],
        teaching: [
          screen(
            "Ambiente é vida prática",
            "Saneamento, coleta de lixo, qualidade do ar e da água, áreas verdes e saúde pública são todos temas ambientais que afetam o dia a dia.",
            "Decisões sobre esses temas são tomadas por governos e cobradas pela população.",
          ),
        ],
        specs: [
          ["mc", "Saneamento", "Saneamento básico inclui:", ["Água tratada, esgoto e coleta de lixo", "Apenas asfalto", "Só iluminação", "Só transporte"], 0, "Água, esgoto e lixo são pilares do saneamento.", ["cf-meio-ambiente"]],
          ["tf", "Saúde", "Falta de saneamento aumenta doenças na população.", true, "Verdadeiro. Saneamento e saúde estão ligados.", ["cf-meio-ambiente"]],
          ["mc", "Resíduos", "A coleta e destinação correta do lixo evita:", ["Poluição e doenças", "Mais árvores", "Economia de água", "Nada"], 0, "O manejo adequado reduz poluição e doenças.", ["cf-meio-ambiente"]],
          ["tf", "Áreas verdes", "Parques e áreas verdes melhoram a qualidade de vida nas cidades.", true, "Verdadeiro. Ajudam no clima urbano e no bem-estar.", ["cf-meio-ambiente"]],
          ["mc", "Qualidade do ar", "A poluição do ar afeta principalmente:", ["A saúde respiratória das pessoas", "Só as plantas", "Nada", "Apenas o campo"], 0, "O ar poluído prejudica a saúde.", ["cf-meio-ambiente"]],
          ["mc", "Decisão pública", "Quem decide políticas de saneamento e meio ambiente:", ["Os governos, cobrados pela população", "Só empresas privadas", "Ninguém", "Apenas o cidadão sozinho"], 0, "São políticas públicas sujeitas a cobrança.", ["cf-meio-ambiente"]],
          ["tf", "Participação", "A população pode participar de audiências sobre projetos ambientais.", true, "Verdadeiro. A participação é parte da gestão ambiental.", ["cf-meio-ambiente"]],
          ["mc", "Prevenção", "Cuidar do ambiente de forma preventiva:", ["Custa menos do que remediar depois", "É sempre inútil", "Atrapalha a saúde", "Não tem relação com dinheiro"], 0, "Prevenir costuma ser mais barato que reparar.", ["cf-meio-ambiente"]],
        ],
      }),
      buildLesson({
        id: "u4",
        slug: "desenvolvimento-e-sustentabilidade",
        order: 4,
        title: "Desenvolvimento e sustentabilidade",
        objective: "Entender a ideia de conciliar economia e preservação.",
        sources: [S.amb],
        teaching: [
          screen(
            "Crescer sem destruir",
            "Desenvolvimento sustentável é atender às necessidades de hoje sem comprometer as futuras gerações.",
            "A Constituição trata a defesa do meio ambiente como princípio da ordem econômica (Art. 170), ou seja, economia e meio ambiente não precisam ser inimigos.",
          ),
        ],
        specs: [
          ["mc", "Sustentabilidade", "Desenvolvimento sustentável é:", ["Crescer atendendo o presente sem comprometer o futuro", "Crescer destruindo tudo", "Não crescer nunca", "Ignorar o ambiente"], 0, "É o equilíbrio entre presente e futuro.", ["cf-meio-ambiente"]],
          ["tf", "Economia e ambiente", "A defesa do meio ambiente é um dos princípios da ordem econômica (Art. 170).", true, "Verdadeiro. Consta entre os princípios econômicos.", ["cf-meio-ambiente"]],
          ["mc", "Energia limpa", "Fontes como solar e eólica são exemplos de:", ["Energia mais limpa e renovável", "Combustíveis fósseis", "Poluição garantida", "Desperdício"], 0, "São renováveis e menos poluentes.", ["cf-meio-ambiente"]],
          ["tf", "Trade-off", "Às vezes há tensão entre gerar empregos e preservar: por isso se busca equilíbrio.", true, "Verdadeiro. O desafio é conciliar os dois.", ["cf-meio-ambiente"]],
          ["mc", "Reciclagem", "Reciclar e reaproveitar materiais ajuda a:", ["Reduzir resíduos e poupar recursos", "Aumentar o lixo", "Gastar mais água sempre", "Poluir mais"], 0, "A reciclagem reduz resíduos e poupa recursos.", ["cf-meio-ambiente"]],
          ["mc", "Longo prazo", "Pensar a sustentabilidade exige olhar:", ["O longo prazo e as próximas gerações", "Só o lucro imediato", "Apenas hoje", "Nada além do mês"], 0, "Sustentabilidade é visão de longo prazo.", ["cf-meio-ambiente"]],
          ["tf", "Responsabilidade das empresas", "Empresas também respondem por danos ambientais que causam.", true, "Verdadeiro. A responsabilidade alcança pessoas físicas e jurídicas.", ["cf-meio-ambiente"]],
          ["mc", "Papel de todos", "Consumir de forma consciente é:", ["Uma contribuição individual à sustentabilidade", "Irrelevante", "Prejudicial", "Proibido"], 0, "O consumo consciente soma no coletivo.", ["cf-meio-ambiente"]],
        ],
      }),
      buildLesson({
        id: "u5",
        slug: "participar-pela-causa-ambiental",
        order: 5,
        title: "Como participar pela causa ambiental",
        objective: "Identificar formas legítimas de agir pelo meio ambiente.",
        sources: [S.amb],
        teaching: [
          screen(
            "Da sua rua ao país",
            "Dá para agir no cotidiano (reduzir, reutilizar, reciclar, economizar água e energia) e na esfera pública (denunciar crimes, cobrar saneamento, participar de audiências).",
            "A ação popular e a cobrança por políticas são instrumentos de cidadania ambiental.",
          ),
        ],
        specs: [
          ["mc", "Ação cotidiana", "Uma ação individual pelo ambiente é:", ["Economizar água e energia e descartar lixo certo", "Poluir rios", "Desmatar", "Queimar lixo"], 0, "Atitudes diárias ajudam a preservar.", ["cf-meio-ambiente"]],
          ["tf", "Denúncia", "Crimes ambientais podem ser denunciados a órgãos como Ibama e Ministério Público.", true, "Verdadeiro. A denúncia é um canal de participação.", ["cf-meio-ambiente"]],
          ["mc", "Cobrança pública", "O cidadão pode cobrar do governo:", ["Saneamento, coleta e áreas verdes", "Nada", "Mais poluição", "Menos fiscalização"], 0, "Cobrar políticas ambientais é cidadania.", ["cf-meio-ambiente"]],
          ["tf", "Audiências", "Participar de audiências públicas sobre obras ajuda a influenciar decisões.", true, "Verdadeiro. A participação social é prevista.", ["cf-meio-ambiente"]],
          ["mc", "Ação popular", "Um instrumento para anular ato que lese o meio ambiente é:", ["A ação popular", "Um boato", "Uma corrente de mensagens", "Um imposto"], 0, "A ação popular protege o patrimônio e o ambiente (Art. 5º, LXXIII).", ["cf-meio-ambiente"]],
          ["mc", "Coletivo", "A força da causa ambiental vem muito de:", ["Ação coletiva e organização da sociedade", "Fazer nada", "Esperar só o governo", "Desistir"], 0, "A mobilização coletiva amplia resultados.", ["cf-meio-ambiente"]],
          ["tf", "Educação ambiental", "A Constituição prevê a promoção da educação ambiental.", true, "Verdadeiro. Consta no Art. 225, §1º, VI.", ["cf-meio-ambiente"]],
          ["mc", "Resultado", "Participar pela causa ambiental contribui para:", ["Um ambiente melhor para todos", "Prejudicar a saúde", "Aumentar a poluição", "Nada"], 0, "A participação melhora o ambiente coletivo.", ["cf-meio-ambiente"]],
        ],
      }),
    ],
  }),
);

import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria F — Direitos e garantias fundamentais. DRAFT, Premium. */
const S = {
  ind: cf("direitos-individuais", "Art. 5º (direitos e deveres individuais e coletivos)."),
  soc: cf("direitos-sociais", "Art. 6º (direitos sociais) e Art. 7º (direitos dos trabalhadores)."),
  rem: cf("remedios", "Art. 5º, incisos LXVIII a LXXIII (habeas corpus, mandado de segurança etc.)."),
  igu: cf("igualdade", "Art. 5º, caput e inciso I (igualdade perante a lei)."),
};

export const trailF = publishTrail(buildTrail({
  id: "trilha-f",
  slug: "direitos-fundamentais",
  order: 6,
  title: "Direitos e garantias fundamentais",
  description:
    "Os direitos que a Constituição assegura a todos: igualdade, liberdades, direitos sociais e os instrumentos para protegê-los.",
  lessons: [
    buildLesson({
      id: "f1",
      slug: "igualdade-perante-a-lei",
      order: 1,
      title: "Igualdade perante a lei",
      objective: "Compreender o princípio da igualdade (Art. 5º).",
      sources: [S.igu],
      teaching: [
        screen(
          "Todos iguais perante a lei",
          "O Art. 5º diz que todos são iguais perante a lei, sem distinção de qualquer natureza.",
          "Homens e mulheres são iguais em direitos e obrigações.",
        ),
      ],
      specs: [
        ["mc", "Princípio da igualdade", "Segundo o Art. 5º, todos são:", ["Iguais perante a lei, sem distinção de qualquer natureza", "Iguais só se tiverem a mesma renda", "Diferentes conforme a região", "Iguais apenas em época de eleição"], 0, "O caput do Art. 5º consagra a igualdade de todos perante a lei.", ["cf-igualdade"]],
        ["tf", "Igualdade entre homens e mulheres", "Homens e mulheres são iguais em direitos e obrigações, nos termos da Constituição.", true, "Verdadeiro. É expresso no Art. 5º, inciso I.", ["cf-igualdade"]],
        ["mc", "Alcance da igualdade", "A igualdade perante a lei vale:", ["Para brasileiros e estrangeiros residentes no país", "Só para quem nasceu na capital", "Só para quem tem diploma", "Só para maiores de 60 anos"], 0, "O caput garante direitos a brasileiros e estrangeiros residentes.", ["cf-igualdade"]],
        ["tf", "Discriminação", "A Constituição permite tratamento discriminatório por cor ou sexo.", false, "Falso. A igualdade veda distinções de qualquer natureza.", ["cf-igualdade"]],
        ["mc", "Igualdade formal e material", "Tratar desiguais de forma diferente para reduzir desigualdades é a ideia de:", ["Igualdade material (ou substancial)", "Privilégio ilegal", "Quebra da Constituição", "Imposto progressivo apenas"], 0, "A igualdade material busca corrigir desigualdades reais.", ["cf-igualdade"]],
        ["tf", "Lei igual para todos", "A igualdade perante a lei significa que a lei se aplica a todos, inclusive autoridades.", true, "Verdadeiro. Ninguém está acima da lei.", ["cf-igualdade"]],
        ["mc", "Exemplo de violação", "Qual situação viola a igualdade perante a lei?", ["Negar um serviço público a alguém por causa da cor da pele", "Cobrar imposto conforme a renda", "Dar prioridade de atendimento a idosos", "Reservar vagas de estacionamento para pessoas com deficiência"], 0, "Negar serviço por raça é discriminação vedada; as demais são tratamentos legítimos.", ["cf-igualdade"]],
        ["mc", "Base dos direitos", "O Art. 5º trata principalmente de:", ["Direitos e garantias individuais e coletivos", "Regras de trânsito", "Organização do futebol", "Tabela de impostos"], 0, "O Art. 5º é o coração dos direitos fundamentais individuais.", ["cf-igualdade"]],
      ],
    }),
    buildLesson({
      id: "f2",
      slug: "liberdades-fundamentais",
      order: 2,
      title: "As liberdades fundamentais",
      objective: "Reconhecer liberdades como expressão, crença e reunião (Art. 5º).",
      sources: [S.ind],
      teaching: [
        screen(
          "Liberdades protegidas",
          "O Art. 5º protege liberdades: de expressão, de consciência e crença, de reunião pacífica e de associação.",
          "Essas liberdades têm limites quando colidem com outros direitos (ex.: não acobertam calúnia ou violência).",
        ),
      ],
      specs: [
        ["mc", "Liberdade de expressão", "A liberdade de expressão garante:", ["Manifestar pensamento, vedado o anonimato", "Caluniar sem consequência", "Ameaçar pessoas", "Incitar violência livremente"], 0, "A livre manifestação é garantida, mas o anonimato é vedado e há responsabilização por abusos.", ["cf-direitos-individuais"]],
        ["tf", "Liberdade de crença", "A Constituição garante a liberdade de consciência e de crença.", true, "Verdadeiro. É assegurada no Art. 5º.", ["cf-direitos-individuais"]],
        ["mc", "Reunião pacífica", "A liberdade de reunião é garantida quando:", ["Pacífica e sem armas, em locais abertos ao público", "Com armas e violência", "Sempre proibida", "Só com autorização do presidente"], 0, "A reunião pacífica, sem armas, independe de autorização (apenas aviso prévio).", ["cf-direitos-individuais"]],
        ["tf", "Liberdades absolutas", "As liberdades fundamentais são absolutas e nunca têm limites.", false, "Falso. Elas convivem com outros direitos e podem ter limites (ex.: vedação à violência).", ["cf-direitos-individuais"]],
        ["mc", "Associação", "A liberdade de associação:", ["É garantida para fins lícitos, vedada a de caráter paramilitar", "Permite milícias armadas", "É proibida para todos", "Depende de filiação a um partido"], 0, "Associar-se para fins lícitos é livre; associações paramilitares são vedadas.", ["cf-direitos-individuais"]],
        ["tf", "Anonimato", "A Constituição permite manifestação anônima para ofender pessoas.", false, "Falso. É livre a manifestação, mas vedado o anonimato.", ["cf-direitos-individuais"]],
        ["mc", "Limite das liberdades", "Quando a liberdade de uma pessoa colide com direitos de outra:", ["É preciso ponderar os direitos em jogo", "A liberdade sempre vence tudo", "Nenhum direito importa", "O mais forte decide"], 0, "Direitos fundamentais podem colidir e exigem ponderação.", ["cf-direitos-individuais"]],
        ["mc", "Liberdade de imprensa", "A liberdade de imprensa é importante para a democracia porque:", ["Permite fiscalizar o poder e informar a sociedade", "Garante que só o governo fale", "Proíbe críticas a autoridades", "Elimina o debate público"], 0, "Imprensa livre fiscaliza o poder e informa os cidadãos.", ["cf-direitos-individuais"]],
      ],
    }),
    buildLesson({
      id: "f3",
      slug: "direitos-sociais",
      order: 3,
      title: "Direitos sociais",
      objective: "Conhecer os direitos sociais (Art. 6º).",
      sources: [S.soc],
      teaching: [
        screen(
          "Direitos para uma vida digna",
          "O Art. 6º lista direitos sociais: educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e à infância, assistência aos desamparados.",
        ),
      ],
      specs: [
        ["mc", "Direito social", "É um direito social (Art. 6º):", ["A saúde", "A escolha do time de futebol", "O direito a não pagar imposto", "A posse de arma sem regras"], 0, "Saúde é um direito social expresso no Art. 6º.", ["cf-direitos-sociais"]],
        ["tf", "Educação como direito", "A educação é um direito social previsto na Constituição.", true, "Verdadeiro. Consta no Art. 6º.", ["cf-direitos-sociais"]],
        ["mc", "Lista de direitos sociais", "Qual destes NÃO é listado como direito social no Art. 6º?", ["O direito a lucro garantido em investimentos", "A moradia", "O trabalho", "A previdência social"], 0, "Lucro garantido não é direito social; moradia, trabalho e previdência são.", ["cf-direitos-sociais"]],
        ["tf", "Saúde universal", "A Constituição trata a saúde como direito de todos e dever do Estado.", true, "Verdadeiro. A saúde é direito de todos e dever do Estado (Art. 196).", ["cf-direitos-sociais"]],
        ["mc", "Trabalhadores", "O Art. 7º trata de direitos:", ["Dos trabalhadores urbanos e rurais", "Apenas de servidores públicos", "Apenas de empresários", "De ninguém"], 0, "O Art. 7º lista direitos dos trabalhadores urbanos e rurais.", ["cf-direitos-sociais"]],
        ["mc", "Exemplo de direito trabalhista", "É um direito do trabalhador (Art. 7º):", ["Décimo terceiro salário", "Trabalhar sem nenhum descanso", "Não receber salário", "Jornada ilimitada obrigatória"], 0, "O 13º salário é um direito constitucional do trabalhador.", ["cf-direitos-sociais"]],
        ["tf", "Direitos sociais e políticas públicas", "Direitos sociais costumam depender de políticas públicas para se efetivarem.", true, "Verdadeiro. Sua concretização envolve serviços e orçamento.", ["cf-direitos-sociais"]],
        ["mc", "Assistência aos desamparados", "A “assistência aos desamparados” indica que o Estado deve:", ["Amparar quem está em situação de vulnerabilidade", "Ignorar quem precisa de ajuda", "Cobrar por socorro", "Atender só quem vota"], 0, "A assistência aos desamparados é um direito social do Art. 6º.", ["cf-direitos-sociais"]],
      ],
    }),
    buildLesson({
      id: "f4",
      slug: "garantias-e-remedios",
      order: 4,
      title: "Garantias: como proteger seus direitos",
      objective: "Conhecer instrumentos como habeas corpus e mandado de segurança.",
      sources: [S.rem],
      teaching: [
        screen(
          "Ferramentas de defesa",
          "A Constituição cria “remédios” para proteger direitos: habeas corpus (liberdade de locomoção), mandado de segurança (direito líquido e certo), habeas data (acesso a dados), ação popular (anular ato lesivo ao patrimônio público).",
        ),
      ],
      specs: [
        ["mc", "Habeas corpus", "O habeas corpus protege:", ["A liberdade de locomoção (ir e vir)", "O direito a um emprego", "O valor do salário", "O direito a votar"], 0, "O habeas corpus tutela a liberdade de ir e vir contra ilegalidade.", ["cf-remedios"]],
        ["mc", "Mandado de segurança", "O mandado de segurança serve para proteger:", ["Direito líquido e certo violado por autoridade", "A escolha do presidente", "O preço dos alimentos", "O resultado de um jogo"], 0, "Protege direito líquido e certo não amparado por habeas corpus/data.", ["cf-remedios"]],
        ["tf", "Habeas data", "O habeas data serve para acessar ou corrigir informações sobre a própria pessoa em bancos de dados públicos.", true, "Verdadeiro. É sua finalidade constitucional.", ["cf-remedios"]],
        ["mc", "Ação popular", "A ação popular permite ao cidadão:", ["Pedir a anulação de ato lesivo ao patrimônio público", "Cancelar uma eleição", "Prender um político", "Criar um imposto"], 0, "Qualquer cidadão pode propor ação popular contra ato lesivo ao patrimônio público.", ["cf-remedios"]],
        ["tf", "Acesso à Justiça", "A lei não pode excluir da apreciação do Judiciário lesão ou ameaça a direito.", true, "Verdadeiro. É o princípio da inafastabilidade da jurisdição (Art. 5º, XXXV).", ["cf-remedios"]],
        ["mc", "Gratuidade", "Para quem não pode pagar, a Constituição prevê:", ["Assistência jurídica gratuita", "Cobrança dobrada", "Proibição de acesso à Justiça", "Fim do processo"], 0, "O Estado presta assistência jurídica integral e gratuita aos que comprovarem insuficiência de recursos.", ["cf-remedios"]],
        ["tf", "Remédios constitucionais", "Habeas corpus e mandado de segurança são formas de proteger direitos na prática.", true, "Verdadeiro. São instrumentos processuais de garantia.", ["cf-remedios"]],
        ["mc", "Quando usar habeas corpus", "Uma prisão ilegal pode ser combatida por:", ["Habeas corpus", "Habeas data", "Ação popular", "Mandado de injunção apenas"], 0, "Prisão ilegal é caso típico de habeas corpus.", ["cf-remedios"]],
      ],
    }),
    buildLesson({
      id: "f5",
      slug: "direitos-tem-limites-e-deveres",
      order: 5,
      title: "Direitos têm limites e vêm com deveres",
      objective: "Entender que direitos coexistem e implicam deveres.",
      sources: [S.ind],
      teaching: [
        screen(
          "Equilíbrio entre direitos",
          "Nenhum direito é absoluto: o exercício de um encontra limite nos direitos dos outros e no interesse público.",
          "Direitos também vêm acompanhados de deveres de cidadania.",
        ),
      ],
      specs: [
        ["tf", "Direitos absolutos", "Todo direito fundamental é absoluto e ilimitado.", false, "Falso. Direitos convivem e podem ser limitados quando colidem com outros.", ["cf-direitos-individuais"]],
        ["mc", "Limite de um direito", "O direito de um termina, em regra:", ["Onde começa o direito do outro", "Nunca, pois é ilimitado", "Só na eleição", "Só à noite"], 0, "O exercício de direitos é limitado pelos direitos alheios.", ["cf-direitos-individuais"]],
        ["mc", "Direitos e deveres", "Cidadania envolve:", ["Direitos e também deveres", "Só direitos", "Só deveres", "Nenhum dos dois"], 0, "A cidadania combina direitos e deveres.", ["cf-direitos-individuais"]],
        ["tf", "Interesse público", "Direitos individuais podem ser limitados por interesse público legítimo e proporcional.", true, "Verdadeiro. Limitações devem ser legais e proporcionais.", ["cf-direitos-individuais"]],
        ["mc", "Exemplo de dever", "É um dever do cidadão:", ["Respeitar as leis e os direitos dos outros", "Nunca pagar imposto", "Ignorar a Constituição", "Impedir o voto alheio"], 0, "Respeitar leis e direitos alheios é dever de cidadania.", ["cf-direitos-individuais"]],
        ["mc", "Colisão de direitos", "Quando a liberdade de expressão de um fere a honra de outro:", ["Pode haver responsabilização e reparação", "Nada acontece nunca", "A honra não é protegida", "A expressão deixa de existir"], 0, "A Constituição protege a honra; abusos geram responsabilização.", ["cf-direitos-individuais"]],
        ["tf", "Responsabilidade", "Liberdade de expressão não impede a responsabilização por danos causados.", true, "Verdadeiro. Há liberdade, mas com responsabilidade por abusos.", ["cf-direitos-individuais"]],
        ["mc", "Função dos limites", "Limites a direitos existem para:", ["Permitir a convivência de todos os direitos", "Acabar com os direitos", "Favorecer autoridades", "Proibir o debate"], 0, "Os limites harmonizam direitos que poderiam colidir.", ["cf-direitos-individuais"]],
      ],
    }),
  ],
}));

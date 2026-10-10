import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria N — Políticas públicas. Publicada, Premium. */
const S = {
  saude: cf("saude", "Art. 196 a 200 (saúde; SUS)."),
  edu: cf("educacao", "Art. 205 a 214 (educação)."),
  assist: cf("assistencia", "Art. 203 e 204 (assistência social)."),
};

export const trailN = publishTrail(
  buildTrail({
    id: "trilha-n",
    slug: "politicas-publicas",
    order: 14,
    title: "Políticas públicas",
    description:
      "Como o Estado resolve problemas coletivos: o ciclo de uma política, saúde (SUS), educação e como avaliar resultados.",
    lessons: [
      buildLesson({
        id: "n1",
        slug: "o-que-e-politica-publica",
        order: 1,
        title: "O que é uma política pública",
        objective: "Entender política pública como resposta do Estado a um problema coletivo.",
        sources: [S.edu],
        teaching: [
          screen(
            "Resposta a um problema coletivo",
            "Política pública é um conjunto de ações do Estado para enfrentar um problema de interesse coletivo (saúde, educação, segurança).",
            "Envolve escolhas sobre o quê priorizar, como fazer e quanto gastar.",
          ),
        ],
        specs: [
          ["mc", "Definição", "Política pública é:", ["Um conjunto de ações do Estado para resolver um problema coletivo", "Uma opinião pessoal", "Um partido", "Um imposto"], 0, "É a ação organizada do Estado diante de um problema público.", ["cf-educacao"]],
          ["tf", "Escolhas", "Toda política pública envolve escolhas e prioridades.", true, "Verdadeiro. Recursos são limitados; é preciso priorizar.", ["cf-educacao"]],
          ["mc", "Exemplo", "É um exemplo de política pública:", ["Um programa nacional de vacinação", "A escolha do seu lanche", "A cor da sua casa", "Sua senha de banco"], 0, "Um programa de vacinação é política pública; os demais são escolhas privadas.", ["cf-saude"]],
          ["mc", "Objetivo", "O objetivo de uma política pública é:", ["Produzir resultados de interesse coletivo", "Favorecer uma só pessoa", "Esconder dados", "Eliminar o debate"], 0, "Busca-se um benefício coletivo.", ["cf-educacao"]],
          ["tf", "Estado e sociedade", "A sociedade pode participar da formulação e do controle das políticas públicas.", true, "Verdadeiro. Conselhos e audiências permitem participação.", ["cf-saude"]],
          ["mc", "Recursos", "Políticas públicas dependem de:", ["Recursos públicos e planejamento", "Sorte", "Apenas boa vontade", "Nenhum recurso"], 0, "Precisam de orçamento e planejamento para funcionar.", ["cf-educacao"]],
          ["tf", "Avaliação", "Uma boa política pública deve ser avaliada por seus resultados.", true, "Verdadeiro. Avaliar resultados é essencial.", ["cf-educacao"]],
          ["mc", "Problema público", "Um “problema público” é aquele que:", ["Afeta a coletividade e demanda ação do Estado", "É só de uma pessoa", "Não interessa a ninguém", "Resolve-se sozinho sempre"], 0, "É um problema coletivo que justifica a ação estatal.", ["cf-educacao"]],
        ],
      }),
      buildLesson({
        id: "n2",
        slug: "o-ciclo-das-politicas",
        order: 2,
        title: "O ciclo das políticas públicas",
        objective: "Conhecer as fases do ciclo de políticas públicas.",
        sources: [S.edu],
        teaching: [
          screen(
            "Da ideia ao resultado",
            "Uma forma simples de ver uma política: identificar o problema → formular a solução → implementar → avaliar os resultados.",
            "A avaliação pode levar a ajustes ou ao fim da política.",
          ),
        ],
        specs: [
          ["mc", "Primeira fase", "O ciclo costuma começar por:", ["Identificar o problema", "Avaliar resultados", "Implementar sem pensar", "Encerrar a política"], 0, "Tudo começa reconhecendo o problema a enfrentar.", ["cf-educacao"]],
          ["mc", "Formulação", "Na formulação, define-se:", ["Como a política vai agir e com quais meios", "O campeão de futebol", "O preço do dólar", "A cor da bandeira"], 0, "Formular é desenhar a solução e os meios.", ["cf-educacao"]],
          ["mc", "Implementação", "A implementação é a fase de:", ["Colocar a política em prática", "Só planejar", "Só avaliar", "Arquivar"], 0, "Implementar é executar o que foi planejado.", ["cf-educacao"]],
          ["mc", "Avaliação", "A avaliação serve para:", ["Verificar se os objetivos foram alcançados", "Esconder os dados", "Favorecer alguém", "Eleger o gestor"], 0, "Avaliar mede resultados e orienta ajustes.", ["cf-educacao"]],
          ["tf", "Ajustes", "A avaliação pode levar a ajustar, ampliar ou encerrar a política.", true, "Verdadeiro. O ciclo se realimenta com a avaliação.", ["cf-educacao"]],
          ["mc", "Ordem do ciclo", "Uma ordem lógica do ciclo é:", ["Problema → formulação → implementação → avaliação", "Avaliação → problema → nada", "Implementação → problema", "Não há ordem"], 0, "Essa é a sequência clássica do ciclo de políticas.", ["cf-educacao"]],
          ["tf", "Dados importam", "Dados ajudam a identificar problemas e a avaliar resultados.", true, "Verdadeiro. Evidências guiam boas políticas.", ["cf-educacao"]],
          ["mc", "Participação no ciclo", "A sociedade pode contribuir, por exemplo:", ["Apontando problemas e cobrando resultados", "Decidindo sozinha o orçamento federal", "Julgando crimes", "Emitindo moeda"], 0, "A participação social enriquece o diagnóstico e o controle.", ["cf-educacao"]],
        ],
      }),
      buildLesson({
        id: "n3",
        slug: "saude-o-sus",
        order: 3,
        title: "Saúde: o SUS",
        objective: "Conhecer princípios do Sistema Único de Saúde.",
        sources: [S.saude],
        teaching: [
          screen(
            "Saúde é direito de todos",
            "A Constituição diz que a saúde é direito de todos e dever do Estado (Art. 196).",
            "O SUS organiza a saúde pública com princípios como universalidade, integralidade e participação da comunidade.",
          ),
        ],
        specs: [
          ["mc", "Saúde na Constituição", "Segundo a Constituição, a saúde é:", ["Direito de todos e dever do Estado", "Serviço só para quem paga", "Responsabilidade apenas privada", "Um imposto"], 0, "O Art. 196 define saúde como direito de todos e dever do Estado.", ["cf-saude"]],
          ["mc", "SUS", "O SUS é:", ["O Sistema Único de Saúde, público e integrado", "Um plano de saúde privado", "Um partido", "Um imposto"], 0, "O SUS é o sistema público de saúde.", ["cf-saude"]],
          ["tf", "Universalidade", "A universalidade do SUS significa atendimento a todos, independentemente de pagamento.", true, "Verdadeiro. O SUS atende a toda a população.", ["cf-saude"]],
          ["mc", "Integralidade", "A integralidade no SUS indica:", ["Atenção que vai da prevenção ao tratamento", "Só vacinas", "Só cirurgias", "Só consultas particulares"], 0, "A integralidade abrange prevenção e tratamento.", ["cf-saude"]],
          ["tf", "Três níveis", "O SUS é mantido em conjunto por União, estados e municípios.", true, "Verdadeiro. O SUS integra os três níveis de governo.", ["cf-saude"]],
          ["mc", "Participação", "No SUS, a participação da comunidade ocorre, por exemplo, em:", ["Conselhos de saúde", "Eleições para o STF", "Assembleias de acionistas", "Clubes de futebol"], 0, "Conselhos de saúde permitem o controle social do SUS.", ["cf-saude"]],
          ["mc", "Exemplo do SUS", "É uma ação do SUS:", ["Campanhas de vacinação", "Venda de ações", "Cobrança de IPVA", "Organização de eleições"], 0, "Vacinação pública é uma ação típica do SUS.", ["cf-saude"]],
          ["tf", "Saúde e orçamento", "A oferta de saúde pública depende de recursos do orçamento.", true, "Verdadeiro. O SUS é financiado com recursos públicos.", ["cf-saude"]],
        ],
      }),
      buildLesson({
        id: "n4",
        slug: "educacao",
        order: 4,
        title: "Educação",
        objective: "Conhecer a educação como direito e dever compartilhado.",
        sources: [S.edu],
        teaching: [
          screen(
            "Educação é direito de todos",
            "A Constituição trata a educação como direito de todos e dever do Estado e da família (Art. 205).",
            "Os entes se dividem: municípios com a educação infantil e o fundamental; estados com o ensino médio; a União com diretrizes e o ensino superior federal.",
          ),
        ],
        specs: [
          ["mc", "Educação como direito", "Segundo a Constituição, a educação é:", ["Direito de todos e dever do Estado e da família", "Um privilégio", "Só para quem paga", "Um imposto"], 0, "O Art. 205 define a educação como direito de todos.", ["cf-educacao"]],
          ["mc", "Educação infantil", "A educação infantil é prioridade principalmente:", ["Dos municípios", "Da União", "Dos estados", "De empresas"], 0, "A educação infantil é responsabilidade municipal.", ["cf-educacao"]],
          ["mc", "Ensino médio", "O ensino médio é responsabilidade principalmente:", ["Dos estados", "Dos municípios", "Da União apenas", "De ninguém"], 0, "O ensino médio cabe prioritariamente aos estados.", ["cf-educacao"]],
          ["tf", "Colaboração", "Os entes atuam em colaboração para organizar a educação.", true, "Verdadeiro. Há regime de colaboração entre os níveis.", ["cf-educacao"]],
          ["mc", "Papel da União", "A União atua na educação, entre outras formas:", ["Fixando diretrizes e mantendo instituições federais", "Organizando a creche do bairro", "Definindo o IPTU", "Coletando o lixo"], 0, "A União dá diretrizes e mantém universidades e institutos federais.", ["cf-educacao"]],
          ["tf", "Família", "A Constituição também atribui à família um papel na educação.", true, "Verdadeiro. A educação é dever do Estado e da família.", ["cf-educacao"]],
          ["mc", "Por que investir", "Investir em educação tende a:", ["Ampliar oportunidades e o desenvolvimento do país", "Reduzir a cidadania", "Acabar com direitos", "Eliminar o debate"], 0, "A educação é base de oportunidades e desenvolvimento.", ["cf-educacao"]],
          ["mc", "Acesso", "Um objetivo da política educacional é:", ["Garantir acesso e permanência na escola", "Restringir o ensino", "Fechar escolas", "Cobrar pelo ensino fundamental público"], 0, "Ampliar acesso e permanência é meta central.", ["cf-educacao"]],
        ],
      }),
      buildLesson({
        id: "n5",
        slug: "como-avaliar-uma-politica",
        order: 5,
        title: "Como avaliar uma política pública",
        objective: "Aplicar critérios para avaliar uma política.",
        sources: [S.assist],
        teaching: [
          screen(
            "Funciona? A que custo?",
            "Avaliar uma política é perguntar: ela atinge o objetivo? A que custo? Quem é beneficiado? Há efeitos colaterais?",
            "Evidências e dados ajudam a responder com menos achismo.",
          ),
        ],
        specs: [
          ["mc", "Pergunta de avaliação", "Uma boa pergunta ao avaliar uma política é:", ["Ela atinge o objetivo e a que custo?", "O gestor é simpático?", "Qual a cor do cartaz?", "Quantos seguidores tem?"], 0, "Eficácia e custo são centrais na avaliação.", ["cf-assistencia"]],
          ["tf", "Evidências", "Dados e evidências tornam a avaliação mais confiável.", true, "Verdadeiro. Evidências reduzem o achismo.", ["cf-assistencia"]],
          ["mc", "Efeitos colaterais", "Ao avaliar, também é importante observar:", ["Efeitos não intencionais da política", "Apenas o discurso", "Somente a intenção", "Nada além do custo"], 0, "Efeitos colaterais precisam ser considerados.", ["cf-assistencia"]],
          ["mc", "Beneficiários", "Saber quem é beneficiado ajuda a avaliar:", ["Se a política alcança quem precisa", "A cor da bandeira", "O horário do almoço", "O placar do jogo"], 0, "A focalização nos beneficiários certos é parte da avaliação.", ["cf-assistencia"]],
          ["tf", "Custo-benefício", "Comparar custo e resultado é parte de avaliar uma política.", true, "Verdadeiro. A relação custo-benefício importa.", ["cf-assistencia"]],
          ["mc", "Assistência social", "A assistência social, na Constituição, é voltada a:", ["Quem dela necessitar, independentemente de contribuição", "Apenas quem paga", "Somente servidores", "Ninguém"], 0, "A assistência social é prestada a quem necessita (Art. 203).", ["cf-assistencia"]],
          ["mc", "Decisão informada", "Avaliar bem as políticas ajuda o cidadão a:", ["Cobrar e votar de forma mais informada", "Ignorar a política", "Decidir no escuro", "Acreditar em tudo"], 0, "A avaliação embasa a cobrança e o voto.", ["cf-assistencia"]],
          ["tf", "Ajuste contínuo", "Políticas podem e devem ser ajustadas conforme os resultados.", true, "Verdadeiro. A avaliação orienta melhorias.", ["cf-assistencia"]],
        ],
      }),
    ],
  }),
);

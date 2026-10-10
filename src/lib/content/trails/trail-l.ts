import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria L — Tributos e impostos. Publicada, Premium. */
const S = {
  esp: cf("tributos-especies", "Art. 145 (impostos, taxas e contribuições de melhoria)."),
  comp: cf("tributos-competencia", "Art. 153, 155 e 156 (impostos da União, estados e municípios)."),
  lim: cf("tributos-limitacoes", "Art. 150 (limitações ao poder de tributar)."),
};

export const trailL = publishTrail(
  buildTrail({
    id: "trilha-l",
    slug: "tributos-e-impostos",
    order: 12,
    title: "Tributos e impostos",
    description:
      "De onde vem o dinheiro público: tipos de tributo, quais impostos cada nível cobra e os limites do poder de tributar.",
    lessons: [
      buildLesson({
        id: "l1",
        slug: "o-que-e-tributo",
        order: 1,
        title: "O que é tributo",
        objective: "Diferenciar imposto, taxa e contribuição de melhoria.",
        sources: [S.esp],
        teaching: [
          screen(
            "Tributo não é só imposto",
            "Tributo é o gênero; imposto é uma espécie. Há três espécies básicas (Art. 145): imposto, taxa e contribuição de melhoria.",
            "Imposto não exige contrapartida direta; taxa remunera um serviço específico ou o poder de polícia; contribuição de melhoria decorre de obra que valoriza seu imóvel.",
          ),
        ],
        specs: [
          ["mc", "Gênero e espécie", "Em relação a tributo e imposto:", ["Tributo é o gênero; imposto é uma espécie", "São exatamente a mesma coisa", "Imposto é o gênero; tributo é espécie", "Nenhum existe no Brasil"], 0, "Imposto é uma das espécies de tributo.", ["cf-tributos-especies"]],
          ["mc", "O que é imposto", "O imposto caracteriza-se por:", ["Não ter contrapartida direta e específica", "Pagar por um serviço específico usado", "Valorizar seu imóvel por uma obra", "Ser voluntário"], 0, "O imposto não dá direito a uma contraprestação específica.", ["cf-tributos-especies"]],
          ["mc", "O que é taxa", "A taxa é cobrada por:", ["Um serviço público específico e divisível ou poder de polícia", "Nada em troca", "Uma obra que valoriza imóveis", "Doações"], 0, "A taxa remunera serviço específico/divisível ou o poder de polícia.", ["cf-tributos-especies"]],
          ["mc", "Contribuição de melhoria", "A contribuição de melhoria decorre de:", ["Obra pública que valoriza o imóvel do contribuinte", "Qualquer compra", "Multa de trânsito", "Salário"], 0, "Ela é cobrada quando uma obra pública valoriza o imóvel.", ["cf-tributos-especies"]],
          ["tf", "Imposto e contrapartida", "Ao pagar um imposto, você tem direito a um serviço específico em troca.", false, "Falso. O imposto não gera contraprestação específica e direta.", ["cf-tributos-especies"]],
          ["mc", "Exemplo de taxa", "Um exemplo de taxa é:", ["A taxa de coleta de lixo (serviço específico)", "O imposto de renda", "A doação a uma ONG", "A compra de um pão"], 0, "A taxa de lixo remunera um serviço específico e divisível.", ["cf-tributos-especies"]],
          ["tf", "Tributos financiam o Estado", "Os tributos são a principal fonte de financiamento do Estado.", true, "Verdadeiro. A arrecadação tributária custeia os serviços públicos.", ["cf-tributos-especies"]],
          ["mc", "Função dos tributos", "Além de arrecadar, os tributos podem:", ["Induzir comportamentos (ex.: desestimular certos produtos)", "Eleger governantes", "Julgar crimes", "Criar a Constituição"], 0, "Tributos têm função arrecadatória e também regulatória (extrafiscal).", ["cf-tributos-especies"]],
        ],
      }),
      buildLesson({
        id: "l2",
        slug: "impostos-federais",
        order: 2,
        title: "Impostos federais",
        objective: "Reconhecer os principais impostos da União.",
        sources: [S.comp],
        teaching: [
          screen(
            "O que a União cobra",
            "Entre os impostos federais estão o Imposto de Renda (IR), o IPI (produtos industrializados), o Imposto de Importação (II), o de Exportação (IE), o IOF (operações financeiras) e o ITR (território rural).",
          ),
        ],
        specs: [
          ["mc", "Imposto federal", "É um imposto federal:", ["Imposto de Renda (IR)", "IPVA", "IPTU", "ICMS"], 0, "O IR é um imposto da União; IPVA/ICMS são estaduais e IPTU é municipal.", ["cf-tributos-competencia"]],
          ["mc", "IPI", "O IPI incide sobre:", ["Produtos industrializados", "A propriedade de carros", "Imóveis urbanos", "Serviços locais"], 0, "O IPI é o imposto sobre produtos industrializados (federal).", ["cf-tributos-competencia"]],
          ["mc", "Imposto sobre comércio exterior", "Os impostos de importação e exportação são:", ["Federais", "Estaduais", "Municipais", "Privados"], 0, "II e IE são impostos da União.", ["cf-tributos-competencia"]],
          ["tf", "IR", "O Imposto de Renda é cobrado pela União.", true, "Verdadeiro. O IR é federal.", ["cf-tributos-competencia"]],
          ["mc", "IOF", "O IOF incide sobre:", ["Operações financeiras (crédito, câmbio, seguros)", "A posse de imóveis", "Serviços de limpeza urbana", "A propriedade de veículos"], 0, "O IOF é o imposto federal sobre operações financeiras.", ["cf-tributos-competencia"]],
          ["tf", "ITR", "O Imposto Territorial Rural (ITR) é um imposto federal.", true, "Verdadeiro. O ITR é da competência da União.", ["cf-tributos-competencia"]],
          ["mc", "Não é federal", "Qual NÃO é um imposto federal?", ["ICMS", "IR", "IPI", "IOF"], 0, "O ICMS é estadual; os demais são federais.", ["cf-tributos-competencia"]],
          ["mc", "Progressividade do IR", "O Imposto de Renda, em geral, é cobrado de forma:", ["Progressiva (quem ganha mais paga alíquota maior)", "Igual para todas as rendas", "Só de empresas", "Voluntária"], 0, "O IR da pessoa física costuma ser progressivo por faixas.", ["cf-tributos-competencia"]],
        ],
      }),
      buildLesson({
        id: "l3",
        slug: "impostos-estaduais",
        order: 3,
        title: "Impostos estaduais",
        objective: "Reconhecer os principais impostos dos estados.",
        sources: [S.comp],
        teaching: [
          screen(
            "O que os estados cobram",
            "Os estados cobram o ICMS (circulação de mercadorias e alguns serviços), o IPVA (propriedade de veículos) e o ITCMD (transmissão por herança ou doação).",
          ),
        ],
        specs: [
          ["mc", "Imposto estadual", "É um imposto estadual:", ["ICMS", "IR", "IPTU", "IPI"], 0, "O ICMS é estadual.", ["cf-tributos-competencia"]],
          ["mc", "IPVA", "O IPVA incide sobre:", ["A propriedade de veículos automotores", "A renda", "Imóveis urbanos", "Produtos industrializados"], 0, "O IPVA é o imposto estadual sobre veículos.", ["cf-tributos-competencia"]],
          ["mc", "ICMS", "O ICMS incide, em geral, sobre:", ["A circulação de mercadorias e alguns serviços", "A herança", "A renda", "A importação"], 0, "O ICMS incide sobre circulação de mercadorias e certos serviços.", ["cf-tributos-competencia"]],
          ["tf", "IPVA é estadual", "O IPVA é cobrado pelos estados.", true, "Verdadeiro. O IPVA é imposto estadual.", ["cf-tributos-competencia"]],
          ["mc", "ITCMD", "O ITCMD incide sobre:", ["Herança (transmissão por morte) e doação", "A renda mensal", "Serviços urbanos", "Produtos industrializados"], 0, "O ITCMD recai sobre transmissão causa mortis e doações.", ["cf-tributos-competencia"]],
          ["tf", "ICMS no dia a dia", "O ICMS costuma estar embutido no preço de muitos produtos que você compra.", true, "Verdadeiro. É um imposto sobre o consumo muito presente.", ["cf-tributos-competencia"]],
          ["mc", "Não é estadual", "Qual NÃO é um imposto estadual?", ["IPTU", "ICMS", "IPVA", "ITCMD"], 0, "O IPTU é municipal; os outros são estaduais.", ["cf-tributos-competencia"]],
          ["mc", "Imposto sobre consumo", "Entre os citados, incide sobre o consumo de mercadorias:", ["O ICMS", "O IPVA", "O ITCMD", "O ITR"], 0, "O ICMS é o imposto estadual sobre o consumo de mercadorias.", ["cf-tributos-competencia"]],
        ],
      }),
      buildLesson({
        id: "l4",
        slug: "impostos-municipais",
        order: 4,
        title: "Impostos municipais",
        objective: "Reconhecer os principais impostos dos municípios.",
        sources: [S.comp],
        teaching: [
          screen(
            "O que os municípios cobram",
            "Os municípios cobram o IPTU (propriedade urbana), o ISS (serviços) e o ITBI (transmissão de imóveis entre pessoas vivas).",
          ),
        ],
        specs: [
          ["mc", "Imposto municipal", "É um imposto municipal:", ["IPTU", "IR", "ICMS", "IPVA"], 0, "O IPTU é municipal.", ["cf-tributos-competencia"]],
          ["mc", "IPTU", "O IPTU incide sobre:", ["A propriedade de imóvel urbano", "A renda", "A circulação de mercadorias", "A propriedade de veículos"], 0, "O IPTU é o imposto municipal sobre imóveis urbanos.", ["cf-tributos-competencia"]],
          ["mc", "ISS", "O ISS incide sobre:", ["A prestação de serviços", "A herança", "A exportação", "A propriedade de carros"], 0, "O ISS é o imposto municipal sobre serviços.", ["cf-tributos-competencia"]],
          ["tf", "ITBI", "O ITBI incide sobre a transmissão de imóveis entre pessoas vivas (ex.: compra e venda).", true, "Verdadeiro. O ITBI é municipal e recai sobre transmissão inter vivos de imóveis.", ["cf-tributos-competencia"]],
          ["mc", "De quem é o IPTU", "O IPTU da sua casa é cobrado:", ["Pelo município", "Pela União", "Pelo estado", "Por um banco"], 0, "O IPTU é um imposto municipal.", ["cf-tributos-competencia"]],
          ["tf", "ISS e prestadores", "Profissionais e empresas que prestam serviços podem pagar ISS ao município.", true, "Verdadeiro. O ISS recai sobre a prestação de serviços.", ["cf-tributos-competencia"]],
          ["mc", "Não é municipal", "Qual NÃO é um imposto municipal?", ["IPVA", "IPTU", "ISS", "ITBI"], 0, "O IPVA é estadual; os demais são municipais.", ["cf-tributos-competencia"]],
          ["mc", "Financiamento local", "Os impostos municipais ajudam a financiar:", ["Serviços locais, como zeladoria e parte da educação", "As Forças Armadas", "A política externa", "A emissão de moeda"], 0, "A arrecadação municipal custeia serviços de interesse local.", ["cf-tributos-competencia"]],
        ],
      }),
      buildLesson({
        id: "l5",
        slug: "limites-do-poder-de-tributar",
        order: 5,
        title: "Os limites do poder de tributar",
        objective: "Conhecer limitações ao poder de tributar (Art. 150).",
        sources: [S.lim],
        teaching: [
          screen(
            "O Estado não pode cobrar como quiser",
            "A Constituição (Art. 150) impõe limites: legalidade (só por lei), anterioridade (em regra, não cobrar no mesmo ano da criação/aumento), isonomia, irretroatividade e vedação ao confisco.",
            "Há ainda imunidades, como a de livros, jornais e templos.",
          ),
        ],
        specs: [
          ["mc", "Legalidade tributária", "Pelo princípio da legalidade, um tributo só pode ser criado ou aumentado:", ["Por lei", "Por decreto sem lei", "Por decisão isolada de um ministro", "Por ordem verbal"], 0, "A legalidade exige lei para criar ou aumentar tributo.", ["cf-tributos-limitacoes"]],
          ["tf", "Anterioridade", "Em regra, um tributo criado hoje não pode ser cobrado imediatamente, respeitando prazos de anterioridade.", true, "Verdadeiro. A anterioridade protege o contribuinte de surpresas.", ["cf-tributos-limitacoes"]],
          ["mc", "Vedação ao confisco", "A vedação ao confisco impede que o tributo seja:", ["Tão alto a ponto de tomar o bem/renda do contribuinte", "Cobrado por lei", "Progressivo", "Divulgado"], 0, "O tributo não pode ter efeito confiscatório.", ["cf-tributos-limitacoes"]],
          ["mc", "Isonomia tributária", "A isonomia tributária exige:", ["Tratar igualmente quem está em situação equivalente", "Cobrar mais de quem o governo não gosta", "Isentar amigos", "Cobrar só de uma cidade"], 0, "A isonomia veda tratamento desigual arbitrário entre contribuintes.", ["cf-tributos-limitacoes"]],
          ["tf", "Irretroatividade", "Em regra, uma lei não pode cobrar tributo sobre fatos anteriores à sua vigência.", true, "Verdadeiro. É o princípio da irretroatividade.", ["cf-tributos-limitacoes"]],
          ["mc", "Imunidade", "São imunes a impostos, por exemplo:", ["Livros, jornais e o papel de impressão", "Todos os produtos de luxo", "Carros importados", "Serviços bancários"], 0, "A Constituição concede imunidade a livros, jornais e periódicos.", ["cf-tributos-limitacoes"]],
          ["tf", "Limites protegem o cidadão", "Os limites ao poder de tributar protegem o contribuinte contra abusos.", true, "Verdadeiro. São garantias do cidadão diante do Fisco.", ["cf-tributos-limitacoes"]],
          ["mc", "Sem lei, sem tributo", "Se não houver lei criando o tributo, ele:", ["Não pode ser cobrado", "Pode ser cobrado assim mesmo", "Vira imposto automaticamente", "É decidido pelo prefeito"], 0, "Sem lei, não há tributo (legalidade).", ["cf-tributos-limitacoes"]],
        ],
      }),
    ],
  }),
);

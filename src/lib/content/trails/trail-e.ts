import { buildLesson, buildTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria E — A Constituição e seus princípios. DRAFT (rascunho), Premium. */
const S = {
  fund: cf("fundamentos", "Art. 1º (fundamentos) e parágrafo único (poder emana do povo)."),
  obj: cf("objetivos", "Art. 3º (objetivos fundamentais) e Art. 4º (princípios nas relações internacionais)."),
  sep: cf("separacao", "Art. 2º (Poderes independentes e harmônicos)."),
  rig: cf("rigidez", "Art. 60 (emendas à Constituição; cláusulas pétreas, § 4º)."),
  sup: cf("supremacia", "Preâmbulo e Art. 1º; supremacia constitucional."),
};

export const trailE = buildTrail({
  id: "trilha-e",
  slug: "constituicao-e-principios",
  order: 5,
  title: "A Constituição e seus princípios",
  description:
    "O que é a Constituição, os fundamentos e objetivos da República, a separação de Poderes e por que mudá-la é difícil.",
  lessons: [
    buildLesson({
      id: "e1",
      slug: "o-que-e-uma-constituicao",
      order: 1,
      title: "O que é uma Constituição",
      objective: "Entender a Constituição como a lei máxima que organiza o Estado e limita o poder.",
      sources: [S.sup, S.fund],
      teaching: [
        screen(
          "A lei das leis",
          "A Constituição é a norma mais importante do país: nenhuma lei pode contrariá-la.",
          "Ela organiza o Estado, distribui o poder e garante direitos às pessoas.",
        ),
        screen(
          "Por que ela existe",
          "Uma Constituição limita o poder de quem governa e protege os cidadãos de abusos.",
          "A atual é de 1988, também chamada de “Constituição Cidadã”.",
        ),
      ],
      specs: [
        ["mc", "Definir Constituição", "A Constituição é:", ["A lei máxima do país, que todas as outras devem respeitar", "Uma lei igual às outras", "Um decreto do presidente", "Um regulamento de trânsito"], 0, "A Constituição é a norma suprema: nenhuma lei pode contrariá-la.", ["cf-supremacia"]],
        ["tf", "Hierarquia das normas", "Uma lei comum pode valer mesmo que contrarie a Constituição.", false, "Falso. Leis que contrariam a Constituição são inconstitucionais e não valem.", ["cf-supremacia"]],
        ["mc", "Função de limitar o poder", "Uma função central de uma Constituição é:", ["Limitar o poder de quem governa", "Aumentar impostos", "Escolher o técnico da seleção", "Definir o feriado nacional apenas"], 0, "Constituições existem para limitar o poder e proteger direitos.", ["cf-fundamentos"]],
        ["tf", "Ano da Constituição", "A Constituição brasileira em vigor foi promulgada em 1988.", true, "Verdadeiro. A atual Constituição é de 5 de outubro de 1988.", ["cf-supremacia"]],
        ["mc", "Apelido da CF/88", "A Constituição de 1988 é conhecida como:", ["Constituição Cidadã", "Constituição do Império", "Carta Magna inglesa", "Constituição dos Estados Unidos"], 0, "Ficou conhecida como “Constituição Cidadã” pela ênfase em direitos.", ["cf-supremacia"]],
        ["mc", "O que a Constituição organiza", "Além de garantir direitos, a Constituição também:", ["Organiza o Estado e distribui o poder", "Fixa o preço do pão", "Escolhe os jogadores de futebol", "Define a programação da TV"], 0, "Ela estrutura os Poderes e a federação, além de assegurar direitos.", ["cf-fundamentos"]],
        ["tf", "Quem deve respeitar a Constituição", "Governantes também estão submetidos à Constituição.", true, "Verdadeiro. Ninguém está acima da Constituição, inclusive quem governa.", ["cf-fundamentos"]],
        ["mc", "Supremacia na prática", "Se uma nova lei viola a Constituição, ela pode ser:", ["Declarada inconstitucional pelo Judiciário", "Mantida acima da Constituição", "Transformada em emenda automaticamente", "Ignorada pela Constituição"], 0, "O Judiciário pode declarar inconstitucional uma lei que viole a Constituição.", ["cf-supremacia"]],
      ],
    }),
    buildLesson({
      id: "e2",
      slug: "fundamentos-da-republica",
      order: 2,
      title: "Os fundamentos da República",
      objective: "Conhecer os fundamentos da República no Art. 1º da Constituição.",
      sources: [S.fund],
      teaching: [
        screen(
          "A base do Estado",
          "O Art. 1º lista os fundamentos da República: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, e pluralismo político.",
          "E afirma: todo o poder emana do povo.",
        ),
      ],
      specs: [
        ["mc", "Listar fundamentos", "São fundamentos da República (Art. 1º), EXCETO:", ["A obrigatoriedade de uma só opinião política", "A cidadania", "A dignidade da pessoa humana", "O pluralismo político"], 0, "Pluralismo político é fundamento; impor opinião única é o oposto.", ["cf-fundamentos"]],
        ["tf", "Origem do poder", "Segundo o Art. 1º, todo o poder emana do povo.", true, "Verdadeiro. O poder vem do povo, exercido por representantes ou diretamente.", ["cf-fundamentos"]],
        ["mc", "Dignidade humana", "A “dignidade da pessoa humana” como fundamento significa, em essência:", ["Que toda pessoa tem valor e direitos a serem respeitados", "Que só algumas pessoas têm direitos", "Um imposto sobre a renda", "Uma regra de trânsito"], 0, "A dignidade humana é um valor central que orienta todo o ordenamento.", ["cf-fundamentos"]],
        ["mc", "Trabalho e livre iniciativa", "Os “valores sociais do trabalho e da livre iniciativa” indicam que a República valoriza:", ["Tanto o trabalho quanto a atividade econômica privada", "Apenas o trabalho estatal", "Apenas grandes empresas", "Nenhuma atividade econômica"], 0, "A Constituição reconhece o trabalho e a livre iniciativa como valores.", ["cf-fundamentos"]],
        ["tf", "Soberania", "A soberania é um dos fundamentos da República.", true, "Verdadeiro. A soberania figura entre os fundamentos do Art. 1º.", ["cf-fundamentos"]],
        ["mc", "Pluralismo político", "O pluralismo político como fundamento garante:", ["A convivência de diferentes ideias e partidos", "Um único partido permitido", "A proibição de debates", "O fim das eleições"], 0, "Pluralismo é a convivência legítima de diferentes correntes.", ["cf-fundamentos"]],
        ["tf", "Cidadania", "A cidadania é apenas o direito de votar, nada mais.", false, "Falso. Cidadania é mais ampla: envolve direitos, deveres e participação.", ["cf-fundamentos"]],
        ["mc", "Exercício do poder", "O povo exerce o poder:", ["Por representantes eleitos e também diretamente", "Só por meio do presidente", "Só por meio dos juízes", "Nunca diretamente"], 0, "O parágrafo único do Art. 1º prevê as duas formas.", ["cf-fundamentos"]],
      ],
    }),
    buildLesson({
      id: "e3",
      slug: "objetivos-da-republica",
      order: 3,
      title: "Os objetivos da República",
      objective: "Reconhecer os objetivos fundamentais da República (Art. 3º).",
      sources: [S.obj],
      teaching: [
        screen(
          "Para onde o país deve caminhar",
          "O Art. 3º define objetivos: construir uma sociedade livre, justa e solidária; garantir o desenvolvimento nacional; erradicar a pobreza e reduzir desigualdades; e promover o bem de todos, sem preconceitos.",
        ),
      ],
      specs: [
        ["mc", "Objetivo fundamental", "É um objetivo fundamental da República (Art. 3º):", ["Erradicar a pobreza e reduzir desigualdades", "Aumentar as desigualdades", "Favorecer uma única região", "Eliminar eleições"], 0, "Reduzir desigualdades e erradicar a pobreza são objetivos do Art. 3º.", ["cf-objetivos"]],
        ["tf", "Sociedade solidária", "Construir uma sociedade livre, justa e solidária é um objetivo da República.", true, "Verdadeiro. É o primeiro inciso do Art. 3º.", ["cf-objetivos"]],
        ["mc", "Sem preconceitos", "Promover o bem de todos, segundo o Art. 3º, deve ocorrer:", ["Sem preconceitos de origem, raça, sexo, cor, idade", "Apenas para quem vota", "Só nas capitais", "Só para quem paga mais imposto"], 0, "O objetivo é o bem de todos, sem quaisquer preconceitos.", ["cf-objetivos"]],
        ["mc", "Desenvolvimento", "“Garantir o desenvolvimento nacional” é:", ["Um objetivo fundamental da República", "Uma proibição constitucional", "Um imposto", "Um feriado"], 0, "O desenvolvimento nacional é objetivo do Art. 3º.", ["cf-objetivos"]],
        ["tf", "Objetivos x realidade", "Objetivos constitucionais são metas a perseguir, mesmo que ainda não plenamente alcançadas.", true, "Verdadeiro. São direções a serem buscadas pelas políticas públicas.", ["cf-objetivos"]],
        ["mc", "Relações internacionais", "Nas relações internacionais, a Constituição (Art. 4º) adota, entre outros, o princípio da:", ["Prevalência dos direitos humanos", "Guerra de conquista", "Submissão a outro país", "Isolamento total obrigatório"], 0, "O Art. 4º lista a prevalência dos direitos humanos, entre outros princípios.", ["cf-objetivos"]],
        ["tf", "Autodeterminação", "A autodeterminação dos povos é um princípio das relações internacionais do Brasil.", true, "Verdadeiro. Consta entre os princípios do Art. 4º.", ["cf-objetivos"]],
        ["mc", "Função dos objetivos", "Os objetivos do Art. 3º servem para:", ["Orientar políticas públicas e a atuação do Estado", "Definir o campeão de futebol", "Fixar o câmbio do dólar", "Escolher o hino"], 0, "Eles guiam a ação do Estado e a avaliação de políticas.", ["cf-objetivos"]],
      ],
    }),
    buildLesson({
      id: "e4",
      slug: "separacao-de-poderes",
      order: 4,
      title: "Separação de Poderes",
      objective: "Compreender a separação e a harmonia entre os Poderes.",
      sources: [S.sep],
      teaching: [
        screen(
          "Dividir para equilibrar",
          "O Art. 2º estabelece três Poderes independentes e harmônicos: Legislativo, Executivo e Judiciário.",
          "A divisão evita a concentração de poder e cria controles mútuos (freios e contrapesos).",
        ),
      ],
      specs: [
        ["mc", "Os três Poderes", "Os três Poderes da União são:", ["Legislativo, Executivo e Judiciário", "Federal, estadual e municipal", "Câmara, Senado e Presidência", "Polícia, Exército e Marinha"], 0, "O Art. 2º nomeia Legislativo, Executivo e Judiciário.", ["cf-separacao"]],
        ["tf", "Independentes e harmônicos", "Os Poderes são independentes e harmônicos entre si.", true, "Verdadeiro. É a redação do Art. 2º.", ["cf-separacao"]],
        ["mc", "Objetivo da separação", "A separação de Poderes serve principalmente para:", ["Evitar a concentração de poder e permitir controles mútuos", "Deixar um Poder mandar nos outros", "Acabar com o Judiciário", "Unir todos em uma só pessoa"], 0, "A divisão cria equilíbrio e freios e contrapesos.", ["cf-separacao"]],
        ["mc", "Freios e contrapesos", "Um exemplo de freio entre Poderes é:", ["O Executivo poder vetar um projeto do Legislativo", "O Legislativo prender juízes livremente", "O Judiciário fazer leis sozinho", "O Executivo julgar processos"], 0, "O veto é um clássico mecanismo de controle entre Poderes.", ["cf-separacao"]],
        ["tf", "Hierarquia entre Poderes", "Existe um Poder superior que manda nos outros dois.", false, "Falso. Os Poderes são independentes; nenhum é superior aos demais.", ["cf-separacao"]],
        ["mc", "Função do Legislativo", "Cabe ao Legislativo, tipicamente:", ["Fazer leis e fiscalizar", "Julgar crimes", "Administrar ministérios", "Comandar as Forças Armadas"], 0, "Legislar e fiscalizar são funções típicas do Legislativo.", ["cf-separacao"]],
        ["mc", "Função do Judiciário", "Cabe ao Judiciário, tipicamente:", ["Julgar conflitos aplicando as leis", "Arrecadar impostos", "Propor o orçamento", "Nomear ministros"], 0, "Julgar é a função típica do Judiciário.", ["cf-separacao"]],
        ["tf", "Harmonia", "“Harmônicos entre si” significa que os Poderes devem cooperar dentro de suas competências.", true, "Verdadeiro. A harmonia pressupõe cooperação respeitando limites.", ["cf-separacao"]],
      ],
    }),
    buildLesson({
      id: "e5",
      slug: "mudar-a-constituicao",
      order: 5,
      title: "Como (e por que é difícil) mudar a Constituição",
      objective: "Entender emendas constitucionais e as cláusulas pétreas.",
      sources: [S.rig],
      teaching: [
        screen(
          "Mudança com freio",
          "A Constituição pode ser alterada por emenda, mas com um processo mais rígido que o das leis comuns (quórum qualificado em dois turnos nas duas Casas).",
          "Algumas matérias não podem ser abolidas: são as cláusulas pétreas (Art. 60, § 4º).",
        ),
      ],
      specs: [
        ["mc", "Instrumento de mudança", "A Constituição é alterada por meio de:", ["Emenda constitucional", "Decreto do prefeito", "Portaria de ministério", "Medida provisória apenas"], 0, "Mudanças no texto constitucional se dão por emenda.", ["cf-rigidez"]],
        ["tf", "Rigidez", "Mudar a Constituição é mais difícil do que aprovar uma lei comum.", true, "Verdadeiro. Exige quórum qualificado e dois turnos nas duas Casas.", ["cf-rigidez"]],
        ["mc", "Cláusulas pétreas", "Cláusulas pétreas são:", ["Matérias que não podem ser abolidas por emenda", "Leis que mudam toda semana", "Decretos temporários", "Impostos municipais"], 0, "São núcleos protegidos que emendas não podem abolir (Art. 60, § 4º).", ["cf-rigidez"]],
        ["mc", "Exemplo de cláusula pétrea", "É protegida como cláusula pétrea:", ["A separação dos Poderes", "O preço da gasolina", "O calendário escolar", "A tabela do campeonato"], 0, "A separação de Poderes está entre as cláusulas pétreas.", ["cf-rigidez"]],
        ["tf", "Voto direto", "O voto direto, secreto, universal e periódico é protegido como cláusula pétrea.", true, "Verdadeiro. Consta no rol do Art. 60, § 4º.", ["cf-rigidez"]],
        ["mc", "Por que a rigidez", "A maior dificuldade para mudar a Constituição serve para:", ["Dar estabilidade e proteger direitos de maiorias de ocasião", "Impedir qualquer mudança para sempre", "Favorecer um partido", "Acelerar leis comuns"], 0, "A rigidez protege o pacto fundamental de mudanças apressadas.", ["cf-rigidez"]],
        ["tf", "Emenda x lei", "Emenda constitucional e lei ordinária têm o mesmo processo de aprovação.", false, "Falso. A emenda exige processo mais rígido (quórum e dois turnos).", ["cf-rigidez"]],
        ["mc", "Limite ao poder de emendar", "As cláusulas pétreas mostram que:", ["Nem tudo pode ser mudado, mesmo por maioria no Congresso", "Tudo pode ser mudado a qualquer momento", "A Constituição nunca muda", "Só o presidente muda a Constituição"], 0, "Há um núcleo intangível que limita até o poder de reforma.", ["cf-rigidez"]],
      ],
    }),
  ],
});

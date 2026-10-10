import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria Q — Democracia e autoritarismo. Publicada, Premium. */
const S = {
  edd: cf("estado-democratico", "Art. 1º (Estado Democrático de Direito; fundamentos)."),
  eleic: cf("eleicoes", "Art. 14 (voto) e Art. 60, § 4º (cláusulas pétreas)."),
};

export const trailQ = publishTrail(
  buildTrail({
    id: "trilha-q",
    slug: "democracia-e-autoritarismo",
    order: 17,
    title: "Democracia e autoritarismo",
    description:
      "O que define uma democracia, o que a diferencia do autoritarismo e quais instituições a protegem.",
    lessons: [
      buildLesson({
        id: "q1",
        slug: "o-que-e-democracia",
        order: 1,
        title: "O que é democracia",
        objective: "Entender a democracia como governo baseado na soberania popular.",
        sources: [S.edd],
        teaching: [
          screen(
            "Governo do povo",
            "Democracia é o regime em que o poder vem do povo, exercido por representantes eleitos ou diretamente.",
            "O Brasil é um Estado Democrático de Direito (Art. 1º): além das eleições, vale o império da lei e o respeito a direitos.",
          ),
        ],
        specs: [
          ["mc", "Definição", "Democracia é, em essência:", ["Um regime em que o poder vem do povo", "O governo de um só sem limites", "A ausência de leis", "Um tipo de imposto"], 0, "Na democracia, o poder emana do povo.", ["cf-estado-democratico"]],
          ["tf", "Estado de Direito", "No Estado Democrático de Direito, todos, inclusive governantes, se submetem à lei.", true, "Verdadeiro. O império da lei vale para todos.", ["cf-estado-democratico"]],
          ["mc", "Base do poder", "Numa democracia, a legitimidade do poder vem:", ["Da escolha do povo", "Da força", "De uma herança", "De um único partido"], 0, "A legitimidade democrática nasce da escolha popular.", ["cf-estado-democratico"]],
          ["tf", "Mais que eleições", "Democracia é só votar de vez em quando, nada além disso.", false, "Falso. Envolve também direitos, lei e instituições, além do voto.", ["cf-estado-democratico"]],
          ["mc", "Participação", "Na democracia brasileira, o povo participa:", ["Por representantes e também diretamente", "Só por um rei", "Nunca", "Só por militares"], 0, "Há representação e mecanismos de participação direta.", ["cf-estado-democratico"]],
          ["mc", "Igualdade política", "Uma ideia central da democracia é:", ["Cada pessoa tem igual direito de participar", "Alguns valem mais que outros", "Só os ricos decidem", "Ninguém decide"], 0, "A igualdade política (um voto por pessoa) é central.", ["cf-estado-democratico"]],
          ["tf", "Poder limitado", "Na democracia, o poder dos governantes é limitado por leis e instituições.", true, "Verdadeiro. Não há poder ilimitado na democracia.", ["cf-estado-democratico"]],
          ["mc", "Dignidade", "O Estado Democrático de Direito se apoia, entre outros, na:", ["Dignidade da pessoa humana", "Vontade de um só homem", "Ausência de direitos", "Concentração de poder"], 0, "A dignidade humana é fundamento (Art. 1º).", ["cf-estado-democratico"]],
        ],
      }),
      buildLesson({
        id: "q2",
        slug: "pilares-da-democracia",
        order: 2,
        title: "Os pilares da democracia",
        objective: "Reconhecer eleições livres, direitos e separação de Poderes como pilares.",
        sources: [S.eleic],
        teaching: [
          screen(
            "O que sustenta a democracia",
            "Pilares: eleições livres e periódicas; liberdades (expressão, imprensa, reunião); separação de Poderes; e respeito aos direitos das minorias.",
            "Esses elementos se reforçam: tirar um enfraquece o conjunto.",
          ),
        ],
        specs: [
          ["mc", "Pilar democrático", "É um pilar da democracia:", ["Eleições livres e periódicas", "Um só partido permitido", "Censura à imprensa", "Poder sem limites"], 0, "Eleições livres e periódicas são essenciais.", ["cf-eleicoes"]],
          ["tf", "Liberdade de imprensa", "A liberdade de imprensa é importante para a democracia.", true, "Verdadeiro. Imprensa livre fiscaliza o poder e informa.", ["cf-eleicoes"]],
          ["mc", "Separação de Poderes", "A separação de Poderes ajuda a democracia porque:", ["Evita a concentração de poder", "Concentra tudo em um", "Elimina eleições", "Proíbe leis"], 0, "A divisão do poder protege contra abusos.", ["cf-eleicoes"]],
          ["mc", "Direitos das minorias", "Numa democracia, as minorias:", ["Têm direitos que a maioria não pode simplesmente eliminar", "Não têm direitos", "Mandam na maioria", "São proibidas"], 0, "A democracia protege direitos mesmo de quem está em minoria.", ["cf-eleicoes"]],
          ["tf", "Alternância", "A possibilidade de alternância no poder (oposição poder vencer) é saudável para a democracia.", true, "Verdadeiro. Alternância é sinal de democracia viva.", ["cf-eleicoes"]],
          ["mc", "Liberdades", "Liberdade de expressão e de reunião são:", ["Pilares da vida democrática", "Ameaças à democracia", "Privilégios de poucos", "Proibições legais"], 0, "As liberdades sustentam o debate democrático.", ["cf-eleicoes"]],
          ["tf", "Reforço mútuo", "Enfraquecer um pilar (ex.: a imprensa livre) tende a enfraquecer a democracia como um todo.", true, "Verdadeiro. Os pilares se sustentam mutuamente.", ["cf-eleicoes"]],
          ["mc", "Voto protegido", "O voto direto e secreto é tão importante que a Constituição o protege como:", ["Cláusula pétrea", "Uma simples portaria", "Um imposto", "Uma opção do governo"], 0, "O voto é protegido como cláusula pétrea (Art. 60, § 4º).", ["cf-eleicoes"]],
        ],
      }),
      buildLesson({
        id: "q3",
        slug: "o-que-e-autoritarismo",
        order: 3,
        title: "O que é autoritarismo",
        objective: "Diferenciar autoritarismo de democracia.",
        sources: [S.edd],
        teaching: [
          screen(
            "Concentração de poder",
            "No autoritarismo, o poder se concentra em uma pessoa ou grupo, com pouco ou nenhum controle e eleições ausentes ou não livres.",
            "Costuma haver restrição de liberdades e perseguição a quem discorda.",
          ),
        ],
        specs: [
          ["mc", "Autoritarismo", "O autoritarismo caracteriza-se por:", ["Concentração de poder e poucos controles", "Eleições livres frequentes", "Imprensa livre", "Separação de Poderes forte"], 0, "Concentrar poder sem controle marca o autoritarismo.", ["cf-estado-democratico"]],
          ["tf", "Eleições", "Regimes autoritários costumam ter eleições ausentes ou não livres.", true, "Verdadeiro. Faltam eleições genuínas e competitivas.", ["cf-estado-democratico"]],
          ["mc", "Liberdades no autoritarismo", "No autoritarismo, as liberdades costumam ser:", ["Restringidas", "Ampliadas", "Protegidas ao máximo", "Indiferentes"], 0, "Há restrição de liberdades e do debate.", ["cf-estado-democratico"]],
          ["mc", "Controle do poder", "No autoritarismo, o controle sobre quem governa é:", ["Fraco ou inexistente", "Forte e independente", "Exercido pela imprensa livre", "Garantido por eleições"], 0, "Faltam freios e controles efetivos.", ["cf-estado-democratico"]],
          ["tf", "Oposição", "Em regimes autoritários, a oposição costuma ser perseguida ou silenciada.", true, "Verdadeiro. A dissidência é reprimida.", ["cf-estado-democratico"]],
          ["mc", "Contraste", "A diferença central entre democracia e autoritarismo está em:", ["Quem detém o poder e quais os limites a ele", "A cor das bandeiras", "O nome do país", "O tamanho do território"], 0, "Origem e limites do poder distinguem os regimes.", ["cf-estado-democratico"]],
          ["tf", "Lei para todos", "No Estado de Direito, nem o governante está acima da lei — o oposto do arbítrio autoritário.", true, "Verdadeiro. O império da lei limita o poder.", ["cf-estado-democratico"]],
          ["mc", "Sinal de alerta", "Um sinal de erosão democrática é:", ["Atacar instituições de controle e a imprensa livre", "Fortalecer a fiscalização", "Garantir eleições", "Ampliar direitos"], 0, "Minar controles e a imprensa enfraquece a democracia.", ["cf-estado-democratico"]],
        ],
      }),
      buildLesson({
        id: "q4",
        slug: "instituicoes-que-protegem",
        order: 4,
        title: "As instituições que protegem a democracia",
        objective: "Reconhecer instituições que sustentam a democracia.",
        sources: [S.eleic],
        teaching: [
          screen(
            "Guardas da democracia",
            "Eleições organizadas por uma Justiça Eleitoral independente, um Judiciário que guarda a Constituição, imprensa livre e órgãos de controle protegem a democracia.",
            "Instituições fortes e independentes limitam abusos de qualquer governante.",
          ),
        ],
        specs: [
          ["mc", "Guardiã da Constituição", "A guarda da Constituição cabe principalmente ao:", ["STF (Supremo Tribunal Federal)", "Banco Central", "Ministério da Fazenda", "Exército"], 0, "O STF é o guardião da Constituição.", ["cf-eleicoes"]],
          ["tf", "Justiça Eleitoral", "Uma Justiça Eleitoral independente ajuda a garantir eleições confiáveis.", true, "Verdadeiro. A independência assegura lisura ao pleito.", ["cf-eleicoes"]],
          ["mc", "Imprensa", "Uma imprensa livre contribui para a democracia ao:", ["Informar e fiscalizar o poder", "Servir só ao governo", "Esconder fatos", "Proibir o debate"], 0, "Imprensa livre informa e fiscaliza.", ["cf-eleicoes"]],
          ["mc", "Instituições fortes", "Instituições independentes servem para:", ["Limitar abusos de qualquer governante", "Favorecer o governo de plantão", "Concentrar poder", "Acabar com a lei"], 0, "A independência limita abusos de poder.", ["cf-eleicoes"]],
          ["tf", "Freios e contrapesos", "O controle mútuo entre Poderes protege a democracia.", true, "Verdadeiro. Freios e contrapesos evitam concentração.", ["cf-eleicoes"]],
          ["mc", "Papel do cidadão", "O cidadão protege a democracia quando:", ["Participa, se informa e cobra as instituições", "Fica alheio a tudo", "Espalha boatos", "Despreza o voto"], 0, "A vigilância cidadã fortalece as instituições.", ["cf-eleicoes"]],
          ["tf", "Independência", "Órgãos de controle precisam de independência para fiscalizar o poder.", true, "Verdadeiro. Sem autonomia, o controle é fraco.", ["cf-eleicoes"]],
          ["mc", "Resultado de instituições fortes", "Instituições fortes tendem a:", ["Tornar a democracia mais resistente a abusos", "Facilitar golpes", "Enfraquecer direitos", "Eliminar eleições"], 0, "Instituições sólidas dão resiliência à democracia.", ["cf-eleicoes"]],
        ],
      }),
      buildLesson({
        id: "q5",
        slug: "cuidar-da-democracia",
        order: 5,
        title: "Como cuidar da democracia no dia a dia",
        objective: "Identificar atitudes que fortalecem a democracia.",
        sources: [S.edd],
        teaching: [
          screen(
            "Democracia se pratica",
            "Além das eleições, a democracia se cuida no dia a dia: respeitar quem pensa diferente, checar informações, participar e defender as regras do jogo.",
            "Rejeitar a violência política e aceitar resultados legítimos também protege a democracia.",
          ),
        ],
        specs: [
          ["mc", "Atitude democrática", "É uma atitude que fortalece a democracia:", ["Respeitar quem pensa diferente e checar informações", "Ameaçar quem discorda", "Espalhar boatos", "Desprezar as regras"], 0, "Respeito e checagem sustentam o debate democrático.", ["cf-estado-democratico"]],
          ["tf", "Violência política", "A violência política é incompatível com a democracia.", true, "Verdadeiro. A democracia resolve conflitos por meios pacíficos.", ["cf-estado-democratico"]],
          ["mc", "Divergência", "Numa democracia, divergir de opinião é:", ["Normal e legítimo", "Proibido", "Motivo para perseguição", "Crime sempre"], 0, "A divergência faz parte do pluralismo.", ["cf-estado-democratico"]],
          ["tf", "Aceitar resultados", "Aceitar resultados legítimos de eleições é parte do compromisso democrático.", true, "Verdadeiro. Respeitar o resultado protege a democracia.", ["cf-estado-democratico"]],
          ["mc", "Checar antes de compartilhar", "Antes de compartilhar uma informação política, o ideal é:", ["Checar a fonte", "Repassar na hora", "Acreditar sempre", "Alterar o conteúdo"], 0, "Checar evita espalhar desinformação.", ["cf-estado-democratico"]],
          ["mc", "Defender regras", "Defender as “regras do jogo” democrático significa:", ["Respeitar instituições e processos legítimos", "Burlar a lei quando convém", "Ignorar eleições", "Atacar quem fiscaliza"], 0, "Respeitar as regras preserva a democracia para todos.", ["cf-estado-democratico"]],
          ["tf", "Participação contínua", "Cuidar da democracia é um exercício contínuo, não só no dia da eleição.", true, "Verdadeiro. A democracia se pratica no cotidiano.", ["cf-estado-democratico"]],
          ["mc", "Pluralismo", "Conviver com a diversidade de opiniões é:", ["Parte essencial da democracia", "Um defeito a eliminar", "Proibido", "Indiferente"], 0, "O pluralismo é fundamento do Estado democrático.", ["cf-estado-democratico"]],
        ],
      }),
    ],
  }),
);

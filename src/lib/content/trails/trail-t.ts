import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria T — Segurança e justiça. Publicada, Premium. */
const S = {
  seg: cf("seguranca-publica", "Art. 144 (segurança pública; polícias federal, civil, militar e demais órgãos)."),
  dir: cf("devido-processo", "Art. 5º, LIV, LV e LVII (devido processo, ampla defesa e presunção de inocência)."),
};

export const trailT = publishTrail(
  buildTrail({
    id: "trilha-t",
    slug: "seguranca-e-justica",
    order: 20,
    title: "Segurança e justiça",
    description:
      "Como funciona a segurança pública, quem faz o quê, e as garantias de um processo justo.",
    lessons: [
      buildLesson({
        id: "t1",
        slug: "seguranca-publica",
        order: 1,
        title: "O que é segurança pública",
        objective: "Entender a segurança pública como dever do Estado e responsabilidade de todos.",
        sources: [S.seg],
        teaching: [
          screen(
            "Dever do Estado",
            "A Constituição (Art. 144) diz que a segurança pública é dever do Estado e direito e responsabilidade de todos.",
            "Ela é exercida para preservar a ordem pública e a incolumidade das pessoas e do patrimônio, por meio de diferentes órgãos policiais.",
          ),
        ],
        specs: [
          ["mc", "Segurança pública", "A segurança pública é:", ["Dever do Estado e responsabilidade de todos", "Só problema da polícia", "Um serviço pago", "Opcional"], 0, "O Art. 144 define assim.", ["cf-seguranca-publica"]],
          ["tf", "Objetivo", "A segurança pública busca preservar a ordem e proteger pessoas e patrimônio.", true, "Verdadeiro. É o objetivo previsto no Art. 144.", ["cf-seguranca-publica"]],
          ["mc", "Base legal", "A segurança pública está prevista:", ["No Art. 144 da Constituição", "Em nenhum lugar", "Só em leis municipais", "Num decreto secreto"], 0, "O Art. 144 trata do tema.", ["cf-seguranca-publica"]],
          ["tf", "Responsabilidade de todos", "Colaborar com a segurança (ex.: denunciar crimes) também é papel do cidadão.", true, "Verdadeiro. É direito e responsabilidade de todos.", ["cf-seguranca-publica"]],
          ["mc", "Prevenção", "Além da polícia, a segurança envolve:", ["Prevenção, educação e políticas sociais", "Apenas prisões", "Nada além de armas", "Só câmeras"], 0, "Segurança é mais ampla que repressão.", ["cf-seguranca-publica"]],
          ["mc", "Ordem pública", "Preservar a ordem pública significa:", ["Garantir convivência pacífica e cumprimento das leis", "Proibir manifestações", "Acabar com direitos", "Vigiar opositores"], 0, "É assegurar a paz social dentro da lei.", ["cf-seguranca-publica"]],
          ["tf", "Direitos", "A ação de segurança deve respeitar os direitos fundamentais.", true, "Verdadeiro. Segurança e direitos andam juntos.", ["cf-devido-processo"]],
          ["mc", "Papel do cidadão", "Um exemplo de colaboração é:", ["Denunciar por canais oficiais", "Fazer justiça com as próprias mãos", "Ignorar crimes", "Espalhar boatos"], 0, "A denúncia por canais oficiais é a via correta.", ["cf-seguranca-publica"]],
        ],
      }),
      buildLesson({
        id: "t2",
        slug: "quem-faz-o-que",
        order: 2,
        title: "As polícias e quem faz o quê",
        objective: "Diferenciar os principais órgãos de segurança e suas funções.",
        sources: [S.seg],
        teaching: [
          screen(
            "Cada polícia, um papel",
            "O Art. 144 lista, entre outros: Polícia Federal, Polícia Rodoviária Federal, polícias civis, polícias militares e corpos de bombeiros militares; a Constituição também prevê as guardas municipais.",
            "A polícia civil investiga crimes (polícia judiciária); a polícia militar faz o policiamento ostensivo e preserva a ordem.",
          ),
        ],
        specs: [
          ["mc", "Polícia civil", "A polícia civil atua principalmente:", ["Investigando crimes (polícia judiciária)", "No policiamento ostensivo nas ruas", "Nas fronteiras só", "Apagando incêndios"], 0, "A polícia civil é polícia judiciária: investiga.", ["cf-seguranca-publica"]],
          ["mc", "Polícia militar", "A polícia militar faz principalmente:", ["Policiamento ostensivo e preservação da ordem", "Investigação de homicídios", "Controle das contas públicas", "Fiscalização de impostos"], 0, "A PM faz o policiamento ostensivo.", ["cf-seguranca-publica"]],
          ["tf", "Polícia Federal", "A Polícia Federal apura infrações contra a União e atua em crimes interestaduais e internacionais.", true, "Verdadeiro. São atribuições da PF (Art. 144).", ["cf-seguranca-publica"]],
          ["mc", "Bombeiros", "Os corpos de bombeiros militares cuidam de:", ["Defesa civil, incêndios e resgates", "Investigar fraudes", "Julgar processos", "Arrecadar tributos"], 0, "Bombeiros atuam em defesa civil e resgates.", ["cf-seguranca-publica"]],
          ["mc", "Polícia Rodoviária Federal", "A PRF atua:", ["No patrulhamento das rodovias federais", "Nas eleições", "No Congresso", "Nos tribunais"], 0, "A PRF patrulha as rodovias federais.", ["cf-seguranca-publica"]],
          ["tf", "Guardas municipais", "A Constituição permite que municípios tenham guardas municipais para proteger seus bens e serviços.", true, "Verdadeiro. O Art. 144, §8º prevê as guardas municipais.", ["cf-seguranca-publica"]],
          ["mc", "Inquérito", "A investigação de um crime pela polícia gera:", ["Um inquérito policial", "Uma lei", "Uma sentença", "Um imposto"], 0, "A apuração se formaliza no inquérito.", ["cf-seguranca-publica"]],
          ["tf", "Divisão de funções", "Dividir funções entre as polícias ajuda a organizar a segurança.", true, "Verdadeiro. Cada órgão tem seu papel.", ["cf-seguranca-publica"]],
        ],
      }),
      buildLesson({
        id: "t3",
        slug: "o-caminho-da-justica",
        order: 3,
        title: "O caminho da justiça criminal",
        objective: "Entender as etapas básicas: investigação, acusação e julgamento.",
        sources: [S.dir],
        teaching: [
          screen(
            "Da investigação ao julgamento",
            "Em geral: a polícia investiga, o Ministério Público acusa (oferece a denúncia) e o Judiciário julga, garantindo defesa ao acusado.",
            "Essa separação de papéis evita que a mesma pessoa investigue, acuse e julgue — protegendo contra abusos.",
          ),
        ],
        specs: [
          ["mc", "Quem investiga", "Em regra, quem investiga o crime é:", ["A polícia", "O juiz", "O réu", "O jornalista"], 0, "A investigação cabe à polícia.", ["cf-seguranca-publica"]],
          ["mc", "Quem acusa", "Nos crimes de ação pública, quem acusa é:", ["O Ministério Público", "A polícia militar", "O próprio juiz", "A vítima sempre"], 0, "O MP é o titular da ação penal pública.", ["cf-devido-processo"]],
          ["mc", "Quem julga", "Quem julga o processo é:", ["O Poder Judiciário", "O delegado", "O promotor", "O Congresso"], 0, "O julgamento cabe ao Judiciário.", ["cf-devido-processo"]],
          ["tf", "Separação de papéis", "Separar quem investiga, acusa e julga protege contra abusos.", true, "Verdadeiro. É uma garantia do processo justo.", ["cf-devido-processo"]],
          ["mc", "Defesa", "Durante o processo, o acusado tem direito a:", ["Advogado e ampla defesa", "Nenhuma defesa", "Ser condenado sem ouvir", "Escolher o juiz"], 0, "A ampla defesa é garantida (Art. 5º, LV).", ["cf-devido-processo"]],
          ["tf", "Ministério Público", "O Ministério Público também fiscaliza a lei e defende a sociedade.", true, "Verdadeiro. É função institucional do MP.", ["cf-devido-processo"]],
          ["mc", "Sentença", "A decisão final do juiz no processo chama-se:", ["Sentença", "Lei", "Decreto", "Portaria"], 0, "A sentença encerra o julgamento em 1ª instância.", ["cf-devido-processo"]],
          ["tf", "Recurso", "Quem perde um processo geralmente pode recorrer a um tribunal.", true, "Verdadeiro. O duplo grau permite revisão da decisão.", ["cf-devido-processo"]],
        ],
      }),
      buildLesson({
        id: "t4",
        slug: "direitos-de-quem-e-acusado",
        order: 4,
        title: "Os direitos de quem é acusado",
        objective: "Conhecer garantias como presunção de inocência e devido processo.",
        sources: [S.dir],
        teaching: [
          screen(
            "Inocente até prova em contrário",
            "Ninguém é considerado culpado até o trânsito em julgado da condenação (Art. 5º, LVII): é a presunção de inocência.",
            "Também valem o devido processo legal, o contraditório, a ampla defesa e a proibição de provas ilícitas. Essas garantias protegem qualquer pessoa.",
          ),
        ],
        specs: [
          ["mc", "Presunção de inocência", "Pela Constituição, a pessoa é considerada culpada:", ["Só após condenação definitiva (trânsito em julgado)", "Assim que é acusada", "Quando a mídia noticia", "Quando é presa em flagrante"], 0, "Vale a presunção de inocência (Art. 5º, LVII).", ["cf-devido-processo"]],
          ["tf", "Devido processo", "Ninguém pode ser privado da liberdade sem o devido processo legal.", true, "Verdadeiro. É garantia do Art. 5º, LIV.", ["cf-devido-processo"]],
          ["mc", "Contraditório", "O contraditório garante que:", ["Cada lado possa se manifestar e contestar provas", "Só a acusação fale", "O juiz decida sozinho sem ouvir", "A defesa seja proibida"], 0, "O contraditório assegura a participação das partes.", ["cf-devido-processo"]],
          ["tf", "Provas ilícitas", "Provas obtidas por meios ilícitos não valem no processo.", true, "Verdadeiro. São inadmissíveis (Art. 5º, LVI).", ["cf-devido-processo"]],
          ["mc", "Defesa", "Todo acusado tem direito a:", ["Defesa, mesmo sem poder pagar advogado", "Nenhuma defesa", "Ser julgado em segredo", "Escolher a pena"], 0, "A defesa é assegurada; há defensoria pública para quem não pode pagar.", ["cf-devido-processo"]],
          ["mc", "Por que proteger o acusado", "Garantir direitos ao acusado serve para:", ["Evitar condenações injustas", "Soltar todos os criminosos", "Enfraquecer a lei", "Proteger só os ricos"], 0, "As garantias evitam erros e injustiças.", ["cf-devido-processo"]],
          ["tf", "Igualdade", "As garantias processuais valem para qualquer pessoa, independentemente de quem seja.", true, "Verdadeiro. Todos são iguais perante a lei.", ["cf-devido-processo"]],
          ["mc", "Prisão", "Em regra, uma prisão deve ser:", ["Fundamentada e dentro da lei", "Por qualquer motivo", "Decidida pela opinião pública", "Permanente sem julgamento"], 0, "A prisão exige fundamento legal.", ["cf-devido-processo"]],
        ],
      }),
      buildLesson({
        id: "t5",
        slug: "seguranca-e-direitos",
        order: 5,
        title: "Segurança e direitos: o equilíbrio",
        objective: "Entender por que segurança eficaz e respeito a direitos caminham juntos.",
        sources: [S.dir],
        teaching: [
          screen(
            "Segurança COM direitos",
            "Um Estado democrático busca segurança sem abrir mão dos direitos: combate o crime respeitando a lei.",
            "Abusos (tortura, prisões ilegais) são proibidos e enfraquecem a confiança nas instituições. Segurança de verdade protege a todos, inclusive de abusos.",
          ),
        ],
        specs: [
          ["mc", "Equilíbrio", "Num Estado democrático, segurança e direitos:", ["Devem caminhar juntos", "São sempre opostos", "Não se relacionam", "Excluem-se"], 0, "Segurança e direitos se complementam.", ["cf-devido-processo"]],
          ["tf", "Tortura", "A Constituição proíbe a tortura e o tratamento desumano.", true, "Verdadeiro. É vedação do Art. 5º, III.", ["cf-devido-processo"]],
          ["mc", "Abuso de autoridade", "O abuso de autoridade:", ["É ilegal e deve ser responsabilizado", "É permitido para agilizar", "Não existe", "É recomendável"], 0, "Abusos são ilegais e puníveis.", ["cf-devido-processo"]],
          ["tf", "Confiança", "O respeito aos direitos aumenta a confiança da população nas instituições de segurança.", true, "Verdadeiro. Legitimidade depende de respeito à lei.", ["cf-seguranca-publica"]],
          ["mc", "Segurança eficaz", "Uma política de segurança eficaz:", ["Combina prevenção, investigação e respeito à lei", "Ignora direitos", "Depende só de armas", "Prende sem provas"], 0, "Eficácia e legalidade andam juntas.", ["cf-seguranca-publica"]],
          ["mc", "Justiça com as próprias mãos", "Fazer justiça com as próprias mãos:", ["É proibido; a justiça cabe ao Estado", "É um direito", "É recomendável", "Resolve tudo"], 0, "O uso da força é monopólio do Estado, nos limites da lei.", ["cf-devido-processo"]],
          ["tf", "Controle", "Órgãos de segurança também são fiscalizados (corregedorias, Ministério Público).", true, "Verdadeiro. Há controle sobre quem exerce a segurança.", ["cf-devido-processo"]],
          ["mc", "Objetivo final", "O objetivo da segurança com direitos é:", ["Proteger todas as pessoas, inclusive de abusos", "Proteger só o Estado", "Punir sem julgar", "Vigiar opositores"], 0, "A proteção é de todos, dentro da lei.", ["cf-seguranca-publica"]],
        ],
      }),
    ],
  }),
);

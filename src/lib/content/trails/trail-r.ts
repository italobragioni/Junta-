import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria R — Cidadania e deveres. Publicada, Premium. */
const S = {
  nac: cf("nacionalidade", "Art. 12 (nacionalidade) e Art. 1º, II (cidadania)."),
  pol: cf("direitos-politicos", "Art. 14 e 15 (direitos políticos; voto)."),
  dev: cf("deveres", "Art. 5º e deveres de cidadania decorrentes da Constituição."),
};

export const trailR = publishTrail(
  buildTrail({
    id: "trilha-r",
    slug: "cidadania-e-deveres",
    order: 18,
    title: "Cidadania e deveres",
    description:
      "O que é ser cidadão: nacionalidade, direitos políticos e os deveres que vêm junto com os direitos.",
    lessons: [
      buildLesson({
        id: "r1",
        slug: "o-que-e-cidadania",
        order: 1,
        title: "O que é cidadania",
        objective: "Entender cidadania como pertencimento com direitos e deveres.",
        sources: [S.nac],
        teaching: [
          screen(
            "Pertencer e participar",
            "Cidadania é a condição de membro pleno de uma comunidade política, com direitos e deveres.",
            "É um fundamento da República (Art. 1º) e vai além de votar: envolve participar e respeitar regras comuns.",
          ),
        ],
        specs: [
          ["mc", "Cidadania", "Cidadania é:", ["A condição de membro pleno da comunidade política, com direitos e deveres", "Apenas ter carteira de identidade", "Um imposto", "Um cargo público"], 0, "Cidadania combina direitos, deveres e participação.", ["cf-nacionalidade"]],
          ["tf", "Fundamento", "A cidadania é um fundamento da República (Art. 1º).", true, "Verdadeiro. Consta entre os fundamentos do Art. 1º.", ["cf-nacionalidade"]],
          ["mc", "Mais que votar", "Cidadania:", ["Vai além de votar; inclui participar e respeitar regras", "É só votar", "É só pagar imposto", "Não envolve deveres"], 0, "A cidadania é mais ampla do que o voto.", ["cf-nacionalidade"]],
          ["tf", "Direitos e deveres", "Ser cidadão envolve tanto direitos quanto deveres.", true, "Verdadeiro. Direitos e deveres andam juntos.", ["cf-nacionalidade"]],
          ["mc", "Participação", "Um cidadão participativo, por exemplo:", ["Acompanha a vida pública e colabora com a comunidade", "Ignora tudo", "Só reclama sem agir", "Despreza o próximo"], 0, "Participar é parte de exercer a cidadania.", ["cf-nacionalidade"]],
          ["mc", "Cidadania ativa", "“Cidadania ativa” significa:", ["Exercer direitos e deveres de forma participativa", "Não fazer nada", "Apenas criticar", "Fugir das regras"], 0, "Cidadania ativa é participação responsável.", ["cf-nacionalidade"]],
          ["tf", "Respeito ao outro", "Respeitar os direitos dos outros faz parte da cidadania.", true, "Verdadeiro. A convivência exige respeito mútuo.", ["cf-nacionalidade"]],
          ["mc", "Comunidade", "A cidadania liga a pessoa a:", ["Uma comunidade política com regras comuns", "Nenhum grupo", "Apenas sua família", "Uma empresa"], 0, "O cidadão integra uma comunidade política.", ["cf-nacionalidade"]],
        ],
      }),
      buildLesson({
        id: "r2",
        slug: "nacionalidade",
        order: 2,
        title: "Nacionalidade",
        objective: "Diferenciar nacionalidade e cidadania, em termos gerais.",
        sources: [S.nac],
        teaching: [
          screen(
            "Quem é brasileiro",
            "A Constituição (Art. 12) trata da nacionalidade: há brasileiros natos (ex.: nascidos no Brasil) e naturalizados (que adquirem a nacionalidade).",
            "Nacionalidade é o vínculo com o país; cidadania é o exercício de direitos políticos ligados a esse vínculo.",
          ),
        ],
        specs: [
          ["mc", "Nacionalidade", "Nacionalidade é:", ["O vínculo jurídico de uma pessoa com um país", "Um imposto", "Um cargo", "Um partido"], 0, "É o vínculo da pessoa com o Estado.", ["cf-nacionalidade"]],
          ["mc", "Brasileiro nato", "Brasileiro nato é, por exemplo:", ["Quem nasce no Brasil (regra geral)", "Só quem se naturaliza", "Qualquer estrangeiro", "Quem paga imposto"], 0, "Nascer no território é via comum da nacionalidade nata.", ["cf-nacionalidade"]],
          ["mc", "Brasileiro naturalizado", "Brasileiro naturalizado é quem:", ["Adquire a nacionalidade brasileira depois, cumprindo requisitos", "Nunca teve vínculo com o Brasil", "É estrangeiro de passagem", "Não existe"], 0, "A naturalização concede a nacionalidade a quem cumpre requisitos.", ["cf-nacionalidade"]],
          ["tf", "Nacionalidade x cidadania", "Nacionalidade (vínculo com o país) e cidadania (exercício de direitos políticos) são ideias próximas, mas distintas.", true, "Verdadeiro. Uma é o vínculo; a outra, o exercício de direitos políticos.", ["cf-nacionalidade"]],
          ["mc", "Base legal", "A nacionalidade é tratada:", ["Na Constituição (Art. 12)", "Em nenhum lugar", "Só em regras de clube", "Em um decreto secreto"], 0, "O Art. 12 cuida da nacionalidade.", ["cf-nacionalidade"]],
          ["tf", "Direitos do nacional", "Ser nacional de um país garante uma série de direitos e deveres nesse país.", true, "Verdadeiro. O vínculo gera direitos e deveres.", ["cf-nacionalidade"]],
          ["mc", "Vínculo", "A nacionalidade cria um vínculo entre:", ["A pessoa e o Estado", "Dois estrangeiros", "Uma empresa e um banco", "Ninguém"], 0, "É o elo jurídico pessoa–Estado.", ["cf-nacionalidade"]],
          ["mc", "Exercício político", "Os direitos políticos (como votar) ligam-se mais diretamente à:", ["Cidadania", "Cor dos olhos", "Profissão", "Religião"], 0, "O exercício político é próprio da cidadania.", ["cf-direitos-politicos"]],
        ],
      }),
      buildLesson({
        id: "r3",
        slug: "direitos-politicos",
        order: 3,
        title: "Direitos políticos",
        objective: "Conhecer direitos políticos e o alistamento.",
        sources: [S.pol],
        teaching: [
          screen(
            "Votar e ser votado",
            "Direitos políticos incluem votar, ser votado e participar da vida pública (Art. 14).",
            "Eles podem ser perdidos ou suspensos em casos previstos (Art. 15), como condenação criminal com efeitos definidos em lei.",
          ),
        ],
        specs: [
          ["mc", "Direitos políticos", "Direitos políticos incluem:", ["Votar e ser votado", "Pagar menos imposto", "Furar filas", "Isenção de leis"], 0, "Votar e ser votado são direitos políticos.", ["cf-direitos-politicos"]],
          ["tf", "Alistamento", "O alistamento eleitoral (título) permite exercer o direito de votar.", true, "Verdadeiro. O título habilita o cidadão a votar.", ["cf-direitos-politicos"]],
          ["mc", "Suspensão de direitos", "Os direitos políticos podem ser suspensos:", ["Em casos previstos na Constituição e na lei", "Por qualquer motivo", "Pela vontade de um ministro", "Nunca"], 0, "Há hipóteses legais de perda ou suspensão (Art. 15).", ["cf-direitos-politicos"]],
          ["mc", "Ser votado", "Para ser votado, além de outros requisitos, é preciso:", ["Cumprir condições de elegibilidade (idade, filiação etc.)", "Apenas querer", "Ter uma empresa", "Ter mais de 70 anos"], 0, "Há condições de elegibilidade a cumprir.", ["cf-direitos-politicos"]],
          ["tf", "Participação pública", "Participar de audiências, conselhos e iniciativa popular também é exercer direitos ligados à cidadania.", true, "Verdadeiro. A participação vai além do voto.", ["cf-direitos-politicos"]],
          ["mc", "Importância do voto", "O voto é importante porque:", ["Escolhe representantes e influencia os rumos do país", "Não muda nada", "É só formalidade", "Serve ao governo apenas"], 0, "Pelo voto, o cidadão influencia as decisões coletivas.", ["cf-direitos-politicos"]],
          ["tf", "Direitos e responsabilidade", "Exercer direitos políticos com responsabilidade inclui informar-se antes de votar.", true, "Verdadeiro. O voto consciente exige informação.", ["cf-direitos-politicos"]],
          ["mc", "Base constitucional", "Os direitos políticos estão previstos:", ["Na Constituição (Art. 14 e 15)", "Em nenhum lugar", "Só em redes sociais", "Em um regimento de clube"], 0, "Os Arts. 14 e 15 tratam dos direitos políticos.", ["cf-direitos-politicos"]],
        ],
      }),
      buildLesson({
        id: "r4",
        slug: "deveres-do-cidadao",
        order: 4,
        title: "Os deveres do cidadão",
        objective: "Reconhecer deveres que acompanham os direitos.",
        sources: [S.dev],
        teaching: [
          screen(
            "Direitos vêm com deveres",
            "Com os direitos vêm deveres: respeitar as leis e os direitos dos outros, votar quando obrigatório, pagar tributos, colaborar com a Justiça (como no júri) e, quando convocado, o serviço militar.",
          ),
        ],
        specs: [
          ["mc", "Dever do cidadão", "É um dever do cidadão:", ["Respeitar as leis e os direitos dos outros", "Furar filas", "Sonegar impostos", "Desrespeitar o próximo"], 0, "Respeitar leis e direitos alheios é dever básico.", ["cf-deveres"]],
          ["tf", "Pagar tributos", "Pagar os tributos devidos é um dever do cidadão.", true, "Verdadeiro. Os tributos financiam os serviços públicos.", ["cf-deveres"]],
          ["mc", "Voto obrigatório", "Para quem tem entre 18 e 70 anos, votar é:", ["Um dever (obrigatório)", "Proibido", "Opcional sempre", "Pago"], 0, "O voto é obrigatório nessa faixa etária.", ["cf-direitos-politicos"]],
          ["tf", "Júri", "Ser convocado para o Tribunal do Júri é uma forma de colaborar com a Justiça.", true, "Verdadeiro. O serviço no júri é um dever cívico.", ["cf-deveres"]],
          ["mc", "Serviço militar", "O serviço militar obrigatório, quando convocado, é:", ["Um dever previsto em lei", "Opcional para todos", "Proibido", "Um imposto"], 0, "Há a obrigatoriedade do serviço militar nos termos da lei.", ["cf-deveres"]],
          ["tf", "Direitos dos outros", "Meu direito encontra limite no direito do outro.", true, "Verdadeiro. A convivência exige respeitar direitos alheios.", ["cf-deveres"]],
          ["mc", "Cuidar do público", "Cuidar do patrimônio público (praças, escolas) é:", ["Um dever de cidadania", "Responsabilidade de ninguém", "Proibido", "Opcional e irrelevante"], 0, "O bem público é de todos e merece cuidado.", ["cf-deveres"]],
          ["mc", "Equilíbrio", "A relação entre direitos e deveres é de:", ["Equilíbrio: um acompanha o outro", "Só direitos", "Só deveres", "Nenhuma relação"], 0, "Direitos e deveres se equilibram.", ["cf-deveres"]],
        ],
      }),
      buildLesson({
        id: "r5",
        slug: "exercer-a-cidadania",
        order: 5,
        title: "Exercer a cidadania no dia a dia",
        objective: "Identificar formas práticas de exercer a cidadania.",
        sources: [S.dev],
        teaching: [
          screen(
            "Cidadania na prática",
            "Exercer a cidadania é votar com consciência, acompanhar o poder público, respeitar as leis e o próximo, participar e cobrar serviços.",
            "Pequenas atitudes diárias somam para uma sociedade melhor.",
          ),
        ],
        specs: [
          ["mc", "Exercício prático", "É uma forma de exercer a cidadania:", ["Acompanhar o poder público e cobrar serviços", "Ignorar tudo", "Desrespeitar leis", "Espalhar boatos"], 0, "Acompanhar e cobrar é cidadania na prática.", ["cf-deveres"]],
          ["tf", "Voto consciente", "Votar com consciência é uma forma importante de exercer a cidadania.", true, "Verdadeiro. O voto informado fortalece a democracia.", ["cf-direitos-politicos"]],
          ["mc", "Canais de cobrança", "Para cobrar um serviço público, o cidadão pode usar:", ["Ouvidorias e canais oficiais", "Apenas desabafos sem destino", "Ameaças", "Boatos"], 0, "Canais oficiais encaminham a cobrança corretamente.", ["cf-deveres"]],
          ["tf", "Respeito às diferenças", "Conviver com quem pensa diferente é parte de uma cidadania madura.", true, "Verdadeiro. O respeito ao pluralismo é essencial.", ["cf-deveres"]],
          ["mc", "Colaboração", "Colaborar com a comunidade (ex.: cuidar de espaços comuns) é:", ["Um exercício de cidadania", "Perda de tempo", "Dever de ninguém", "Proibido"], 0, "A colaboração comunitária é cidadania ativa.", ["cf-deveres"]],
          ["mc", "Informação", "Para exercer bem a cidadania, é importante:", ["Buscar informação confiável", "Acreditar em qualquer boato", "Ignorar os fatos", "Não se informar"], 0, "Informação de qualidade embasa a boa cidadania.", ["cf-deveres"]],
          ["tf", "Pequenas atitudes", "Pequenas atitudes diárias também constroem uma sociedade melhor.", true, "Verdadeiro. A cidadania se faz no cotidiano.", ["cf-deveres"]],
          ["mc", "Cidadania e democracia", "O exercício da cidadania:", ["Fortalece a democracia", "Enfraquece as instituições", "Não tem efeito", "Prejudica a todos"], 0, "Cidadãos ativos tornam a democracia mais forte.", ["cf-deveres"]],
        ],
      }),
    ],
  }),
);

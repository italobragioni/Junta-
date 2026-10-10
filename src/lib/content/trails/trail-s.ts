import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria S — Mídia e desinformação. Publicada, Premium. */
const S = {
  exp: cf("liberdade-expressao", "Art. 5º, IV, IX e XIV (liberdade de expressão, de pensamento e acesso à informação)."),
  imp: cf("comunicacao-social", "Art. 220 (liberdade de imprensa e comunicação social; vedação à censura)."),
};

export const trailS = publishTrail(
  buildTrail({
    id: "trilha-s",
    slug: "midia-e-desinformacao",
    order: 19,
    title: "Mídia e desinformação",
    description:
      "Liberdade de expressão e de imprensa, o papel do jornalismo e como identificar e combater a desinformação.",
    lessons: [
      buildLesson({
        id: "s1",
        slug: "liberdade-de-expressao",
        order: 1,
        title: "Liberdade de expressão e seus limites",
        objective: "Entender a liberdade de expressão e por que ela não é absoluta.",
        sources: [S.exp],
        teaching: [
          screen(
            "Falar é um direito",
            "A Constituição garante a liberdade de manifestação do pensamento e de expressão (Art. 5º, IV e IX).",
            "Mas ela não é absoluta: não protege calúnia, ameaça, incitação à violência nem discurso de ódio. A própria Constituição veda o anonimato e assegura resposta e indenização.",
          ),
        ],
        specs: [
          ["mc", "Liberdade de expressão", "A liberdade de expressão é:", ["Um direito fundamental, com limites previstos em lei", "Um direito absoluto, sem limite algum", "Proibida no Brasil", "Um privilégio de autoridades"], 0, "É direito fundamental, mas tem limites (não protege crimes).", ["cf-liberdade-expressao"]],
          ["tf", "Anonimato", "A Constituição veda o anonimato na manifestação do pensamento.", true, "Verdadeiro. O Art. 5º, IV veda o anonimato.", ["cf-liberdade-expressao"]],
          ["mc", "Limite", "NÃO é protegido pela liberdade de expressão:", ["Ameaça, calúnia e incitação à violência", "Criticar o governo", "Opinar sobre política", "Fazer humor"], 0, "Crimes como ameaça e calúnia não são amparados.", ["cf-liberdade-expressao"]],
          ["tf", "Direito de resposta", "Quem é ofendido tem direito de resposta, além de indenização.", true, "Verdadeiro. O Art. 5º, V assegura a resposta proporcional ao agravo.", ["cf-liberdade-expressao"]],
          ["mc", "Opinião x fato", "Criticar uma autoridade pública:", ["É exercício legítimo da liberdade de expressão", "É sempre crime", "É proibido", "Depende de autorização"], 0, "A crítica a agentes públicos é protegida.", ["cf-liberdade-expressao"]],
          ["tf", "Censura prévia", "A Constituição admite a censura prévia de ideias pelo governo.", false, "Falso. A Constituição veda a censura (Art. 5º, IX e Art. 220).", ["cf-comunicacao-social"]],
          ["mc", "Responsabilidade", "Quem abusa da liberdade de expressão:", ["Pode responder civil e penalmente", "Nunca responde por nada", "É sempre preso", "Perde a cidadania"], 0, "O abuso gera responsabilização nos termos da lei.", ["cf-liberdade-expressao"]],
          ["mc", "Acesso à informação", "O Art. 5º, XIV garante:", ["O acesso à informação, resguardado o sigilo da fonte", "A proibição de jornais", "O controle estatal das notícias", "O fim das redes sociais"], 0, "Assegura o acesso à informação e protege a fonte jornalística.", ["cf-liberdade-expressao"]],
        ],
      }),
      buildLesson({
        id: "s2",
        slug: "liberdade-de-imprensa",
        order: 2,
        title: "Liberdade de imprensa e o jornalismo",
        objective: "Compreender o papel da imprensa livre na democracia.",
        sources: [S.imp],
        teaching: [
          screen(
            "Imprensa livre",
            "O Art. 220 garante a liberdade de informação jornalística e proíbe a censura.",
            "Uma imprensa livre fiscaliza o poder, informa a sociedade e é essencial à democracia. Em troca, o jornalismo tem o dever de apurar e corrigir erros.",
          ),
        ],
        specs: [
          ["mc", "Papel da imprensa", "Na democracia, a imprensa livre serve para:", ["Informar a sociedade e fiscalizar o poder", "Obedecer ao governo", "Esconder informações", "Fazer leis"], 0, "Informar e fiscalizar são funções centrais da imprensa.", ["cf-comunicacao-social"]],
          ["tf", "Censura", "O Art. 220 proíbe a censura de natureza política, ideológica e artística.", true, "Verdadeiro. A censura é vedada.", ["cf-comunicacao-social"]],
          ["mc", "Dever do jornalismo", "O bom jornalismo tem o dever de:", ["Apurar os fatos e corrigir erros", "Publicar sem checar", "Inventar manchetes", "Esconder as fontes do público sempre"], 0, "Apuração e correção são deveres éticos.", ["cf-comunicacao-social"]],
          ["tf", "Fiscalizar o poder", "A imprensa ajuda a fiscalizar governantes e instituições.", true, "Verdadeiro. É um papel de controle social.", ["cf-comunicacao-social"]],
          ["mc", "Pluralidade", "Uma mídia saudável é:", ["Plural, com diferentes veículos e visões", "Controlada por um só dono", "Igual em tudo", "Sem concorrência"], 0, "A pluralidade de vozes fortalece o debate.", ["cf-comunicacao-social"]],
          ["tf", "Correção", "Um veículo sério corrige quando erra.", true, "Verdadeiro. A correção é sinal de credibilidade.", ["cf-comunicacao-social"]],
          ["mc", "Sigilo da fonte", "Proteger a identidade de uma fonte jornalística:", ["É garantido para proteger quem denuncia", "É proibido", "Serve para enganar", "Não existe"], 0, "O sigilo da fonte é assegurado pela Constituição.", ["cf-liberdade-expressao"]],
          ["mc", "Imprensa e democracia", "Perseguir jornalistas por reportagens:", ["Enfraquece a democracia", "Fortalece a liberdade", "É recomendável", "Não tem efeito"], 0, "Atacar a imprensa livre corrói a democracia.", ["cf-comunicacao-social"]],
        ],
      }),
      buildLesson({
        id: "s3",
        slug: "o-que-e-desinformacao",
        order: 3,
        title: "O que é desinformação (fake news)",
        objective: "Diferenciar erro, boato e desinformação deliberada.",
        sources: [S.exp],
        teaching: [
          screen(
            "Nem toda notícia falsa é igual",
            "Desinformação é informação falsa ou distorcida espalhada, muitas vezes de propósito, para enganar.",
            "Ela se aproveita de emoções fortes (medo, raiva) e de números ou imagens fora de contexto. Reconhecer isso é o primeiro passo para não cair.",
          ),
        ],
        specs: [
          ["mc", "Desinformação", "Desinformação é:", ["Informação falsa ou distorcida espalhada para enganar", "Qualquer notícia de jornal", "Uma opinião diferente da sua", "Uma crítica ao governo"], 0, "É conteúdo falso/distorcido com potencial de enganar.", ["cf-liberdade-expressao"]],
          ["tf", "Fora de contexto", "Um dado verdadeiro pode virar desinformação quando é apresentado fora de contexto.", true, "Verdadeiro. A descontextualização engana mesmo com dado real.", ["cf-liberdade-expressao"]],
          ["mc", "Gatilho emocional", "A desinformação costuma explorar:", ["Emoções fortes como medo e raiva", "Apenas a lógica", "Tabelas técnicas", "O tédio"], 0, "Conteúdo emocional viaja mais rápido e menos checado.", ["cf-liberdade-expressao"]],
          ["tf", "Intenção", "Nem todo erro é desinformação: às vezes é engano de boa-fé.", true, "Verdadeiro. Há erros honestos e há desinformação deliberada.", ["cf-liberdade-expressao"]],
          ["mc", "Boato", "Uma corrente de WhatsApp pedindo 'compartilhe urgente':", ["É um sinal clássico de boato", "É garantia de verdade", "Vem sempre de fontes oficiais", "Deve ser repassada sem checar"], 0, "O apelo à urgência é típico de boatos.", ["cf-liberdade-expressao"]],
          ["mc", "Objetivo", "A desinformação pode servir para:", ["Manipular opiniões e enganar pessoas", "Informar melhor", "Educar", "Checar fatos"], 0, "O objetivo costuma ser manipular.", ["cf-liberdade-expressao"]],
          ["tf", "Imagens", "Uma foto real pode ser usada para enganar se vier com legenda falsa.", true, "Verdadeiro. A descontextualização de imagens é comum.", ["cf-liberdade-expressao"]],
          ["mc", "Primeiro passo", "Reconhecer a desinformação ajuda a:", ["Não repassar e não cair em golpes", "Espalhar mais rápido", "Confiar em tudo", "Ignorar as fontes"], 0, "Reconhecer é o primeiro passo para não propagar.", ["cf-liberdade-expressao"]],
        ],
      }),
      buildLesson({
        id: "s4",
        slug: "identificar-desinformacao",
        order: 4,
        title: "Como identificar desinformação",
        objective: "Aplicar sinais práticos para desconfiar de um conteúdo.",
        sources: [S.exp],
        teaching: [
          screen(
            "Sinais de alerta",
            "Desconfie de: fonte não identificada, erro de português grosseiro, data ausente, pedido de compartilhamento urgente, promessa milagrosa e ausência de link para a matéria original.",
            "Procure a mesma informação em veículos confiáveis. Se só aparece em um lugar suspeito, acenda o alerta.",
          ),
        ],
        specs: [
          ["mc", "Sinal de alerta", "É um sinal de alerta de desinformação:", ["Não ter fonte nem link para a notícia original", "Ter data, autor e fonte", "Citar órgãos oficiais", "Ter correção de erros"], 0, "A falta de fonte/origem é um forte sinal.", ["cf-liberdade-expressao"]],
          ["tf", "Conferir em outros veículos", "Procurar a mesma informação em veículos confiáveis ajuda a confirmar.", true, "Verdadeiro. A checagem cruzada é essencial.", ["cf-liberdade-expressao"]],
          ["mc", "Título x conteúdo", "Um título sensacionalista que não combina com o texto:", ["É sinal de alerta", "Garante veracidade", "É recomendável", "Não importa"], 0, "O 'caça-clique' é sinal de baixa confiabilidade.", ["cf-liberdade-expressao"]],
          ["tf", "Fonte única suspeita", "Se a notícia só aparece em um site desconhecido, vale desconfiar.", true, "Verdadeiro. Informação relevante costuma ter várias fontes.", ["cf-liberdade-expressao"]],
          ["mc", "Verificar a data", "Checar a data de uma publicação evita:", ["Cair em notícia antiga recirculada como nova", "Ler a notícia", "Entender o tema", "Achar a fonte"], 0, "Conteúdo antigo recirculado engana muita gente.", ["cf-liberdade-expressao"]],
          ["mc", "Autoria", "Uma notícia confiável normalmente tem:", ["Autor e veículo identificáveis", "Nenhuma assinatura", "Só emojis", "Apenas um áudio anônimo"], 0, "Autoria e veículo aumentam a confiabilidade.", ["cf-liberdade-expressao"]],
          ["tf", "Promessa milagrosa", "Promessas milagrosas (cura garantida, dinheiro fácil) são sinais de golpe.", true, "Verdadeiro. Exageros desse tipo indicam fraude.", ["cf-liberdade-expressao"]],
          ["mc", "Agências de checagem", "Para confirmar, pode-se recorrer a:", ["Agências de checagem (Lupa, Aos Fatos, Comprova)", "Correntes de mensagem", "Perfis anônimos", "Boatos"], 0, "Agências de checagem são fontes de verificação.", ["cf-liberdade-expressao"]],
        ],
      }),
      buildLesson({
        id: "s5",
        slug: "consumo-responsavel-de-informacao",
        order: 5,
        title: "Consumo responsável de informação",
        objective: "Adotar hábitos para se informar bem e não espalhar boatos.",
        sources: [S.exp],
        teaching: [
          screen(
            "Pensar antes de compartilhar",
            "Antes de repassar, pergunte: a fonte é confiável? A data confere? Outros veículos confirmam? É fato ou opinião?",
            "Informar-se bem e não repassar o que não checou é um ato de cidadania.",
          ),
        ],
        specs: [
          ["mc", "Antes de compartilhar", "O hábito mais importante é:", ["Checar antes de repassar", "Compartilhar na hora", "Confiar em tudo", "Ignorar a fonte"], 0, "Checar antes evita espalhar boatos.", ["cf-liberdade-expressao"]],
          ["tf", "Fato x opinião", "Saber separar fato de opinião melhora o consumo de notícias.", true, "Verdadeiro. São coisas diferentes.", ["cf-liberdade-expressao"]],
          ["mc", "Diversificar fontes", "Acompanhar vários veículos ajuda a:", ["Ter uma visão mais completa", "Ficar mais confuso de propósito", "Acreditar em boatos", "Evitar a verdade"], 0, "Fontes variadas reduzem vieses.", ["cf-comunicacao-social"]],
          ["tf", "Bolha", "Seguir só quem pensa igual pode criar uma 'bolha' de informação.", true, "Verdadeiro. As bolhas reforçam vieses.", ["cf-liberdade-expressao"]],
          ["mc", "Repassar boato", "Repassar um boato, mesmo sem querer:", ["Ajuda a desinformação a se espalhar", "Não tem efeito", "Combate a mentira", "É sempre inofensivo"], 0, "Cada repasse amplia o alcance do boato.", ["cf-liberdade-expressao"]],
          ["mc", "Cidadania", "Informar-se bem é:", ["Um ato de cidadania", "Perda de tempo", "Coisa de especialista só", "Irrelevante"], 0, "Cidadãos informados fortalecem a democracia.", ["cf-liberdade-expressao"]],
          ["tf", "Corrigir-se", "Se você compartilhou algo falso, avisar quem recebeu é o certo.", true, "Verdadeiro. Corrigir ajuda a conter o boato.", ["cf-liberdade-expressao"]],
          ["mc", "Educação midiática", "Aprender a avaliar informação chama-se:", ["Educação midiática", "Censura", "Propaganda", "Desinformação"], 0, "É a chamada educação midiática ou alfabetização informacional.", ["cf-liberdade-expressao"]],
        ],
      }),
    ],
  }),
);

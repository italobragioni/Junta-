import { buildLesson, buildTrail, publishTrail, screen } from "../builders";
import { cf } from "../sources";

/** Categoria V — O Brasil e o mundo. Publicada, Premium. */
const S = {
  pri: cf("relacoes-internacionais", "Art. 4º (princípios que regem as relações internacionais do Brasil)."),
  tra: cf("tratados", "Art. 84, VIII e Art. 49, I (celebração de tratados pelo Presidente e referendo do Congresso)."),
};

export const trailV = publishTrail(
  buildTrail({
    id: "trilha-v",
    slug: "o-brasil-e-o-mundo",
    order: 22,
    title: "O Brasil e o mundo",
    description:
      "Os princípios das relações internacionais, como funcionam tratados e diplomacia e por que o mundo afeta o seu dia a dia.",
    lessons: [
      buildLesson({
        id: "v1",
        slug: "principios-das-relacoes-internacionais",
        order: 1,
        title: "Como o Brasil se relaciona com o mundo",
        objective: "Conhecer os princípios constitucionais das relações internacionais.",
        sources: [S.pri],
        teaching: [
          screen(
            "Princípios do Art. 4º",
            "A Constituição (Art. 4º) lista princípios como independência nacional, autodeterminação dos povos, não intervenção, igualdade entre os Estados, defesa da paz, solução pacífica de conflitos e repúdio ao terrorismo e ao racismo.",
            "Esses princípios orientam como o Brasil age no cenário internacional.",
          ),
        ],
        specs: [
          ["mc", "Base", "Os princípios das relações internacionais do Brasil estão:", ["No Art. 4º da Constituição", "Em nenhum lugar", "Só em tratados", "Num decreto"], 0, "O Art. 4º os enumera.", ["cf-relacoes-internacionais"]],
          ["tf", "Defesa da paz", "A defesa da paz é um dos princípios das relações internacionais do Brasil.", true, "Verdadeiro. Consta no Art. 4º.", ["cf-relacoes-internacionais"]],
          ["mc", "Solução de conflitos", "Entre os princípios está a solução de conflitos:", ["De forma pacífica", "Sempre pela guerra", "Ignorando o outro lado", "Com sanções apenas"], 0, "A solução pacífica é um princípio.", ["cf-relacoes-internacionais"]],
          ["tf", "Autodeterminação", "O Brasil defende a autodeterminação dos povos.", true, "Verdadeiro. É princípio do Art. 4º.", ["cf-relacoes-internacionais"]],
          ["mc", "Repúdio", "A Constituição determina o repúdio:", ["Ao terrorismo e ao racismo", "À cooperação", "À paz", "ao comércio"], 0, "O Art. 4º repudia terrorismo e racismo.", ["cf-relacoes-internacionais"]],
          ["mc", "Não intervenção", "O princípio da não intervenção significa:", ["Não interferir nos assuntos internos de outros países", "Invadir quando quiser", "Mandar em todos", "Fechar as fronteiras"], 0, "É o respeito à soberania alheia.", ["cf-relacoes-internacionais"]],
          ["tf", "Igualdade entre Estados", "Para a Constituição, os Estados são iguais em direitos nas relações internacionais.", true, "Verdadeiro. A igualdade entre os Estados é princípio.", ["cf-relacoes-internacionais"]],
          ["mc", "Integração", "A Constituição também incentiva a integração:", ["Entre os povos da América Latina", "Com nenhum país", "Apenas militar", "Só com potências"], 0, "O parágrafo único do Art. 4º cita a integração latino-americana.", ["cf-relacoes-internacionais"]],
        ],
      }),
      buildLesson({
        id: "v2",
        slug: "diplomacia-e-soberania",
        order: 2,
        title: "Diplomacia e soberania",
        objective: "Entender o que é soberania e o papel da diplomacia.",
        sources: [S.pri],
        teaching: [
          screen(
            "Conversar entre nações",
            "Soberania é o poder de um país se governar sem submissão a outro. Diplomacia é a arte de dialogar e negociar entre Estados.",
            "O Brasil mantém relações por meio do Itamaraty (Ministério das Relações Exteriores) e de embaixadas.",
          ),
        ],
        specs: [
          ["mc", "Soberania", "Soberania é:", ["O poder de um país se autogovernar", "Depender de outro país", "Um tipo de imposto", "Um tratado"], 0, "É a autonomia do Estado.", ["cf-relacoes-internacionais"]],
          ["mc", "Diplomacia", "Diplomacia é:", ["Dialogar e negociar entre países", "Declarar guerra sempre", "Fechar fronteiras", "Ignorar o mundo"], 0, "É a via do diálogo entre Estados.", ["cf-relacoes-internacionais"]],
          ["tf", "Itamaraty", "O Ministério das Relações Exteriores (Itamaraty) conduz a diplomacia brasileira.", true, "Verdadeiro. É o órgão da política externa.", ["cf-relacoes-internacionais"]],
          ["mc", "Embaixada", "Uma embaixada serve para:", ["Representar o país no exterior", "Cobrar impostos locais", "Fazer leis estrangeiras", "Julgar processos"], 0, "Representa o Estado em outro país.", ["cf-relacoes-internacionais"]],
          ["tf", "Negociação", "A diplomacia prefere a negociação à força sempre que possível.", true, "Verdadeiro. Alinha-se à solução pacífica.", ["cf-relacoes-internacionais"]],
          ["mc", "Chefe de Estado", "Nas relações internacionais, o Brasil é representado pelo:", ["Presidente da República", "Presidente da Câmara", "STF", "Governador"], 0, "O Presidente representa o país (Art. 84).", ["cf-tratados"]],
          ["tf", "Cooperação", "Países cooperam em temas como saúde, clima e comércio.", true, "Verdadeiro. A cooperação é comum e necessária.", ["cf-relacoes-internacionais"]],
          ["mc", "Soberania e cooperação", "Cooperar com outros países:", ["Não significa perder a soberania", "Acaba com a soberania", "É proibido", "Obriga a obedecer a todos"], 0, "Cooperar é diferente de se submeter.", ["cf-relacoes-internacionais"]],
        ],
      }),
      buildLesson({
        id: "v3",
        slug: "tratados-internacionais",
        order: 3,
        title: "Como funcionam os tratados",
        objective: "Entender quem assina e quem aprova um tratado internacional.",
        sources: [S.tra],
        teaching: [
          screen(
            "Dois passos",
            "Um tratado é um acordo entre países. No Brasil, o Presidente celebra o tratado (Art. 84, VIII) e o Congresso Nacional o referenda/aprova (Art. 49, I).",
            "Ou seja, há um equilíbrio: o Executivo negocia, mas o Legislativo precisa aprovar para valer internamente.",
          ),
        ],
        specs: [
          ["mc", "Quem celebra", "Quem celebra (assina) tratados pelo Brasil é:", ["O Presidente da República", "O STF", "Cada governador", "A ONU"], 0, "O Presidente celebra (Art. 84, VIII).", ["cf-tratados"]],
          ["mc", "Quem aprova", "Para o tratado valer, ele é referendado pelo:", ["Congresso Nacional", "Presidente sozinho", "Judiciário", "Município"], 0, "O Congresso referenda (Art. 49, I).", ["cf-tratados"]],
          ["tf", "Equilíbrio", "Executivo negocia e Legislativo aprova — é um equilíbrio de poderes.", true, "Verdadeiro. Há checagem entre os Poderes.", ["cf-tratados"]],
          ["mc", "O que é tratado", "Um tratado internacional é:", ["Um acordo formal entre países", "Uma lei municipal", "Um decreto estadual", "Uma portaria"], 0, "É um acordo entre Estados soberanos.", ["cf-tratados"]],
          ["tf", "Temas", "Tratados podem tratar de comércio, direitos humanos, clima e outros temas.", true, "Verdadeiro. Abrangem muitas áreas.", ["cf-tratados"]],
          ["mc", "Direitos humanos", "Tratados de direitos humanos aprovados com rito especial podem ter força de:", ["Emenda constitucional", "Portaria", "Opinião", "Nada"], 0, "Podem equivaler a emendas (Art. 5º, §3º).", ["cf-tratados"]],
          ["tf", "Soberania", "O Brasil decide livremente de quais tratados quer participar.", true, "Verdadeiro. É expressão da soberania.", ["cf-relacoes-internacionais"]],
          ["mc", "Por que aprovar no Congresso", "Exigir aprovação do Congresso serve para:", ["Dar legitimidade e controle democrático", "Atrasar por atrasar", "Enfraquecer o país", "Burlar a Constituição"], 0, "O Legislativo representa o povo e controla o Executivo.", ["cf-tratados"]],
        ],
      }),
      buildLesson({
        id: "v4",
        slug: "organismos-internacionais",
        order: 4,
        title: "Organismos internacionais",
        objective: "Conhecer, em linhas gerais, ONU, blocos e cooperação.",
        sources: [S.pri],
        teaching: [
          screen(
            "O Brasil em grupos",
            "O Brasil participa de organismos como a ONU (paz e cooperação global) e de blocos regionais como o Mercosul (integração econômica na América do Sul).",
            "Esses espaços servem para negociar, cooperar e resolver conflitos sem guerra.",
          ),
        ],
        specs: [
          ["mc", "ONU", "A ONU (Organização das Nações Unidas) busca principalmente:", ["A paz e a cooperação entre países", "Governar o Brasil", "Cobrar impostos", "Fazer leis nacionais"], 0, "A ONU promove paz e cooperação.", ["cf-relacoes-internacionais"]],
          ["tf", "Soberania na ONU", "Participar da ONU não elimina a soberania dos países membros.", true, "Verdadeiro. Os países continuam soberanos.", ["cf-relacoes-internacionais"]],
          ["mc", "Mercosul", "O Mercosul é um exemplo de:", ["Bloco de integração regional", "Tribunal brasileiro", "Partido político", "Imposto federal"], 0, "É um bloco econômico sul-americano.", ["cf-relacoes-internacionais"]],
          ["tf", "Integração regional", "A Constituição incentiva a integração latino-americana.", true, "Verdadeiro. Art. 4º, parágrafo único.", ["cf-relacoes-internacionais"]],
          ["mc", "Cooperação global", "Temas como clima e pandemias:", ["Exigem cooperação entre países", "São resolvidos por um país só", "Não importam", "Não têm relação com o Brasil"], 0, "São desafios globais que pedem cooperação.", ["cf-relacoes-internacionais"]],
          ["mc", "Resolver sem guerra", "Organismos internacionais ajudam a:", ["Negociar e resolver conflitos sem guerra", "Começar guerras", "Isolar países", "Acabar com a diplomacia"], 0, "Favorecem a solução pacífica.", ["cf-relacoes-internacionais"]],
          ["tf", "Comércio", "Acordos internacionais também facilitam o comércio entre países.", true, "Verdadeiro. Reduzem barreiras e organizam regras.", ["cf-relacoes-internacionais"]],
          ["mc", "Papel do Brasil", "Em organismos internacionais, o Brasil:", ["Defende seus interesses e seus princípios constitucionais", "Obedece a tudo sem opinar", "Não participa", "Perde a soberania"], 0, "O país atua conforme o Art. 4º.", ["cf-relacoes-internacionais"]],
        ],
      }),
      buildLesson({
        id: "v5",
        slug: "o-mundo-afeta-voce",
        order: 5,
        title: "Por que o mundo afeta o seu dia a dia",
        objective: "Relacionar temas internacionais com a vida cotidiana.",
        sources: [S.pri],
        teaching: [
          screen(
            "Lá fora mexe aqui dentro",
            "O preço do combustível, do dólar e de alimentos, o clima, as vacinas e os empregos dependem também do que acontece no mundo.",
            "Entender relações internacionais ajuda a fazer sentido de notícias e a cobrar boas decisões.",
          ),
        ],
        specs: [
          ["mc", "Dólar", "A alta do dólar pode:", ["Encarecer produtos importados e combustíveis", "Baratear tudo sempre", "Não ter efeito", "Mudar a Constituição"], 0, "O câmbio afeta preços no dia a dia.", ["cf-relacoes-internacionais"]],
          ["tf", "Clima global", "Acordos internacionais sobre clima afetam o Brasil.", true, "Verdadeiro. O clima é um tema global.", ["cf-relacoes-internacionais"]],
          ["mc", "Comércio exterior", "Exportar e importar:", ["Gera empregos e afeta preços no país", "Não tem relação com a economia", "É proibido", "Só interessa a outros países"], 0, "O comércio exterior impacta a economia interna.", ["cf-relacoes-internacionais"]],
          ["tf", "Saúde global", "Pandemias mostraram que a saúde de um país depende também do mundo.", true, "Verdadeiro. Doenças não respeitam fronteiras.", ["cf-relacoes-internacionais"]],
          ["mc", "Notícias", "Entender o mundo ajuda a:", ["Interpretar melhor as notícias", "Ignorar os fatos", "Acreditar em boatos", "Fugir da realidade"], 0, "Contexto internacional dá sentido às notícias.", ["cf-relacoes-internacionais"]],
          ["mc", "Cobrança", "Saber como o país age lá fora permite:", ["Cobrar decisões melhores dos governantes", "Nada", "Menos participação", "Desinteresse"], 0, "Cidadãos informados cobram melhor.", ["cf-relacoes-internacionais"]],
          ["tf", "Interdependência", "Hoje os países são bastante interdependentes.", true, "Verdadeiro. A globalização conecta economias e sociedades.", ["cf-relacoes-internacionais"]],
          ["mc", "Conclusão", "Relações internacionais são um tema:", ["Que afeta diretamente a vida das pessoas", "Só de diplomatas", "Sem importância", "Distante da realidade"], 0, "O internacional afeta o cotidiano de todos.", ["cf-relacoes-internacionais"]],
        ],
      }),
    ],
  }),
);

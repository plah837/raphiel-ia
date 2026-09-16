export default {
  async fetch(request, env) {

    // Permite que o site converse com o servidor
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // Teste simples
    if (request.method !== "POST") {
      return resposta("Raphiel IA online.");
    }

    try {
      const body = await request.json();
      const pergunta = body.message;

      if (!pergunta) {
        return resposta("Você precisa escrever uma pergunta.");
      }

      const api = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + env.OPENAI_API_KEY
          },
          body: JSON.stringify({
            model: "gpt-5.6-luna",
            instructions:
              "Você é Raphiel, uma assistente virtual futurista. Responda em português do Brasil. Seja útil, clara e natural. Você pode conversar sobre assuntos gerais, matemática, programação, jogos, Minecraft, animes, ciência, história e outros assuntos permitidos.",
            input: pergunta
          })
        }
      );

      const data = await api.json();

      if (!api.ok) {
        console.log(data);
        return resposta(
          "Ocorreu um erro ao consultar a inteligência artificial."
        );
      }

      return resposta(
        data.output_text || "Não consegui gerar uma resposta."
      );

    } catch (erro) {
      console.log(erro);

      return resposta(
        "Não consegui me conectar à inteligência artificial."
      );
    }
  }
};

function resposta(texto) {
  return new Response(
    JSON.stringify({
      reply: texto
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
}

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return json({ reply: "Raphiel IA online." }, corsHeaders);
    }

    try {
      const body = await request.json();
      const pergunta = body.message;

      if (!pergunta) {
        return json(
          { reply: "Você precisa escrever uma pergunta." },
          corsHeaders
        );
      }

      const respostaIA = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-5.6-luna",
            instructions:
              "Você é Raphiel, uma assistente virtual futurista. Responda em português do Brasil. Seja útil, clara, natural e objetiva.",
            input: pergunta
          })
        }
      );

      const data = await respostaIA.json();

      if (!respostaIA.ok) {
        console.log("Erro da OpenAI:", data);

        return json(
          { reply: "A inteligência artificial retornou um erro." },
          corsHeaders
        );
      }

      return json(
        {
          reply: data.output_text || "Não consegui gerar uma resposta."
        },
        corsHeaders
      );

    } catch (erro) {
      console.log("Erro:", erro);

      return json(
        { reply: "Não consegui me conectar à inteligência artificial." },
        corsHeaders
      );
    }
  }
};

function json(data, corsHeaders) {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

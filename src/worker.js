const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=UTF-8"
};

function respostaJSON(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: corsHeaders
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return respostaJSON({
        online: true,
        nome: "Raphael Tensura",
        mensagem: "API funcionando"
      });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        if (!env.OPENAI_API_KEY) {
          return respostaJSON(
            { erro: "A chave OPENAI_API_KEY não foi configurada no Cloudflare." },
            500
          );
        }

        const corpo = await request.json();
        const mensagem = String(corpo.message || "").trim();

        if (!mensagem) {
          return respostaJSON(
            { erro: "A mensagem está vazia." },
            400
          );
        }

        const respostaOpenAI = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content:
                    "Você é Raphael Tensura. Responda sempre em português do Brasil, de forma clara, educada, útil e direta."
                },
                {
                  role: "user",
                  content: mensagem
                }
              ],
              temperature: 0.7,
              max_tokens: 700
            })
          }
        );

        const resultado = await respostaOpenAI.json();

        if (!respostaOpenAI.ok) {
          return respostaJSON(
            {
              erro:
                resultado?.error?.message ||
                "A OpenAI recusou a solicitação."
            },
            respostaOpenAI.status
          );
        }

        const resposta =
          resultado?.choices?.[0]?.message?.content ||
          "Não consegui gerar uma resposta.";

        return respostaJSON({
          ok: true,
          reply: resposta
        });
      } catch (erro) {
        return respostaJSON(
          {
            erro: "Erro interno ao conversar com a IA."
          },
          500
        );
      }
    }

    return respostaJSON(
      {
        erro: "Rota não encontrada."
      },
      404
    );
  }
};

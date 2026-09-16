export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Abre o site
    if (
      request.method === "GET" &&
      !url.pathname.startsWith("/api")
    ) {
      return env.ASSETS.fetch(request);
    }

    // API do Raphael Tensei
    if (url.pathname === "/api" && request.method === "POST") {
      try {
        const data = await request.json();

        const pergunta = data.message || "";

        return new Response(
          JSON.stringify({
            reply: `Raphael Tensei recebeu: ${pergunta}`
          }),
          {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      } catch {
        return new Response(
          JSON.stringify({
            reply: "Envie uma mensagem válida."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
    }

    return new Response("Not Found", {
      status: 404
    });
  }
};

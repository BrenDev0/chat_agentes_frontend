export function openWebSocket(): Promise<WebSocket> {
  return new Promise(async (resolve, reject) => {
    try {
      const connectionId = localStorage.getItem("connectionId");
      const urlWs = process.env.NEXT_PUBLIC_WS_SERVER;
      if (!urlWs) throw new Error("WS server no definido");

      const res = await fetch("/api/generateCredentials");
      if (!res.ok) throw new Error("Error generando credenciales");

      const data = await res.json();

      const ws = new WebSocket(
        `${urlWs}/${connectionId}?x-signature=${data.signature}&x-payload=${data.payload}`,
      );

      //   const body = {
      //     description: data.connectionId,
      //   };

      ws.onopen = () => resolve(ws);

      //   if (ws.readyState === WebSocket.OPEN) {
      //     setTimeout(() => {
      //       ws.send(JSON.stringify(body));
      //     }, 500);
      //   } else if (ws.readyState === WebSocket.CONNECTING) {
      //     const openHandler = () => {
      //       setTimeout(() => {
      //         ws.send(JSON.stringify(body));
      //       }, 500);
      //     };
      //     ws.addEventListener("open", openHandler, { once: true });
      //   }

      ws.onerror = () => {
        reject(new Error("Error en la conexión WebSocket"));
      };
    } catch (err) {
      reject(err);
    }
  });
}

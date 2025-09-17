// Polyfill cho Vite/ESM
if (typeof window !== "undefined") {
  if (!window.global) window.global = window;
  if (!window.process) window.process = { env: {} };
}

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export function connectPostFeed({ url, onUpsert, onDeleted, onConnected, onError }) {
  const stompClient = new Client({
    webSocketFactory: () => new SockJS(url, null, { withCredentials: false }), // ⚡ quan trọng
    reconnectDelay: 2000,
    debug: () => { },
    onConnect: () => {
      onConnected?.();
      stompClient.subscribe("/topic/posts", (message) => {
        // Log thô message để debug
        try {
          console.log("[WS][RAW]", message?.body);
        } catch { }
        if (!message?.body) return;
        try {
          const event = JSON.parse(message.body);
          console.log("[WS][PARSED]", event);
          if (event?.type === "upsert") onUpsert?.(event.post || event.payload);
          if (event?.type === "deleted") onDeleted?.(event.id || event.post?.id || event.payload?.id);
        } catch (err) {
          console.error("Parse WS event error", err);
        }
      });
    },
    onStompError: (f) => onError?.(f),
    onWebSocketError: (err) => onError?.(err),
  });

  stompClient.activate();
  return () => stompClient.deactivate();
}

import { useEffect } from "react";
import { connectPostFeed } from "../services/ws/postFeedClient";

export function usePostFeed({ mode, onRefetch, setPosts }) {
  useEffect(() => {
    const url = "http://localhost:8085/search/ws";
    const off = connectPostFeed({
      url,
      onConnected: () => console.log("WS connected"),
      onUpsert: (doc) => {
        if (mode === "client") {
          setPosts((prev) => {
            const without = prev.filter(p => p.id !== doc.id);
            return [doc, ...without];
          });
        } else {
          onRefetch?.();
        }
      },
      onDeleted: (id) => {
        if (mode === "client") {
          setPosts((prev) => prev.filter(p => p.id !== id));
        } else {
          onRefetch?.();
        }
      },
      onError: (e) => console.warn("WS error", e),
    });
    return () => off();
  }, [mode, onRefetch, setPosts]);
}

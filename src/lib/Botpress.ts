"use client";
import { useEffect } from "react";

export function Botpress(props: { children?: React.ReactNode }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      (window as any)?.botpressWebChat?.init({
        botId: "2026a1b5-79e2-4b8f-91ac-8191598b53dd",
        hostUrl: "https://cdn.botpress.cloud/webchat/v1",
        messagingUrl: "https://messaging.botpress.cloud",
        clientId: "2026a1b5-79e2-4b8f-91ac-8191598b53dd",
      });
    };
  }, []);
  return props.children;
}

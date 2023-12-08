"use client";
import { useEffect } from "react";
import { useMessages } from "./globalState";

export function Botpress(props: { children?: React.ReactNode }) {
  const { addMessages } = useMessages();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window?.botpressWebChat?.init({
        botId: "2026a1b5-79e2-4b8f-91ac-8191598b53dd",
        hostUrl: "https://cdn.botpress.cloud/webchat/v1",
        messagingUrl: "https://messaging.botpress.cloud",
        clientId: "2026a1b5-79e2-4b8f-91ac-8191598b53dd",
      });
      window.botpressWebChat?.onEvent(
        (event: any) => {
          if (event.type === "MESSAGE.RECEIVED") {
            console.log("event recieved");
            addMessages({
              role: "assistant",
              message: event.value.payload.text,
            });
          }
        },
        ["MESSAGE.RECEIVED"]
      );
    };
  }, []);
  return props.children;
}

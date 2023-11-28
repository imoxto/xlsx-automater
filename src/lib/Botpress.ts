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
      (window as any)?.botpressWebChat?.init({
        botId: "5c9bdf9f-269c-4ff3-955e-3ba68f97b4bd",
        hostUrl: "https://cdn.botpress.cloud/webchat/v1",
        messagingUrl: "https://messaging.botpress.cloud",
        clientId: "5c9bdf9f-269c-4ff3-955e-3ba68f97b4bd",
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

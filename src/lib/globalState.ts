import { create } from "zustand";

type Message = { role: "user" | "assistant"; message: string };

interface MessageState {
  messages: Array<Message>;
  addMessages: (msg: Message) => void;
  resetMessages: () => void;
  getLastMessage: () => Message;
}

export const useMessages = create<MessageState>()((set, get) => ({
  messages: [],
  addMessages: (msg) => {
    set((state) => {
      const lastMessage = get().messages[0];
      if (
        lastMessage?.message === msg.message &&
        lastMessage?.role === msg.role
      ) {
        return state;
      }
      return { messages: [msg, ...state.messages] };
    });
  },
  resetMessages: () => set({ messages: [] }),
  getLastMessage: () => {
    const lastMessage = get().messages[0];
    return lastMessage;
  },
}));

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessages } from "@/lib/globalState";
import { PaperPlaneIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";

async function sendMessages({
  data,
  questionIndex = 0,
  answerIndex = 1,
  startRow = 1,
  timeBetweenMessagesInMs = 5000,
}: {
  data: string[][];
  questionIndex?: number;
  answerIndex?: number;
  startRow?: number;
  timeBetweenMessagesInMs?: number;
}) {
  if (!data) {
    throw new Error("No data");
  }

  if (!window?.botpressWebChat) {
    throw new Error("No botpressWebChat");
  }

  window.botpressWebChat.sendEvent({ type: "show" });

  for (let i = startRow; i < data.length; i++) {
    const question = data[i][questionIndex];
    const answer = data[i][answerIndex];
    if (!question) {
      continue;
    }
    if (answer) {
      continue;
    }
    useMessages.getState().resetMessages();
    window.botpressWebChat.sendPayload({
      type: "text",
      text: question,
    });
    while (true) {
      await new Promise((resolve) =>
        setTimeout(resolve, timeBetweenMessagesInMs)
      );
      if (useMessages.getState().getLastMessage()?.message === "Bye") {
        break;
      }
    }
    const responseMessage = useMessages.getState().messages[1]?.message;

    data[i][answerIndex] = responseMessage ? responseMessage : "No response";

    await new Promise((resolve) =>
      setTimeout(resolve, timeBetweenMessagesInMs)
    );
  }

  useMessages.getState().resetMessages();

  return data;
}

export function Messager() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<string[][] | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: sendMessages,
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      alert(error?.message);
    },
  });
  const canSendMessages = !isPending && Boolean(data);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile(file);
  };

  const handleFileRead = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryStr = e.target?.result;
      if (typeof binaryStr === "string") {
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        setData(data);
        alert("File read successfully");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileDownload = async () => {
    if (!data) {
      console.log("No data");
      return;
    }
    const modifiedData = JSON.parse(JSON.stringify(data));

    const newWorksheet = XLSX.utils.aoa_to_sheet(modifiedData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Modified Sheet");

    XLSX.writeFile(newWorkbook, "modified_file.xlsx");
  };

  const handleSendMessage = () => {
    if (canSendMessages) {
      mutate({
        data: JSON.parse(JSON.stringify(data)),
        questionIndex: 0,
        answerIndex: 3,
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 justify-center">
      <Input type="file" onChange={handleFileChange} />
      <div className="flex flex-row items-center gap-2 justify-center">
        <Button variant="secondary" onClick={handleFileRead}>
          Read File
        </Button>
        <Button variant="ghost" onClick={() => console.log(data)}>
          Log File
        </Button>
      </div>
      <Button variant="outline" onClick={handleFileDownload}>
        Download New File
      </Button>
      <Button onClick={handleSendMessage} disabled={!canSendMessages}>
        {isPending ? (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PaperPlaneIcon className="mr-2 h-4 w-4" />
        )}
        Send Message
      </Button>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Messager />
    </main>
  );
}

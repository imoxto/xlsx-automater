"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";

export function Messager() {
  const [file, setFile] = useState<File | null>(null);

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
        const data: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(data);
      }
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div className="flex flex-col items-center gap-4 justify-center">
      <input type="file" onChange={handleFileChange} />
      <Button variant="destructive" onClick={handleFileRead}>
        Read File
      </Button>
      <Button
        onClick={() => {
          if (!window?.botpressWebChat) {
            return;
          }
          window.botpressWebChat.sendEvent({ type: "show" });
          window.botpressWebChat.sendPayload({
            type: "text",
            text: "What is goodwill?",
          });
          console.log("send message!");
        }}
      >
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

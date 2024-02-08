import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCard {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCard) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);

    if (e.target.value === "") {
      setShouldShowOnBoarding(true);
    }
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault();

    if (content === "") {
      return;
    }

    onNoteCreated(content);

    setContent("");
    setShouldShowOnBoarding(true);

    toast.success("Nota criada com sucesso!");
  }

  function handleStartRecording() {
    setIsRecording(true);
    setShouldShowOnBoarding(false)

    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

      if(!isSpeechRecognitionAPIAvailable){
        alert("Infelizmente seu navegador não suporta a API de navegação")
        return
      }


      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      speechRecognition = new SpeechRecognitionAPI()

      speechRecognition.lang = "pt-BR"
      speechRecognition.continuous = true
      speechRecognition.maxAlternatives = 1
      speechRecognition.interimResults = true

      speechRecognition.onresult = (e) => {
        const transcription = Array.from(e.results).reduce((text, result) => {
          return text.concat(result[0].transcript)
        }, '')

        setContent(transcription)
      }

      speechRecognition.onerror = (e) => {
        console.error(e)
      }

      speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className=" rounded-md outline-none flex flex-col bg-slate-700 text-left p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar Nota
        </span>
        <p className=" text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automáticamente!
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className=" inset-0 fixed bg-black/60" />
        <Dialog.Content className=" fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:max-w-[640px] w-full md:h-[68vh] bg-slate-700 md:rounded-meedium flex flex-col outline-none">
          <Dialog.Close className=" absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className=" flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300"></span>
              {shouldShowOnBoarding ? (
                <p className=" text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    onClick={handleStartRecording}
                    className=" font-md text-lime-400 hover:underline"
                    type="button"
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    onClick={handleStartEditor}
                    className=" font-md text-lime-400 hover:underline"
                    type="button"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className=" text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className=" w-full flex items-center justify-center gap-2 bg-slate-900 text-slate-300 py-4 text-center text-sm outline-none font-medium hover:text-slate-100"
              >
                Gravando! (clique p/ interromper)
                <div className=" size-3 rounded-full bg-red-500 animate-pulse" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className=" w-full bg-lime-400 text-lime-950 py-4 text-center text-sm outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

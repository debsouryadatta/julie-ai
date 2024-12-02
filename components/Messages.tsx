import { Message } from "@/app/julie/page";
import SubmitButton from "./SubmitButton";
import { ChevronDownCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {

  return (
    <div
      className={`flex flex-col min-h-screen p- pt-20 ${
        messages.length > 0 ? "pb-96" : "pb-32"
      }`}
    >
      <div className="flex flex-col flex-1 space-y-5 max-w-3xl mx-auto">
        <SubmitButton />

        {!messages.length && (
          <div className="flex flex-col space-y-10 flex-1 items-center justify-end">
            <p className="text-gray-500 animate-pulse">Start a conversation</p>
            <ChevronDownCircle
              size={64}
              className="animate-bounce text-gray-500"
            />
          </div>
        )}

        <div className="p-5 space-y-5">
          {messages.map((message) => (
            <div key={message.id} className="space-y-5">
              {/* reciever */}
              <div className="flex mt-14 mb-14">
                <Avatar>
                  <AvatarImage src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1727810716/projects/julie_gez2o2.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="message bg-gray-800 rounded-bl-none ml-2 -mt-2">
                  {message.response}
                </p>
              </div>

              {/* sender */}
              <div className="flex mt-8">
                <p className="message text-left ml-auto rounded-br-none mr-2 -mt-2">
                  {message.sender}
                </p>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Messages;
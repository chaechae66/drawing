"use client";
import { useEffect } from "react";
import { Button } from "../../@/components/ui/button";
import { MailWarning } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="w-dvw h-dvh flex items-center justify-center">
      <div className="flex flex-col text-center items-center">
        <MailWarning size={80} />
        <div className="flex items-end justify-center mb-2 mt-4">
          <h1 className="text-3xl mr-2">에러 발생</h1>
          <p>
            <i>
              {(error as Error)?.message ||
                (error as { statusText?: string })?.statusText}
            </i>
          </p>
        </div>
        <p className="mb-8">
          어떤 에러가 발생하여 페이지가 로드되지 않았습니다.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            reset();
          }}
        >
          이전으로
        </Button>
      </div>
    </main>
  );
}

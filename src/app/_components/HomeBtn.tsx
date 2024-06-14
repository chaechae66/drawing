"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../../@/components/ui/button";

function HomeBtn() {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        router.push("/");
      }}
    >
      홈으로
    </Button>
  );
}

export default HomeBtn;

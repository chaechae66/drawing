"use client";

import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RootState, store } from "../../store/store";
import { useSelector } from "react-redux";
import fetchWithInterceptors from "../../lib/fetchWithInterceptors";
import { Button } from "../../../@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../@/components/ui/dialog";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { AspectRatio } from "../../../@/components/ui/aspect-ratio";
import { useRouter } from "next/navigation";
import { TList } from "../../types/List";

function AddDrawing() {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [prevImg, setPrevImg] = useState<string | null>(null);
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["article"],
    mutationFn: (formData: FormData): Promise<Response> =>
      fetchWithInterceptors<TList>(
        "http://localhost:3000/api/article",
        {
          method: "POST",
          body: formData,
          next: { revalidate: 0 },
        },
        store
      ),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const onLoadFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files![0];
    if (!file) {
      return;
    }
    setImgFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPrevImg(reader.result as string);
    };
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!imgFile) {
      return;
    }
    if (isPending) {
      return;
    }
    const formData = new FormData();
    formData.append("drawingImage", imgFile!);
    formData.append("user", JSON.stringify(uuid));

    setIsOpen(false);
    mutate(formData);
    setPrevImg(null);
    setImgFile(null);
    router.push("/");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          그림 올리기
        </Button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>그림 업로드</DialogTitle>
            <DialogDescription>
              모든 사람들에게 자신의 그림을 자랑해보아요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  이미지 파일
                </Label>
                <Input
                  id="image"
                  type="file"
                  onChange={onLoadFile}
                  accept=".jpg,.jpeg,.png"
                  className="col-span-3"
                />
              </div>
            </div>
            {prevImg && (
              <AspectRatio ratio={1 / 1}>
                <img
                  src={prevImg}
                  alt="미리보기 이미지"
                  className="w-full sm:max-h-[375px] rounded-md object-cover"
                />
              </AspectRatio>
            )}
            <>
              {isPending && <p className="text-gray-600">전송 중...</p>}
              {isError && <div className="text-red-400">{error.message}</div>}
            </>
            <DialogFooter className="mt-2">
              <Button type="submit">업로드</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default AddDrawing;
export const dynamic = "force-dynamic";

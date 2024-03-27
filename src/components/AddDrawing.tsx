import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { LocalStorage } from "../lib/localStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddDrawing() {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [prevImg, setPrevImg] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["article"],
    mutationFn: (formData: FormData): Promise<AxiosResponse> =>
      axios.post("http://localhost:4000/article", formData),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const localStorage = new LocalStorage();

  useEffect(() => {
    if (localStorage.get("uuidUser")) {
      return;
    }

    localStorage.set("uuidUser", uuidv4());
  }, []);

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
    formData.append("user", JSON.stringify(localStorage.get("uuidUser")));

    mutate(formData);
  };

  if (isError) {
    return (
      <>
        에러가 발생하였습니다 <br /> {error.message}
      </>
    );
  }
  return (
    <div className="w-60">
      <h3 className="text-2xl">그림</h3>
      <form onSubmit={onSubmit}>
        <input type="file" accept=".jpg,.jpeg,.png" onChange={onLoadFile} />
        <div>
          <h4 className="text-xl">미리보기</h4>
          {prevImg ? <img src={prevImg} /> : <p>미리보기 이미지 없음</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-700 rounded px-4 py-2 text-white"
        >
          제출
        </button>
      </form>
      {isPending && <p>전송 중...</p>}
    </div>
  );
}

export default AddDrawing;

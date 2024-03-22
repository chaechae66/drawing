import { useRef } from "react";
import { LocalStorage } from "../lib/localStorage";
import { TList } from "../types/List";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

function ListItem({ elem }: { elem: TList }) {
  const localStroage = new LocalStorage();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["article", "put"],
    mutationFn: ({
      formData,
      id,
    }: {
      formData: FormData;
      id: string;
    }): Promise<AxiosResponse> =>
      axios.post(`http://localhost:4000/article/${id}`, formData),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const { mutate: delMutate } = useMutation({
    mutationKey: ["article", "delete"],
    mutationFn: (id: string): Promise<AxiosResponse> =>
      axios.delete(`http://localhost:4000/article/${id}`),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const onLoadFile = (e: React.ChangeEvent<HTMLInputElement>, _id: string) => {
    const file = e.target.files![0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("drawingImage", file!);
    mutate({ formData: formData, id: _id });
  };

  const handleUpdate = () => {
    const isUpdate = confirm("이미지를 정말로 수정하시겠어요?");
    if (!isUpdate) {
      return;
    }
    imageRef.current!.click();
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    _id: string
  ) => {
    e.preventDefault();
    const isDelete = confirm("이미지를 정말로 삭제하시겠어요?");
    if (!isDelete) {
      return;
    }
    delMutate(_id);
  };

  return (
    <div key={elem._id}>
      {elem.user === localStroage.get() && (
        <>
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              onLoadFile(e, elem._id);
            }}
          />
          <button
            onClick={handleUpdate}
            className="bg-red-400 mr-2 p-1 text-white"
          >
            수정
          </button>
          <button
            onClick={(e) => {
              handleDelete(e, elem._id);
            }}
            className="bg-slate-500 p-1 text-white"
          >
            삭제
          </button>
        </>
      )}
      <img
        src={`data:image/${elem.contentType};base64,${elem.data}`}
        alt="그림 이미지"
      />
    </div>
  );
}

export default ListItem;

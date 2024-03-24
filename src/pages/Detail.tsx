import { useNavigate, useParams } from "react-router-dom";
import BackBtn from "../components/BackBtn";
import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TComment, TList } from "../types/List";
import { LocalStorage } from "../lib/localStorage";
import { FormEventHandler, useRef, useState } from "react";
function Detail() {
  const { id } = useParams();
  const localStorage = new LocalStorage();
  const userId = localStorage.get();
  const queryClient = useQueryClient();
  const naviagte = useNavigate();

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [comment, setComment] = useState("");

  const { mutate } = useMutation({
    mutationKey: ["article", "put"],
    mutationFn: (formData: FormData): Promise<AxiosResponse> =>
      axios.post(`http://localhost:4000/article/${id}`, formData),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article", id] });
    },
  });

  const { mutate: delMutate } = useMutation({
    mutationKey: ["article", "delete"],
    mutationFn: (): Promise<AxiosResponse> =>
      axios.delete(`http://localhost:4000/article/${id}`),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const onLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("drawingImage", file!);
    mutate(formData);
  };

  const handleUpdate = () => {
    const isUpdate = confirm("이미지를 정말로 수정하시겠어요?");
    if (!isUpdate) {
      return;
    }
    imageRef.current!.click();
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isDelete = confirm("이미지를 정말로 삭제하시겠어요?");
    if (!isDelete) {
      return;
    }
    delMutate();
    alert("삭제가 완료되었습니다.");
    naviagte("/");
  };

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: async (): Promise<TList> => {
      return axios
        .get(`http://localhost:4000/article/${id}`)
        .then((data) => data.data.data);
    },
  });

  const { data: isLike, error: likeError } = useQuery({
    queryKey: ["article", "like", userId, id],
    queryFn: async (): Promise<TList> => {
      return axios
        .get(`http://localhost:4000/article/${id}/like/${userId}`)
        .then(({ data: { data } }) => {
          if (data) {
            return data.isLike;
          } else {
            return false;
          }
        });
    },
  });

  const { data: comments, error: commentError } = useQuery({
    queryKey: ["article", "comment", id],
    queryFn: async (): Promise<TComment[]> => {
      return axios
        .get(`http://localhost:4000/article/${id}/comment/${userId}`)
        .then(({ data: { data } }) => {
          if (data) {
            return data.sort(
              (a: TList, b: TList) =>
                Date.parse(b.regDate) - Date.parse(a.regDate)
            );
          } else {
            return null;
          }
        });
    },
  });

  const { mutate: likeMutate, error: likeMutateError } = useMutation({
    mutationKey: ["article", "like", userId, id],
    mutationFn: (): Promise<AxiosResponse> =>
      axios.post(`http://localhost:4000/article/${id}/like/${userId}`),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "like", userId, id],
      });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
    },
  });

  const { mutate: commentMutate, error: commentMutateError } = useMutation({
    mutationKey: ["article", "like", id],
    mutationFn: (): Promise<AxiosResponse> =>
      axios.post(`http://localhost:4000/article/${id}/comment/${userId}`, {
        comment,
      }),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "comment", id],
      });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
    },
  });

  if (isLoading) {
    return <>로딩 중...</>;
  }

  if (error) {
    return (
      <>
        에러가 발생하였습니다 <br /> {error.message}
      </>
    );
  }

  if (likeError || likeMutateError) {
    alert("좋아요가 정상적으로 작동되지 않았습니다");
  }

  if (commentMutateError || commentError) {
    alert("댓글 작성에 실패하였습니다.");
  }

  const onLikeClick = () => {
    if (!userId) {
      alert("좋아요가 정상적으로 작동되지 않았습니다");
    }
    likeMutate();
  };

  const onCommentSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    commentMutate();
  };

  return (
    <>
      <h2>디테일페이지</h2>
      {detail ? (
        <div>
          {detail.user === localStorage.get() && (
            <>
              <input
                type="file"
                className="hidden"
                ref={imageRef}
                accept=".jpg,.jpeg,.png"
                onChange={onLoadFile}
              />
              <button
                onClick={handleUpdate}
                className="bg-red-400 mr-2 p-1 text-white"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="bg-slate-500 p-1 text-white"
              >
                삭제
              </button>
            </>
          )}
          <img
            className="w-80"
            src={`data:image/${detail.contentType};base64,${detail.data}`}
            alt="그림 이미지"
          />
          <div className="text-xl">
            {detail.likeCount} :{" "}
            <span onClick={onLikeClick}>{isLike ? "♥" : "♡"}</span>
          </div>
        </div>
      ) : (
        <p>404 : 존재하지 않는 페이지입니다.</p>
      )}
      {detail && (
        <form onSubmit={onCommentSubmit}>
          <input
            className="border-gray-300 border-solid border-[1px]"
            type="text"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="댓글입력해주세요"
          />
          <button type="submit" className="bg-blue-500 px-1 text-white">
            댓글 등록
          </button>
        </form>
      )}
      {comments ? (
        <div>
          {comments.map((item) => (
            <div key={item._id}>
              <span>
                {new RegExp(
                  "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
                ).test(item.user) ? (
                  "게스트"
                ) : (
                  <>{item.user}</>
                )}
              </span>
              : <span>{item.body}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>작성된 댓글이 없습니다.</div>
      )}
      <BackBtn />
    </>
  );
}

export default Detail;

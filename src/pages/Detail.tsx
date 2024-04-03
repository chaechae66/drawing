import { useNavigate, useParams } from "react-router-dom";
import HomeBtn from "../components/HomeBtn";
import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TComment, TList } from "../types/List";
import { FormEventHandler, useRef, useState } from "react";
import CommentItem from "../components/CommentItem";
import { useSelector } from "react-redux";
import { RootState, store } from "../store/store";
import { setupAxiosInstance } from "../lib/headerInstance";
import { Button } from "@/components/ui/button";
import { Heart, MailWarning, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

function Detail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const loginUser = useSelector((state: RootState) => state.user);
  const uuid = useSelector((state: RootState) => state.uuid.uuid);

  const imageRef = useRef<HTMLInputElement | null>(null);
  const [comment, setComment] = useState("");

  const { mutate } = useMutation({
    mutationKey: ["article", "put"],
    mutationFn: (formData: FormData): Promise<AxiosResponse> =>
      setupAxiosInstance(store).post(
        `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}`,
        formData
      ),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const { mutate: delMutate } = useMutation({
    mutationKey: ["article", "delete"],
    mutationFn: (): Promise<AxiosResponse> =>
      setupAxiosInstance(store).delete(
        `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}`
      ),
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
    navigate("/");
  };

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: async (): Promise<TList> => {
      return axios
        .get(
          `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}`
        )
        .then((data) => data.data.data);
    },
  });

  const { data: isLike, error: likeError } = useQuery({
    queryKey: ["article", "like", uuid, id],
    queryFn: async (): Promise<TList> => {
      return setupAxiosInstance(store)
        .get(
          `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}/like`
        )
        .then(({ data }) => {
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
        .get(
          `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}/comment`
        )
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
    mutationKey: ["article", "like", uuid, id],
    mutationFn: (): Promise<AxiosResponse> =>
      setupAxiosInstance(store).post(
        `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}/like`,
        {}
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "like", uuid, id],
      });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const { mutate: commentMutate, error: commentMutateError } = useMutation({
    mutationKey: ["article", "comment", id],
    mutationFn: (): Promise<AxiosResponse> =>
      setupAxiosInstance(store).post(
        `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}/comment`,
        {
          comment,
        }
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "comment", id],
      });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
      setComment("");
    },
  });

  if (isLoading) {
    return (
      <main className="w-dvw h-dvh flex items-center justify-center">
        로딩 중...
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-dvw h-dvh flex items-center justify-center">
        <div className="flex flex-col text-center items-center">
          <MailWarning size={80} />
          <div className="flex items-end justify-center mb-2 mt-4">
            <h1 className="text-3xl mr-2">에러 발생</h1>
            <p>
              <i>{(error as Error)?.message}</i>
            </p>
          </div>
          <p className="mb-8">
            어떤 에러가 발생하여 페이지가 로드되지 않았습니다.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              navigate(-1);
            }}
          >
            이전으로
          </Button>
        </div>
      </main>
    );
  }

  if (likeError || likeMutateError) {
    alert("좋아요가 정상적으로 작동되지 않았습니다");
  }

  if (commentMutateError || commentError) {
    alert("댓글 작성에 실패하였습니다.");
  }

  const onLikeClick = () => {
    if (!uuid) {
      alert("좋아요가 정상적으로 작동되지 않았습니다");
    }
    likeMutate();
  };

  const onCommentSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    commentMutate();
  };

  return (
    <main className="flex justify-center items-center">
      <div className="flex flex-col p-6 w-[500px] mb-8">
        {detail ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl">디테일페이지</h2>
              <div>
                {(loginUser.id
                  ? detail?.userInfo?.id === loginUser.id
                  : detail.user === uuid) && (
                  <>
                    <input
                      type="file"
                      className="hidden"
                      ref={imageRef}
                      accept=".jpg,.jpeg,.png"
                      onChange={onLoadFile}
                    />
                    <Button
                      className="mr-2"
                      variant="secondary"
                      onClick={handleUpdate}
                    >
                      수정
                    </Button>
                    <Button variant="secondary" onClick={handleDelete}>
                      삭제
                    </Button>
                  </>
                )}
              </div>
            </div>
            <img
              className="w-[500px] h-[500px] object-cover border-[1px] border-solid border-gray-200 max-sm:h-[400px]"
              src={`data:image/${detail.contentType};base64,${detail.data}`}
              alt="그림 이미지"
            />
            <div className="flex justify-between items-center my-2">
              <div className="text-gray-500">{detail.regDate.slice(0, 10)}</div>
              <div className="flex">
                <div
                  onClick={onLikeClick}
                  className="flex items-center w-10 justify-between mr-2"
                >
                  {isLike ? (
                    <Heart fill="#000" size={28} />
                  ) : (
                    <Heart size={28} />
                  )}{" "}
                  {detail.likeCount}
                </div>
                <div className="flex items-center w-10 justify-between">
                  <MessageSquare size={28} /> {detail.commentCount}
                </div>
              </div>
            </div>
            <form onSubmit={onCommentSubmit} className="flex mt-3">
              <Input
                type="text"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="댓글입력해주세요"
              />
              <Button type="submit">댓글 등록</Button>
            </form>
          </>
        ) : (
          <div>
            <h2 className="text-2xl">디테일페이지</h2>
            <p>404 : 존재하지 않는 페이지입니다.</p>
          </div>
        )}
        <div className="mb-6">
          {comments && comments?.length !== 0 ? (
            comments?.map((item) => <CommentItem item={item} key={item._id} />)
          ) : (
            <div className="self-start mt-2">작성된 댓글이 없습니다.</div>
          )}
        </div>
        <hr className="mb-10" />
        <HomeBtn />
      </div>
    </main>
  );
}

export default Detail;

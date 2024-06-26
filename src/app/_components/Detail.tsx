"use client";

import { Button } from "../../../@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, MailWarning, MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { TComment, TList, Tlike } from "src/types/List";
import HomeBtn from "./HomeBtn";
import { useSelector } from "react-redux";
import { RootState, store } from "src/store/store";
import fetchWithInterceptors from "src/lib/fetchWithInterceptors";
import { FormEventHandler, useRef, useState } from "react";
import { Input } from "../../../@/components/ui/input";
import CommentItem from "./CommentItem";
import Image from "next/image";

export default function Detail() {
  const router = useRouter();
  const loginUser = useSelector((state: RootState) => state.user);
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  const queryClient = useQueryClient();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [comment, setComment] = useState("");
  const { id } = useParams() as { id: string };

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: async (): Promise<TList> => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}article/${id}`, {
        method: "GET",
      })
        .then((data) => data.json())
        .then((data) => data.data);
    },
  });

  const { data: isLike, error: likeError } = useQuery({
    queryKey: ["article", "like", uuid, id],
    queryFn: async () => {
      return fetchWithInterceptors<Tlike>(
        `${process.env.NEXT_PUBLIC_BASE_URL}article/like?id=${id}`,
        {
          method: "GET",
        },
        store
      ).then(({ data }) => {
        if (data) {
          return data.isLike;
        } else {
          return false;
        }
      });
    },
  });

  const { mutate: likeMutate, error: likeMutateError } = useMutation({
    mutationKey: ["article", "like", uuid, id],
    mutationFn: (): Promise<Response> =>
      fetchWithInterceptors<Tlike>(
        `${process.env.NEXT_PUBLIC_BASE_URL}article/like?id=${id}`,
        {
          method: "POST",
          body: null,
        },
        store
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "like", uuid, id],
      });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["article", "put"],
    mutationFn: (formData: FormData): Promise<Response> =>
      fetchWithInterceptors(
        `${process.env.NEXT_PUBLIC_BASE_URL}article/${id}`,
        {
          method: "PUT",
          body: formData,
          next: { revalidate: 0 },
        },
        store
      ),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });

  const { mutate: delMutate } = useMutation({
    mutationKey: ["article", "delete"],
    mutationFn: (): Promise<Response> =>
      fetchWithInterceptors(
        `${process.env.NEXT_PUBLIC_BASE_URL}article/${id}`,
        { method: "DELETE" },
        store
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

  const { mutate: commentMutate, error: commentMutateError } = useMutation({
    mutationKey: ["article", "comment", id],
    mutationFn: (): Promise<Response> =>
      fetchWithInterceptors(
        `${process.env.NEXT_PUBLIC_BASE_URL}article/${id}/comment`,
        { method: "POST", body: JSON.stringify(comment) },
        store
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

  const { data: comments, error: commentError } = useQuery({
    queryKey: ["article", "comment", id],
    queryFn: async (): Promise<TComment[]> => {
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}article/${id}/comment`)
        .then((data) => {
          return data.json();
        })
        .then(({ data }) => {
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
              router.back();
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

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isDelete = confirm("이미지를 정말로 삭제하시겠어요?");
    if (!isDelete) {
      return;
    }
    delMutate();
    alert("삭제가 완료되었습니다.");
    router.push("/");
  };

  const onCommentSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    commentMutate();
  };

  return (
    <main className="flex justify-center items-center w-dvw">
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
            <Image
              width={500}
              height={500}
              sizes="(max-width: 500px) 100vw, 100vw"
              className="w-[500px] h-[500px] object-cover border-[1px] border-solid border-gray-200"
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

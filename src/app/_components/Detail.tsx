"use client";

import { Button } from "../../../@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { MailWarning, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { TList } from "src/types/List";
import HomeBtn from "./HomeBtn";

interface Props {
  id: string;
}

export default function Detail({ id }: Props) {
  const router = useRouter();
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: async (): Promise<TList> => {
      return fetch(`http://localhost:3000/api/article/detail?id=${id}`, {
        method: "GET",
      })
        .then((data) => data.json())
        .then((data) => data.data);
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

  return (
    <main className="flex justify-center items-center w-dvw">
      <div className="flex flex-col p-6 w-[500px] mb-8">
        {detail ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl">디테일페이지</h2>
              {/* <div>
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
              </div> */}
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
                  //   onClick={onLikeClick}
                  className="flex items-center w-10 justify-between mr-2"
                >
                  {/* {isLike ? (
                    <Heart fill="#000" size={28} />
                  ) : (
                    <Heart size={28} />
                  )}{" "} */}
                  {detail.likeCount}
                </div>
                <div className="flex items-center w-10 justify-between">
                  <MessageSquare size={28} /> {detail.commentCount}
                </div>
              </div>
            </div>
            {/* <form onSubmit={onCommentSubmit} className="flex mt-3">
              <Input
                type="text"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder="댓글입력해주세요"
              />
              <Button type="submit">댓글 등록</Button>
            </form> */}
          </>
        ) : (
          <div>
            <h2 className="text-2xl">디테일페이지</h2>
            <p>404 : 존재하지 않는 페이지입니다.</p>
          </div>
        )}
        {/* <div className="mb-6">
          {comments && comments?.length !== 0 ? (
            comments?.map((item) => <CommentItem item={item} key={item._id} />)
          ) : (
            <div className="self-start mt-2">작성된 댓글이 없습니다.</div>
          )}
        </div> */}
        <hr className="mb-10" />
        <HomeBtn />
      </div>
    </main>
  );
}

"use client";

import { FormEventHandler, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { TComment } from "src/types/List";
import { RootState, store } from "src/store/store";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import fetchWithInterceptors from "src/lib/fetchWithInterceptors";

interface Props {
  item: TComment;
}

function CommentItem({ item }: Props) {
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  const loginUser = useSelector((state: RootState) => state.user);

  const [commentMode, setCommentMode] = useState(false);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { mutate: commentMutate, error: commentMutateError } = useMutation({
    mutationKey: ["article", "comment", item._id],
    mutationFn: (): Promise<Response> => {
      return fetchWithInterceptors(
        `http://localhost:3000/api/article/comment/detail?id=${item.articleID}&comment=${item._id}`,
        {
          method: "PUT",
          body: JSON.stringify(comment),
        },
        store
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", item.articleID],
      });
      queryClient.invalidateQueries({
        queryKey: ["article", "comment", item.articleID],
      });
      setCommentMode(false);
    },
  });

  const { mutate: delMutate, error: delMutateError } = useMutation({
    mutationKey: ["article", "comment", "delete", item.articleID],
    mutationFn: (): Promise<Response> =>
      fetchWithInterceptors(
        `http://localhost:3000/api/article/comment/detail?id=${item.articleID}&comment=${item._id}`,
        {
          method: "DELETE",
        },
        store
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "comment", item.articleID],
      });
      queryClient.invalidateQueries({ queryKey: ["article", item.articleID] });
    },
  });

  const onCommentSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const isUpdate = confirm("진짜로 댓글을 수정하시겠습니까?");
    isUpdate && commentMutate();
  };

  if (commentMutateError) {
    alert("댓글 수정에 실패하였습니다.");
  }

  if (delMutateError) {
    alert("댓글 삭제에 실패하였습니다.");
  }

  return (
    <div key={item._id}>
      <div className="flex justify-between items-center mt-3 mb-2">
        <span className="text-base">
          {item.userInfo?.nickname ? item.userInfo?.nickname : "게스트"}
        </span>
        <div>
          {(loginUser.id
            ? item?.userInfo?.id === loginUser.id
            : item.user === uuid) && (
            <>
              {!commentMode && (
                <Button
                  variant="secondary"
                  className="mr-2 px-2"
                  onClick={() => {
                    setCommentMode(true);
                  }}
                >
                  수정
                </Button>
              )}
              <Button
                variant="secondary"
                className="px-2"
                onClick={() => {
                  const isDel = confirm("진짜로 댓글을 삭제하겠습니까?");
                  isDel && delMutate();
                }}
              >
                삭제
              </Button>
            </>
          )}
        </div>
      </div>
      <form onSubmit={onCommentSubmit}>
        {!commentMode ? (
          <div className="border-[1px] border-solid border-gray-200 p-2 rounded">
            {item.body}
          </div>
        ) : (
          <div className="flex">
            <Input
              type="text"
              onChange={(e) => {
                setComment(e.target.value);
              }}
              readOnly={!commentMode}
              defaultValue={item.body}
              className="mr-2"
            />
            <Button className="mr-1 px-2">수정완료</Button>
            <Button
              className="px-2"
              variant="secondary"
              onClick={() => {
                setCommentMode(false);
              }}
            >
              수정취소
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CommentItem;

import { FormEventHandler, useState } from "react";
import { TComment } from "../types/List";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, store } from "../store/store";
import { setupAxiosInstance } from "../lib/headerInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  item: TComment;
}

function CommentItem({ item }: Props) {
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  const loginUser = useSelector((state: RootState) => state.user);

  const [commentMode, setCommentMode] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { mutate: commentMutate, error: commentMutateError } = useMutation({
    mutationKey: ["article", "comment", item._id],
    mutationFn: (): Promise<AxiosResponse> => {
      return setupAxiosInstance(store).put(
        `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/comment/${item._id}`,
        {
          comment,
        }
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", id],
      });
      queryClient.invalidateQueries({ queryKey: ["article", "comment", id] });
      setCommentMode(false);
    },
  });

  const { mutate: delMutate, error: delMutateError } = useMutation({
    mutationKey: ["article", "comment", "delete", id],
    mutationFn: (): Promise<AxiosResponse> =>
      setupAxiosInstance(store).delete(
        `http://ec2-3-37-14-37.ap-northeast-2.compute.amazonaws.com:4000/article/${id}/comment/${item._id}`
      ),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["article", "comment", id] });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
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

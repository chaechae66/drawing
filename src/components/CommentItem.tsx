import { FormEventHandler, useState } from "react";
import { TComment } from "../types/List";
import { LocalStorage } from "../lib/localStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";

interface Props {
  item: TComment;
}

function CommentItem({ item }: Props) {
  const localStorage = new LocalStorage();
  const [commentMode, setCommentMode] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { mutate: commentMutate, error: commentMutateError } = useMutation({
    mutationKey: ["article", "comment", item._id],
    mutationFn: (): Promise<AxiosResponse> => {
      return axios.put(`http://localhost:4000/article/comment/${item._id}`, {
        comment,
      });
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
    mutationKey: ["article", "comment", "delete", item._id],
    mutationFn: (): Promise<AxiosResponse> =>
      axios.delete(`http://localhost:4000/article/${id}/comment/${item._id}`),
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
      {item.user === localStorage.get() && (
        <>
          {!commentMode && (
            <button
              onClick={() => {
                setCommentMode(true);
              }}
              className="bg-red-400 mr-2 p-1 text-white"
            >
              수정
            </button>
          )}
          <button
            onClick={() => {
              const isDel = confirm("진짜로 댓글을 삭제하겠습니까?");
              isDel && delMutate();
            }}
            className="bg-slate-500 p-1 text-white"
          >
            삭제
          </button>
        </>
      )}
      <span>
        {new RegExp(
          "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
        ).test(item.user) ? (
          "게스트"
        ) : (
          <>{item.user}</>
        )}
      </span>
      :{" "}
      <form onSubmit={onCommentSubmit}>
        {!commentMode ? (
          <div>{item.body}</div>
        ) : (
          <>
            <input
              type="text"
              onChange={(e) => {
                setComment(e.target.value);
              }}
              readOnly={!commentMode}
              defaultValue={item.body}
            />
            <button className="bg-blue-700 mr-2 p-1 text-white">
              수정완료
            </button>
            <button
              onClick={() => {
                setCommentMode(false);
              }}
              className="bg-slate-500 p-1 text-white"
            >
              수정취소
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default CommentItem;
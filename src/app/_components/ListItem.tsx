"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TList, Tlike } from "../../types/List";
import Link from "next/link";
import { RootState, store } from "../../store/store";
import { useSelector } from "react-redux";
import fetchWithInterceptors from "../../lib/fetchWithInterceptors";
import { Heart, MessageSquare } from "lucide-react";

function ListItem({ elem }: { elem: TList }) {
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  const queryClient = useQueryClient();

  const { mutate: likeMutate, error: likeMutateError } = useMutation({
    mutationKey: ["article", "like", uuid, elem._id],
    mutationFn: (): Promise<Response> =>
      fetchWithInterceptors<Tlike>(
        `${process.env.NEXT_PUBLIC_BASE_URL}article/like?id=${elem._id}`,
        {
          method: "POST",
          body: null,
        },
        store
      ),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "like", uuid, elem._id],
      });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });
  const { data: isLike, error: likeError } = useQuery({
    queryKey: ["article", "like", uuid, elem._id],
    queryFn: async () => {
      return fetchWithInterceptors<Tlike>(
        `${process.env.NEXT_PUBLIC_BASE_URL}article/like?id=${elem._id}`,
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

  const onLikeClick = () => {
    if (!uuid) {
      alert("좋아요가 정상적으로 작동되지 않았습니다");
    }
    likeMutate();
  };
  if (likeMutateError || likeError) {
    alert("좋아요가 정상적으로 작동되지 않았습니다");
  }

  return (
    <div key={elem._id}>
      <p className="text-xl mb-[-8px]">
        {elem?.userInfo?.nickname ? `${elem.userInfo.nickname}님` : "게스트님"}
      </p>
      <span className="text-gray-500 text-xs">{elem.regDate.slice(0, 10)}</span>
      <Link href={`detail/${elem._id}`}>
        <img
          className="w-full h-[235px] rounded-md object-cover mb-2 border-solid border-gray-200 border-[1px]"
          src={`data:image/${elem.contentType};base64,${elem.data}`}
          alt="그림 이미지"
        />
      </Link>

      <div className="flex">
        <div
          onClick={onLikeClick}
          className="flex items-center w-8 justify-between mr-2"
        >
          {isLike ? <Heart fill="#000" size={20} /> : <Heart size={20} />}{" "}
          {elem.likeCount}
        </div>
        <div className="flex items-center w-8 justify-between">
          <MessageSquare size={20} /> {elem.commentCount}
        </div>
      </div>
    </div>
  );
}

export default ListItem;

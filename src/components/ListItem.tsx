import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LocalStorage } from "../lib/localStorage";
import { TList } from "../types/List";
import { Link } from "react-router-dom";
import axios, { AxiosResponse } from "axios";

function ListItem({ elem }: { elem: TList }) {
  const localStorage = new LocalStorage();
  const userId = localStorage.get();
  const queryClient = useQueryClient();

  const { mutate: likeMutate, error: likeMutateError } = useMutation({
    mutationKey: ["article", "like", userId, elem._id],
    mutationFn: (): Promise<AxiosResponse> =>
      axios.post(`http://localhost:4000/article/${elem._id}/like/${userId}`),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["article", "like", userId, elem._id],
      });
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });
  const { data: isLike, error: likeError } = useQuery({
    queryKey: ["article", "like", userId, elem._id],
    queryFn: async (): Promise<TList> => {
      return axios
        .get(`http://localhost:4000/article/${elem._id}/like/${userId}`)
        .then(({ data: { data } }) => {
          if (data) {
            return data.isLike;
          } else {
            return false;
          }
        });
    },
  });

  const onLikeClick = () => {
    if (!userId) {
      alert("좋아요가 정상적으로 작동되지 않았습니다");
    }
    likeMutate();
  };
  if (likeMutateError || likeError) {
    alert("좋아요가 정상적으로 작동되지 않았습니다");
  }
  return (
    <div key={elem._id}>
      <Link to={`detail/${elem._id}`}>
        <img
          src={`data:image/${elem.contentType};base64,${elem.data}`}
          alt="그림 이미지"
        />
      </Link>
      <div className="text-xl">
        <span onClick={onLikeClick}>{isLike ? "♥" : "♡"}</span> :
        {elem.likeCount}
        <span>✉️</span> :{elem.commentCount}
      </div>
    </div>
  );
}

export default ListItem;

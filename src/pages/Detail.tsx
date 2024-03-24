import { useParams } from "react-router-dom";
import BackBtn from "../components/BackBtn";
import axios, { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TList } from "../types/List";
import { LocalStorage } from "../lib/localStorage";
function Detail() {
  const { id } = useParams();
  const localStorage = new LocalStorage();
  const userId = localStorage.get();
  const queryClient = useQueryClient();

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
          return data.isLike;
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

  const onLikeClick = () => {
    if (!userId) {
      alert("좋아요가 정상적으로 작동되지 않았습니다");
    }
    likeMutate();
  };

  return (
    <>
      <h2>디테일페이지</h2>
      {detail ? (
        <div>
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
        <form>
          <input
            className="border-gray-300 border-solid border-[1px]"
            type="text"
            placeholder="댓글입력해주세요"
          />
          <button type="submit" className="bg-blue-500 px-1 text-white">
            댓글 등록
          </button>
        </form>
      )}
      {/* {detail && (
        <div>
          {detail.comment?.length !== 0 ? (
            <>댓글있음</>
          ) : (
            <>등록된 댓글이 없습니다.</>
          )}
        </div>
      )} */}
      <BackBtn />
    </>
  );
}

export default Detail;

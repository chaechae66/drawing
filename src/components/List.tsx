import axios, { AxiosResponse } from "axios";
import { TList } from "../types/List";
import { useQuery } from "@tanstack/react-query";
import ListItem from "./ListItem";
function List() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["article"],
    queryFn: async (): Promise<AxiosResponse> => {
      const {
        data: { data },
      } = await axios.get("http://localhost:4000/article");

      return data.sort(
        (a: TList, b: TList) => Date.parse(b.regDate) - Date.parse(a.regDate)
      );
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

  return (
    <div className="grow">
      <h3 className="text-2xl">그림 리스트</h3>
      {data &&
        (data as unknown as TList[]).map((elem: TList) => (
          <ListItem elem={elem} key={elem._id} />
        ))}
    </div>
  );
}

export default List;

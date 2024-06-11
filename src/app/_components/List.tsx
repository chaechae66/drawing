"use client";

import axios, { AxiosResponse } from "axios";
import { TList } from "../../types/List";
import { useQuery } from "@tanstack/react-query";
import ListItem from "./ListItem";
function List() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["article"],
    queryFn: async (): Promise<AxiosResponse> => {
      const {
        data: { data },
      } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}article`);

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
      <p>사람들이 공유한 그림들을 구경해보아요.</p>
      <hr className="mt-4" />
      <div className="grid grid-cols-3 gap-2 mt-8 max-md:grid-cols-2 max-sm:grid-cols-1">
        {data &&
          (data as unknown as TList[]).map((elem: TList) => (
            <ListItem elem={elem} key={elem._id} />
          ))}
      </div>
    </div>
  );
}

export default List;

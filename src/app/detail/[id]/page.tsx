import Detail from "src/app/_components/Detail";
import { TList } from "src/types/List";

export async function generateStaticParams() {
  const posts = await fetch("http://localhost:3000/api/article").then((res) =>
    res.json()
  );

  return posts.data.map((post: TList) => ({
    id: post._id,
  }));
}
export default function detailPage() {
  return (
    <>
      <Detail />
    </>
  );
}

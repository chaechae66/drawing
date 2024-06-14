import { Metadata } from "next";
import Detail from "src/app/_components/Detail";
import Article from "src/app/api/_model/article";
import dbConnect from "src/lib/db/dbConnect";

type Params = {
  id: string;
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  await dbConnect();
  const post = await Article.findById(params.id);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This post does not exist.",
    };
  }

  return {
    title: "Drawing",
    description:
      "자신의 그림을 공유하고 좋아요와 댓글을 통해 소통하는 웹사이트 입니다.",
    openGraph: {
      title: "Drawing",
      description:
        "자신의 그림을 공유하고 좋아요와 댓글을 통해 소통하는 웹사이트 입니다.",
      images: [
        {
          url: `data:image/${post.contentType};base64,${post.data}`,
          width: 800,
          height: 600,
          alt: `그림`,
        },
      ],
    },
  };
}

export default function detailPage() {
  return (
    <>
      <Detail />
    </>
  );
}

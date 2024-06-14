import Header from "./_components/Header";
import Providers from "./_components/Providers";
import UUIDProvider from "./_components/UUIDProvider";
import { Noto_Sans_KR } from "next/font/google";

import "./global.css";

const notoSans = Noto_Sans_KR({ subsets: ["latin"], weight: ["400"] });

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSans.className}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="Drawing" />
        <meta
          name="description"
          content="자신의 그림을 공유하고 좋아요와 댓글을 통해 소통하는 웹사이트 입니다."
        />
        <link rel="icon" type="image/x-icon" href="./favicon.ico" />
        <title>Drawimg</title>
      </head>
      <body>
        <Providers>
          <UUIDProvider>
            <Header />
            <section>
              <div
                id="root"
                className="px-2 min-h-[calc(100dvh-theme(space.36))] w-dvw flex justify-center"
              >
                {children}
              </div>
            </section>
            <footer className="bg-gray-200 flex items-center justify-center h-[calc(theme(space.20)+0.5rem)]">
              copyright&copy; 2024 All rights reserved Park Chae Yeon
            </footer>
          </UUIDProvider>
        </Providers>
      </body>
    </html>
  );
}

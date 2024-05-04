import Header from "./_components/Header";
import Providers from "./_components/Providers";
import UUIDProvider from "./_components/UUIDProvider";

import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="drawing" content="그림을 공유하는 사이트" />
      </head>
      <body>
        <Providers>
          <UUIDProvider>
            <Header />
            <section className="px-2 min-h-dvh w-[768px] flex justify-center">
              <div id="root">{children}</div>
            </section>
            <footer className="bg-gray-200 flex items-center justify-center h-20">
              copyright&copy; 2024 All rights reserved Park Chae Yeon
            </footer>
          </UUIDProvider>
        </Providers>
      </body>
    </html>
  );
}
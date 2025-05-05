import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/SideBar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";
import Player from "@/components/Player";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";
import getPlaylists from "@/actions/getPlaylists";
import { Suspense } from "react";
import Loading from "./loading";
import PageTransition from "@/components/PageTransition";

const font = Figtree({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunatone",
  description: "Say goodbye to bad words. Listen to the best explicit free music!",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSongs = await getSongsByUserId();
  const userPlaylists = await getPlaylists();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider/>
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <CreatePlaylistModal />
            <Sidebar songs={userSongs} playlists={userPlaylists}>
              <div className="h-full">
                <Suspense fallback={<Loading />}>
                  <PageTransition>
                    {children}
                  </PageTransition>
                </Suspense>
              </div>
            </Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}



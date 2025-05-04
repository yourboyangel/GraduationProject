import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContet from "./components/PageContent";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();

  return (
    <div className="
    bg-gradient-to-b
    from-[#2D2053]
    to-[#15132B]
    min-h-screen
    w-full
    overflow-hidden
    overflow-y-auto
    rounded-lg
    ">
      <Header>
        <div className="mb-8">
          <h1 className="
          text-white
          text-3xl
          font-bold
          mb-6
          ">
            Featured Playlists
          </h1>
          <div className="
          grid
          grid-cols-2
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
          gap-4
          md:gap-6
          mt-4
          "> 
            <ListItem 
              image="/images/liked.png"
              name="Liked Songs"
              href="/liked"
            />
            {/* Add more playlist items here */}
          </div>
        </div>
      </Header>
      <div className="mt-2 px-6">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold mb-6">Recommended for Today</h2>
          <PageContet songs={songs}/>
        </div>
      </div>
    </div>
  )
}

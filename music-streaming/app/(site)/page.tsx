import getSongs from "@/actions/getSongs";
import getPlaylists from "@/actions/getPlaylists";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "./components/PageContent";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const playlists = await getPlaylists();

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
            Your Playlists
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
            {playlists.map((playlist) => (
              <ListItem 
                key={playlist.id}
                image={playlist.image_path || "/images/default_playlist.png"}
                name={playlist.name}
                href={`/playlist/${playlist.id}`}
              />
            ))}
          </div>
        </div>
      </Header>
      <div className="mt-2 px-6">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold mb-6">
            Listen to Any of Your Songs
          </h2>
          <PageContent songs={songs}/>
        </div>
      </div>
    </div>
  )
}

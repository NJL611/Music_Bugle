'use client'
import Carousel from "@/components/Carousel";
import Nav from "@/components/Nav";
import useWindowUtils from "@/hooks/useWindowUtils";

export default function Home() {
  const { loaded } = useWindowUtils();

  return (
    <main className="flex flex-col items-center w-full">
      {loaded && (
        <>
          <Nav />
          <Carousel />
        </>
      )}
    </main>
  );
}

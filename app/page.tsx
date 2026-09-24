import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center px-6">

        <h1 className="text-5xl font-bold text-green-700 mb-4">
          🚲 BikeGo
        </h1>

        <p className="text-xl text-gray-700 mb-8">
          Explore the city by bicycle
        </p>

<Link

href="/bikes"

className="
bg-green-600
text-white
px-8
py-3
rounded-full
inline-block
"

>

Rent Now

</Link>

      </div>
    </main>
  );
}
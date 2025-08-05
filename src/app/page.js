import Events from "@/components/events";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 md:grid md:grid-cols-4">
     
      <div className="hidden md:block md:col-span-1 relative">
        <img
           src="/side1.jpeg"
          alt="Swaralaya Event Art"
          className="absolute w-full h-full"
        />
      </div>
      
      <div className="col-span-full md:col-span-3 h-screen">
        <Events />
      </div>
    </div>
  );
}

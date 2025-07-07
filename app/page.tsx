import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/layout/Navbat";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <SignUpButton mode="modal">
          <span className="bg-orange-500 text-white rounded-md px-4 py-2">
            Sign up
          </span>
        </SignUpButton>

        <div className="">
          <h1>Ncoder</h1>
          <p>
            This app is inspired by The Programjmer&apos;s Brain: What every
            programmer needs to know about cognition.
          </p>
        </div>
      </div>
    </>
  );
}

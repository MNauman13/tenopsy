import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>Welcome to the HomePage!</h2>
      <Button>Get Started!</Button>
      <UserButton />
    </div>
  );
}

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getSessionFromCookie } from "../session/cookie";

const App: NextPage = () => {
    const router = useRouter();
    useEffect(() => {
      const session = getSessionFromCookie();
      if (!session) {
        router.push("/");
      }
    }, [router]);

    return (
        <div>

        </div>
    )
}

export default App

import mixpanel from "@/lib/mixpanel";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Mixpanel() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      mixpanel.track("Page View", { page: url });
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return null;
}

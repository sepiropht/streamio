import { useEffect } from "react";
import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import "antd/dist/antd.css";
import theme from "../theme";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import * as gtag from "../utils/gtag";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;

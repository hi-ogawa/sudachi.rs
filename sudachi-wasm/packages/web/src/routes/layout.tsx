import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Head } from "rakkasjs";
import React from "react";
import { Toaster } from "react-hot-toast";
import "virtual:windi.css";
import "../styles/index.css";

export default function Layout(props: React.PropsWithChildren) {
  return (
    <>
      <Head title="sudachi.wasm" />
      <Providers>
        {props.children}
        <Toaster />
      </Providers>
    </>
  );
}

function Providers(props: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 0,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

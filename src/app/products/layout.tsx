import Navbar from "@/components/Navbar";
import "../globals.css";
import ReactQueryProvider from "../providers/ReactQueryProviders";
import ReduxProvider from "../providers/ReduxProvider";
import ToastProvider from "../providers/ToastProvider";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <ReactQueryProvider>
        <ReduxProvider>
          <Navbar />
          {children}
        </ReduxProvider>
      </ReactQueryProvider>
    </ToastProvider>
  );
}

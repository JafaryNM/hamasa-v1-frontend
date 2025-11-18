import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div
          className="items-center hidden w-full h-full lg:w-1/2 lg:grid relative"
          style={{
            backgroundImage: "url('/images/logo/hamasa.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Optional brand overlay */}
          <div className="absolute inset-0 bg-brand-950/70 dark:bg-white/5"></div>

          <div className="relative flex items-center justify-center z-10">
            <GridShape />
          </div>
        </div>

        <div className="fixed z-50 hidden bottom-6 right-6 sm:block"></div>
      </div>
    </div>
  );
}

import { Link, Links, LiveReload, NavLink, Outlet } from "@remix-run/react";
import styles from "./tailwind.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Links />
        <title>deimos ~ the natural satellite subnet manager</title>
      </head>
      <body className="bg-black bg-gradient-to-r from-black to-gray-900/75 text-neutral-300 w-[1280px] m-auto py-12">
        <div className="flex">
          <div className="inline-block">
            <Link to="/"><h1 className="text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">deimos</h1>
            <h3 className="mb-6 text-lg">the 'natural satellite' subnet manager</h3></Link>
          </div>
        </div>

        <div className="w-full border-t-2 border-neutral-900 mb-6"></div>
        <Outlet />
        <div className="w-full border-t-2 border-neutral-900 mt-6"></div>

        <div className="flex my-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">&copy; Aaron Duce 2022</span>
        </div>

        {process.env.NODE_ENV === "development" ? (
          <LiveReload />
        ) : null}
      </body>
    </html>
  );
}
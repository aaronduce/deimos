import { Link, Outlet } from "@remix-run/react";
export default function SubnetsRoute() {
    return (
        <div>
        <main>
            <Outlet />
        </main>
        </div>
    );
}
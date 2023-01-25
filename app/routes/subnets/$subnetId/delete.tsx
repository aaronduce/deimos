import { type ActionFunction, type LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { Subnet, Address} from "@prisma/client";

type LoaderData = { subnet: Subnet & {addresses: Address[]} };

export const action: ActionFunction = async ({
    request,
    params
  }) => {
    const form = await request.formData();
    if (form.get("_method") === "delete") {
      const subnet = await db.subnet.findUnique({
        where: { id: params.subnetId }
      });
      if (!subnet) {
        throw new Response(
          "Can't delete what does not exist",
          { status: 404 }
        );
      }
      await db.subnet.delete({ where: { id: params.subnetId } });
      return redirect("/");
    }
};

export const loader: LoaderFunction = async ({
    params
}) => {
    const subnet = await db.subnet.findUnique({
        where: { id: params.subnetId },
        include: {
            addresses: true
        }
    });

    if (!subnet) throw new Error("Subnet not found");
    const data: LoaderData = { subnet };
    return data;
}

export default function SubnetRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <Link to="/"><h1 className="mb-6 underline">&larr; Return to Addressing</h1></Link>

            <div className={ `bg-${data.subnet.colour}-900/50 w-full px-8 py-6 shadow-left-marker shadow-${data.subnet.colour}-900 mb-6` }>
                <div className="flex">
                    <div className="inline-block">
                        <Link to={ `/data.subnets/${data.subnet.id}` } className="text-3xl font-bold data.subnetName">{data.subnet.name}</Link>
                        <p><span className="v4PartOne">{data.subnet.v4partOne}</span>.<span className="v4PartTwo">{data.subnet.v4partTwo}</span>.<span className="v4PartThree">{data.subnet.v4partThree}</span>.0</p>
                        { data.subnet.dhcp ? null : <p>Addresses stored: {data.subnet.addresses.length}</p> }
                    </div>
                </div>
            </div>

            <div className="font-bold text-lg mt-6">Are you sure you want to delete this subnet? All related addresses will also be deleted.</div>

            <form method="post" className="flex">
                <input type="hidden" name="_method" value="delete" />
                <button type="submit" className="px-3 py-2 bg-red-900 rounded-lg ml-auto">
                    <span className="text-transparent bg-clip-text bg-slate-100">Delete</span>
                </button>
            </form>

        </div>
    )
}
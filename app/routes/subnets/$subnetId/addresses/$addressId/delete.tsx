import type { ActionFunction, LoaderFunction } from "remix";
import { Link, useLoaderData, redirect } from "remix";
import { db } from "~/utils/db.server";
import type { Subnet, Address } from "@prisma/client";

type LoaderData = { address: Address & {subnet: Subnet} };

export const action: ActionFunction = async ({
    request,
    params
  }) => {
    const form = await request.formData();
    if (form.get("_method") === "delete") {
      const address = await db.address.findUnique({
        where: { id: params.addressId }
      });
      if (!address) {
        throw new Response(
          "Can't delete what does not exist",
          { status: 404 }
        );
      }
      await db.address.delete({ where: { id: params.addressId } });
      return redirect("/");
    }
};

export const loader: LoaderFunction = async ({
    params
}) => {
    const address = await db.address.findUnique({
        where: { id: params.addressId },
        include: {
            subnet: true
        }
    });

    if (!address) throw new Error("Address not found");
    const data: LoaderData = { address };
    return data;
}

export default function SubnetRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <Link to="/"><h1 className="mb-6 underline">&larr; Return to Addressing</h1></Link>

            <div className={ `bg-${data.address.subnet.colour}-900/50 w-full px-8 py-6 shadow-left-marker shadow-${data.address.subnet.colour}-900 mb-6` }>
                <div className="flex">
                    <div className="inline-block">
                        <div className="text-3xl font-bold">{data.address.detail}</div>
                        <p><span className="v4PartOne">{data.address.subnet.v4partOne}</span>.<span className="v4PartTwo">{data.address.subnet.v4partTwo}</span>.<span className="v4PartThree">{data.address.subnet.v4partThree}</span>.{data.address.address}</p>
                    </div>
                </div>
            </div>

            <div className="font-bold text-lg mt-6">Are you sure you want to delete this address?</div>

            <form method="post" className="flex">
                <input type="hidden" name="_method" value="delete" />
                <button type="submit" className="px-3 py-2 bg-red-900 rounded-lg ml-auto">
                    <span className="text-transparent bg-clip-text bg-slate-100">Delete</span>
                </button>
            </form>

        </div>
    )
}
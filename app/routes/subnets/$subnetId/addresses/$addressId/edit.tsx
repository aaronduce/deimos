import { type ActionFunction, type LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { Subnet, Address } from "@prisma/client";

type LoaderData = { address: Address & {subnet: Subnet}, subnets: Subnet[] };

export const action: ActionFunction = async ({
    request,
    params
}) => {
    const form = await request.formData();
    const existAddress = await db.address.findUnique({
        where: { id: params.addressId }
    });
    if (!existAddress) {
        throw new Response(
            "Can't delete what does not exist",
            { status: 404 }
        );
    }
    const detail = form.get("detail");
    const address = Number(form.get("address"));
    const subnetId = form.get("subnet");

    if (
        typeof detail !== "string" ||
        typeof address !== "number" ||
        typeof subnetId !== "string"
    ) {
        throw new Error("Form submitted incorrectly.");
    } 

    const fields = { detail, address, subnetId };

    await db.address.update({ where: { id: params.addressId }, data: fields });
    return redirect(`/`);
}

export const loader: LoaderFunction = async ({
    params
}) => {
    const address = await db.address.findUnique({
        where: { id: params.addressId },
        include: {
            subnet: true
        }
    });

    const subnets = await db.subnet.findMany({
        orderBy: [
            {
                v4partOne: 'asc',
            },
            {
                v4partTwo: 'asc',
            },
            {
                v4partThree: 'asc',
            }
        ]
    });

    if (!address) throw new Error("Address not found");

    if (!subnets) throw new Error("No subnets. How?????");

    const data: LoaderData = { address, subnets };
    return data;
}

export default function NewSubnetRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div className={ `bg-${data.address.subnet.colour}-900/50 w-full px-8 py-6 shadow-left-marker shadow-${data.address.subnet.colour}-900 mb-6` }>
            <Link to="/"><h1 className="mb-6 underline">&larr; Return to Addressing</h1></Link>
          <p className="text-3xl font-bold mb-6">Edit address for {data.address.detail}</p>
          <Form method="post">
            <div className="my-4">
              <label>
                <span className="w-48 inline-block">Detail: </span><input type="text" name="detail" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 w-80" defaultValue={data.address.detail} />
              </label>
            </div>
            <div className="my-4">
                <label>
                <span className="w-48 inline-block">Subnet &amp; address: </span><select name="subnet" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900" defaultValue={data.address.subnetId}>
                    {data.subnets.map(subnet => (
                        <option value={subnet.id}>{subnet.name} - {subnet.v4partOne}.{subnet.v4partTwo}.{subnet.v4partThree}.0</option>
                    ))}
                </select>
                <input type="number" min="0" max="255" name="address" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 w-24 ml-4" defaultValue={data.address.address} />
              </label>
            </div>
            <div>
              <button type="submit" className="px-3 py-2 bg-slate-900 rounded-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Update</span>
              </button>
            </div>
          </Form>
        </div>
    );
}
import { type ActionFunction, type LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { colours } from "~/utils/tailwind-colors.server";
import type { Subnet, Address } from "@prisma/client";

type LoaderData = { subnet: Subnet & {addresses: Address[]} };

export const action: ActionFunction = async ({
    request,
    params
}) => {
    const form = await request.formData();
    const subnet = await db.subnet.findUnique({
        where: { id: params.subnetId }
    });
    if (!subnet) {
        throw new Response(
            "Can't edit what does not exist",
            { status: 404 }
        );
    }    
    const name = form.get("name");
    const colour = form.get("colour");
    const v4partOne = Number(form.get("v4partOne"));
    const v4partTwo = Number(form.get("v4partTwo"));
    const v4partThree = Number(form.get("v4partThree"));
    const dhcp = Boolean(form.get("dhcp"));

    if (
        typeof name !== "string" ||
        typeof colour !== "string" ||
        typeof v4partOne !== "number" ||
        typeof v4partTwo !== "number" ||
        typeof v4partThree !== "number" ||
        typeof dhcp !== "boolean"
    ) {
        throw new Error("Form submitted incorrectly.");
    } 

    const fields = { name, colour, v4partOne, v4partTwo, v4partThree, dhcp };

    await db.subnet.update({ where: { id: params.subnetId }, data: fields });
    return redirect(`/`);
}

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

export default function NewSubnetRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <Link to="/"><h1 className="mb-6 underline">&larr; Return to Addressing</h1></Link>
          <p className="text-3xl font-bold mb-6">Edit subnet {data.subnet.name}</p>
          <Form method="post">
            <div className="my-4">
              <label>
                <span className="w-48 inline-block">Name: </span><input type="text" name="name" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 w-80" defaultValue={data.subnet.name} />
              </label>
            </div>
            <div className="my-4">
                <label>
                <span className="w-48 inline-block">Subnet v4: </span><select name="v4partOne" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 w-24" defaultValue={data.subnet.v4partOne}>
                    <option value="10">10</option>
                    <option value="172">172</option>
                    <option value="192">192</option>
                </select> . <input type="number" name="v4partTwo" min="0" max="255" defaultValue={data.subnet.v4partTwo} className="text-slate-100 bg-slate-900 border-slate-900 rounded-lg w-24" /> . <input type="number" name="v4partThree" min="0" max="255" defaultValue={data.subnet.v4partThree} className="text-slate-100 bg-slate-900 border-slate-900 rounded-lg w-24" /> . 000 <br />
                <i className="text-sm text-slate-500/50">* Addressing restrictions as per <a href="https://www.ietf.org/rfc/rfc1918.txt">RFC 1918: Address Allocation for Private Internets</a></i>
              </label>
            </div>
            <div className="my-4">
                <label className="flex">
                    <span className="w-48 inline-block h-full">Colour: </span>
                    <div className="inline-block">
                    {colours.map(colour => (
                        <label className="flex"><input type="radio" name="colour" id="colour" defaultChecked={colour.value === data.subnet.colour} value={colour.value} /> <div className={ `bg-${colour.value}-900 w-6 h-4 rounded-lg inline-block mx-2` }></div>{colour.name}</label>
                    ))}
                    </div>
                    
                </label>
            </div>
            <div className="my-4">
                <label>
                    <span className="w-48 inline-block">DHCP addressing:</span><input type="checkbox" name="dhcp" defaultChecked={data.subnet.dhcp} /> 
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
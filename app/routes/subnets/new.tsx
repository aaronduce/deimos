import type { ActionFunction } from "remix";
import { Form, redirect, Link } from "remix";
import { db } from "~/utils/db.server";
import { colours } from "~/utils/tailwind-colors.server";

export const action: ActionFunction = async ({
    request
}) => {
    const form = await request.formData();
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

    const subnet = await db.subnet.create({ data: fields });
    return redirect(`/`);
}

export default function NewSubnetRoute() {
    return (
        <div>
            <Link to="/"><h1 className="mb-6 underline">&larr; Return to Addressing</h1></Link>
          <p className="text-3xl font-bold mb-6">Add new subnet</p>
          <Form method="post">
            <div className="my-4">
              <label>
                <span className="w-48 inline-block">Name: </span><input type="text" name="name" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 w-80" />
              </label>
            </div>
            <div className="my-4">
                <label>
                <span className="w-48 inline-block">Subnet v4: </span><select name="v4partOne" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 w-24">
                    <option value="10" selected>10</option>
                    <option value="172">172</option>
                    <option value="192">192</option>
                </select> . <input type="number" name="v4partTwo" min="0" max="255" defaultValue="0" className="text-slate-100 bg-slate-900 border-slate-900 rounded-lg w-24" /> . <input type="number" name="v4partThree" min="0" max="255" defaultValue="0" className="text-slate-100 bg-slate-900 border-slate-900 rounded-lg w-24" /> . 000 <br />
                <i className="text-sm text-slate-500/50">* Addressing restrictions as per <a href="https://www.ietf.org/rfc/rfc1918.txt">RFC 1918: Address Allocation for Private Internets</a></i>
              </label>
            </div>
            <div className="my-4">
                <label className="flex">
                    <span className="w-48 inline-block h-full">Colour: </span>
                    <div className="inline-block">
                    {colours.map(colour => (
                        <label className="flex"><input type="radio" name="colour" id="colour" value={colour.value} /> <div className={ `bg-${colour.value}-900 w-6 h-4 rounded-lg inline-block mx-2` }></div>{colour.name}</label>
                    ))}
                    </div>
                    
                </label>
            </div>
            <div className="my-4">
                <label>
                    <span className="w-48 inline-block">DHCP addressing:</span><input type="checkbox" name="dhcp" /> 
                </label> 
            </div>
            <div>
              <button type="submit" className="px-3 py-2 bg-slate-900 rounded-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Add</span>
              </button>
            </div>
          </Form>

          <div className="hidden ">bg-red-900 bg-orange-900 bg-amber-900 bg-yellow-900 bg-lime-900 bg-green-900 bg-emerald-900 bg-teal-900 bg-cyan-900 bg-sky-900 bg-blue-900 
          bg-indigo-900 bg-violet-900 bg-purple-900 bg-fuchsia-900 bg-pink-900 bg-rose-900 bg-slate-900 bg-neutral-900 bg-red-900/50 bg-orange-900/50 bg-amber-900/50 bg-yellow-900/50
          bg-lime-900/50 bg-green-900/50 bg-emerald-900/50 bg-teal-900/50 bg-cyan-900/50 bg-sky-900/50 bg-blue-900/50 bg-indigo-900/50 bg-violet-900/50 bg-purple-900/50 bg-fuchsia-900/50
          bg-pink-900/50 bg-rose-900/50 bg-slate-900/50 bg-neutral-900/50 shadow-red-900 shadow-orange-900 shadow-amber-900 shadow-yellow-900 shadow-lime-900 shadow-green-900 shadow-emerald-900
          shadow-teal-900 shadow-cyan-900 shadow-sky-900 shadow-blue-900 shadow-indigo-900 shadow-violet-900 shadow-purple-900 shadow-fuchsia-900 shadow-pink-900 shadow-rose-900 shadow-slate-900
          shadow-neutral-900</div>
        </div>
    );
}
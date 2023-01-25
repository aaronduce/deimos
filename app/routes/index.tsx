import { type ActionFunction, type LinksFunction, type LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({
    request
}) => {
    const form = await request.formData();
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

    const subnet = await db.address.create({ data: fields });
    return redirect(`/`);
}

type Address = Array<{ id: string; address: number; detail: string; }>;
type LoaderData = {
    subnets: Array<{ id: string; name: string; colour: string; v4partOne: number; v4partTwo: number; v4partThree: number; dhcp: boolean; addresses: Address }>;
};

export const loader: LoaderFunction = async () => {
    const data: LoaderData = {
        subnets: await db.subnet.findMany({
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
            ], 
            include: {
                addresses: {
                    orderBy: [
                        { 
                            address: 'asc'
                        }
                    ]
                },
            }
        }),
    };

    return data;
}

export default function IndexAddressingListRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <div className="flex">
                <Link to="/"><h1 className="inline-flex text-3xl font-bold mb-6">Addressing</h1></Link>
                <div className="flex-grow"></div>
                <div className="inline-block h-full flex">
                    <Link to="/subnets/new" className="my-auto px-3 py-2 bg-slate-900 rounded-lg"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Add new subnet</span></Link>
                </div>

            </div>

            <ul>
                {data.subnets.map(subnet => (
                    <li className=" rounded-lg" key={subnet.id}>
                        <div className={ `bg-${subnet.colour}-900/50 w-full px-8 py-6 shadow-left-marker shadow-${subnet.colour}-900 mb-6` }>
                            <div className="flex">
                                <div className="inline-block">
                                    <Link to={ `/subnets/${subnet.id}` } className="text-3xl font-bold subnetName">{subnet.name}</Link>
                                    <p><span className="v4PartOne">{subnet.v4partOne}</span>.<span className="v4PartTwo">{subnet.v4partTwo}</span>.<span className="v4PartThree">{subnet.v4partThree}</span>.0</p>
                                    { subnet.dhcp ? null : <p>Addresses stored: {subnet.addresses.length}</p> }
                                </div>
                                <div className="flex-grow"></div>
                                <div className="inline-block h-auto flex">
                                    <Link to={ `/subnets/${subnet.id}/edit` } className="my-auto px-3 py-2 bg-slate-900/50 ring-1 ring-fuchsia-900 rounded-lg"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Edit</span></Link>
                                </div>
                            </div>

                            { subnet.addresses.length > 0 ? 
                                <ul className="bg-slate-900/50 w-full mt-4">
                                    {subnet.addresses.map((address, index) => (
                                        <li className={`${index % 2 > 0 ? `bg-slate-800/75` : `bg-slate-900/75`}`}>
                                            <div className="flex gap-2 py-3 px-4 ">
                                                <div className="w-28">{subnet.v4partOne}.{subnet.v4partTwo}.{subnet.v4partThree}.{address.address}</div>
                                                <div className="flex-grow">{address.detail}</div>
                                                <div><Link to={ `/subnets/${subnet.id}/addresses/${address.id}/edit` } className="my-auto px-3 py-2 bg-slate-900/50 ring-1 ring-fuchsia-900 rounded-lg"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Edit</span></Link></div>
                                                <div><Link to={ `/subnets/${subnet.id}/addresses/${address.id}/delete` } className="my-auto px-3 py-2 bg-slate-900/50 ring-1 ring-fuchsia-900 rounded-lg"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Delete</span></Link></div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            :
                                subnet.dhcp ? <p className="mt-4">Addressing handled by DHCP</p> : <p className="mt-4">No addresses.</p> 
                            }

                            { subnet.dhcp ? null :
                                <div className="mt-4 w-full">
                                    <Form method="post" className="grid grid-cols-10 gap-2">
                                        <input type="hidden" name="subnet" value={subnet.id} />
                                        <input required type="text" name="detail" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 col-span-5" placeholder="Detail" />
                                        <input type="text" className="text-slate-100 rounded-lg bg-slate-800 border-slate-800 text-center" readOnly value={subnet.v4partOne} />
                                        <input type="text" className="text-slate-100 rounded-lg bg-slate-800 border-slate-800 text-center" readOnly value={subnet.v4partTwo} />
                                        <input type="text" className="text-slate-100 rounded-lg bg-slate-800 border-slate-800 text-center" readOnly value={subnet.v4partThree} />
                                        <input required type="number" name="address" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900 text-center" placeholder="255" />
                                        <button type="submit" className="text-slate-100 rounded-lg bg-slate-900 border-slate-900"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Add</span></button>
                                    </Form>
                                </div>
                            }
                        </div>
                    </li> 
                ))}
            </ul>
        </div>
    );
}
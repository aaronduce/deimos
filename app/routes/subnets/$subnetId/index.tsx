import { LoaderFunction } from "remix";
import { Link, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import type { Subnet, Address} from "@prisma/client";

type LoaderData = { subnet: Subnet & {addresses: Address[]} };

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
                    <div className="flex-grow"></div>
                    <div className="inline-block h-auto flex">
                    <Link to={ `/subnets/${data.subnet.id}/delete` } className="my-auto px-3 py-2 bg-slate-900/50 ring-1 ring-fuchsia-900 rounded-lg"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Delete</span></Link>
                    </div>
                </div>

                { data.subnet.addresses.length > 0 ? 
                    <ul className="bg-slate-900/50 w-full mt-4">
                        {data.subnet.addresses.map((address, index) => (
                            <li className={`${index % 2 > 0 ? `bg-slate-800/75` : `bg-slate-900/75`}`}>
                                <div className="flex gap-2 py-3 px-4 ">
                                    <div className="w-28">{data.subnet.v4partOne}.{data.subnet.v4partTwo}.{data.subnet.v4partThree}.{address.address}</div>
                                    <div className="flex-grow">{address.detail}</div>
                                    <div><Link to={ `/subnets/${data.subnet.id}/addresses/${address.id}/edit` } className="my-auto px-3 py-2 bg-slate-900/50 ring-1 ring-fuchsia-900 rounded-lg"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Edit</span></Link></div>
                                    <div><Link to={ `/subnets/${data.subnet.id}/addresses/${address.id}/delete` } className="my-auto px-3 py-2 bg-slate-900/50 ring-1 ring-fuchsia-900 rounded-lg"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Delete</span></Link></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                :
                    data.subnet.dhcp ? <p className="mt-4">Addressing handled by DHCP</p> : <p className="mt-4">No addresses.</p> 
                }

            </div>

        </div>
    )
}
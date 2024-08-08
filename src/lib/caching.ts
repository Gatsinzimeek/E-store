import { unstable_cache as nextcache } from "next/cache";
import { cache as reactcache } from "react";

type Callback = ([...args]: any) => Promise<any>

export const cache = <TF extends Callback>(Cb: TF, keyparts:string[], options: {revalidate?: number | false; tag?: string[]} = {}) =>{
    return nextcache(reactcache(Cb), keyparts, options)
}


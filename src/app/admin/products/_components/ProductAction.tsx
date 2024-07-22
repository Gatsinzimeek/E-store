"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { toggleProductAvailability,deleteProduct } from "../../_actions/products";

export const ActiveTooggleDropdownItem = ({id,isAvailableForPurchase}:{id: string, isAvailableForPurchase:boolean}) => {
    const [ispending, startTransition] = useTransition();
    return <DropdownMenuItem disabled={ispending} onClick={() => {
        startTransition(async () => {
            await toggleProductAvailability(id,!isAvailableForPurchase)
        })
    }}>
        {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem> 
}

export const DeleteDropdownItem = ({id,disabled}: {id:string, disabled: boolean}) => {
    const [ispending, startTransition] = useTransition();
    return <DropdownMenuItem disabled={disabled || ispending} onClick={() => {
        startTransition(async () => {
            await deleteProduct(id)
        })
    }}>
        Delete
    </DropdownMenuItem> 
}
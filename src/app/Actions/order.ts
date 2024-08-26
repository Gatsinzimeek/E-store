"use server"

import db from "@/db/db"

const UserOrderExist = async (productId:string, email:string) => {
    return (
        await db.order.findFirst({where: {user: {email},productId}, select: {id: true}})
    ) != null
}

export default UserOrderExist;
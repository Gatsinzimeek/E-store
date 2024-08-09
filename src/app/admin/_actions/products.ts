"use server"
import {z} from "zod";
import fs from "fs/promises"
import db from "@/db/db";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, {message: "Required"})
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))


const AddSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int(),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required")
})

export const Addproduct = async(prevstate: unknown, formData: FormData)=> {
    const result = AddSchema.safeParse(Object.fromEntries(formData.entries()))
    if(result.success) {
        const data =  result.data;
        await fs.mkdir("products", {recursive: true})
        const filepath = `products/${crypto.randomUUID()}-${data.file.name}`
        await fs.writeFile(filepath, Buffer.from(await data.file.arrayBuffer()))
        
        await fs.mkdir("public/products", {recursive: true})
        const imagepath = `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public${imagepath}`, Buffer.from(await data.image.arrayBuffer()))

        await db.product.create({data: {
            isAvailableForPurchase: false,
            name: data.name,
            priceInCents: data.priceInCents,
            filePath: filepath,
            description: data.description,
            imagePath: imagepath,
        }})
        revalidatePath("/")
        revalidatePath("/products")
        redirect("/admin/products")
    }else{
        return  result.error.formErrors.fieldErrors
    }
}


export const toggleProductAvailability = async (id:string, isAvailableForPurchase: boolean) => {
    await db.product.update({where: {id}, data: {isAvailableForPurchase}})
    
    revalidatePath("/")
    revalidatePath("/products")
}

export const deleteProduct = async (id:string) => {
    const product = await db.product.delete({where: {id}})

    if(product === null) return notFound()

    await fs.unlink(product.filePath)
    await fs.unlink(`product/${product.filePath}`)
    
    revalidatePath("/")
    revalidatePath("/products")
}

const editSchema = AddSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional()
})

export const updateproduct = async(id:string, prevstate: unknown, formData: FormData)=> {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
   
    if(result.success) {
        const product = await db.product.findUnique({where: {id}})

        if(product == null) return notFound();

        const data =  result.data;
        let filepath = product.filePath
        if(data.file != null && data.file.size > 0 ){
            await fs.unlink(product.filePath)
            filepath = `products/${crypto.randomUUID()}-${data.file.name}`
            await fs.writeFile(filepath, Buffer.from(await data.file.arrayBuffer()))
        }
        
        let imagePath = product.imagePath;
        if(data.image != null && data.image.size > 0) {
        await fs.unlink(`public${imagePath}`)
        imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
        await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()))
    }
        await db.product.update({where: {
            id
        },
        data: {
            name: data.name,
            priceInCents: data.priceInCents,
            filePath: filepath,
            description: data.description,
            imagePath
        }})
        
        revalidatePath("/")
        revalidatePath("/products")
        redirect("/admin/products")
    }else{
        return  result.error.formErrors.fieldErrors
    }
}
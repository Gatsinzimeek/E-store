"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatCurreny } from "@/lib/formatter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Addproduct, updateproduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";
const ProductForm = ({product}: {product?: Product | null}) => {
  const [priceInCents, setPriceInCents] = useState<number | undefined >(product?.priceInCents)
  const [error, action] = useFormState(product == null ? Addproduct: updateproduct.bind(null,product.id), {});

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name" >Name</Label>
        <Input type="text" id="name" name="name" required defaultValue={product?.name || ""}/>
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="PriceInCents" >Price In Cents</Label>
        <Input type="number" id="priceInCents" name="priceInCents" required defaultValue={product?.priceInCents} value={priceInCents} onChange={e => setPriceInCents(Number(e.target.value) || undefined)}/>
        {error.priceInCents && <div className="text-destructive">{error.priceInCents}</div>}
      </div>
      <div className="text-muted-foreground">
        {formatCurreny((priceInCents || 0) / 100)}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" >Description</Label>
        <Textarea id="description" name="description" required defaultValue={product?.description} />  
      {error.description && <div className="text-destructive">{error.description}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file" >File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && <div className="text-muted-foreground">{product.filePath}</div>}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="Image" >Image</Label>
        <Input type="file" id="Image" name="image" required={product == null} />
        {product != null && <Image src={product.imagePath} width={400} height={300} alt="No picture"/> }
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <ButtonSubmit />
    </form>
  )
}

export default ProductForm;


const ButtonSubmit = () => {
  const {pending} = useFormStatus();
  return(
    <Button type="submit" disabled={pending}>
      {
        pending ? "Saving... " : "Save"
      }
    </Button>
  ) 
}
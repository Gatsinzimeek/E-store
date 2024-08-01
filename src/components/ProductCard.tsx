import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { formatCurreny } from "@/lib/formatter"
import Image from "next/image"

type ProductCardProps = {
    id: string,
    name: string,
    description: string,
    priceInCents: number,
    imagePath: string, 
}

const ProductCard = ({name, priceInCents, description, id, imagePath}: ProductCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden">
        <div className="relative w-full h-auto aspect-video">
            <Image src={imagePath} fill alt={name}/>
        </div>
        <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{formatCurreny(priceInCents / 100)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="line-clamp-4">{description}</p>
        </CardContent>
        <CardFooter>
            <Button asChild size="lg" className="w-full">
                <Link href={`/product/${id}/purchase`}>Purchase</Link>
            </Button>
        </CardFooter>
    </Card>
  )
}

export default ProductCard


export const ProductCardSkeleton = () => {
    return (
        <Card className="overflow-hidden flex flex-col animate-pulse">
            <div className="w-full aspect-video bg-gray-300"/>
            <CardHeader>
                <CardTitle>
                    <div className="w-3/4 h-6 rounded-full bg-gray-300"></div>
                </CardTitle>
                <CardDescription>
                    <div className="w-1/2 h-4 rounded-full bg-gray-300"/>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div  className="w-full h-4 rounded-full bg-gray-300"/>
                <div  className="w-full h-4 rounded-full bg-gray-300"/>
                <div  className="w-3/4 h-4 rounded-full bg-gray-300"/>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled size="lg"></Button>
            </CardFooter>
        </Card>
    )
}

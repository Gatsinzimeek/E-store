import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { Product } from "@prisma/client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProductCardSkeleton } from "@/components/ProductCard"
import { Suspense } from "react"
import { cache } from "@/lib/caching"

const GetMostPopular = cache(() => {
    return db.product.findMany({
        where: {isAvailableForPurchase: true},
        orderBy: {orders: { _count: "desc"}},
        take: 6
    })
},["/", "GetMostPopular"], {revalidate: 60 * 60 * 24})


const GetNewsestProduct = cache(() => {
    return db.product.findMany({
        where: {isAvailableForPurchase: true},
        orderBy: {createAt: "desc"},
        take: 6
    })
},["/","GetNewsestProduct"], {revalidate: 60*60*24})

const page = () => {
  return (
    <div>
        <ProductGridSection title="Newest Product" productFetcher={GetNewsestProduct} />
        <ProductGridSection title="Most Popular Product" productFetcher={GetMostPopular}/>
    </div>
  )
}

export default page


type ProductGridSectionProps = {
    productFetcher: () => Promise<Product[]>
    title: string
}

const ProductGridSection = async ({productFetcher, title}: ProductGridSectionProps) => {
    return(
        <div className="space-y-4 py-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Button variant="outline" asChild>
                    <Link href="/products" className="space-x-2">
                        <span>View All</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
            <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense fallback={
                    <>
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </>
                }>
                    <SupenseProduct productFetcher={productFetcher}/>
                </Suspense>
            </div>
        </div>
    )
}

const SupenseProduct = async ({productFetcher} :{productFetcher: () => Promise<Product[]>}) =>{
    return(
        (await productFetcher()).map(product => (
            <ProductCard key={product.id} {...product}/>
        ))
    )
}
import { Suspense } from "react"
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard"
import db from "@/db/db"


const getProduct = () => {
       return db.product.findMany({where: {isAvailableForPurchase: true}, orderBy: {name: "asc"}})
    }

const ProuctsPage = () => {
    return (
    <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense fallback={
                    <>
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                    </>
                }>
                    <ProductsSuspens/>
                </Suspense>
            </div>
  )
}

export default ProuctsPage

const ProductsSuspens = async() => {
    const products = await getProduct();
    return (
        products.map(product => (
            <ProductCard key={product.id} {...product} />
        )))
    
    
}
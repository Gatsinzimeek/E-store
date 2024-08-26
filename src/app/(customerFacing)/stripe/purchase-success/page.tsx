import Image from "next/image"
import { formatCurreny } from "@/lib/formatter"
import Stripe from "stripe"
import { notFound } from "next/navigation"
import db from "@/db/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)


const SuccessPage = async ({searchParams,}: {searchParams: {payment_intent: string}}) => {
      // Validate that payment_Intent is defined and not an empty string
  if (!searchParams.payment_intent) {
    // Handle the case where the payment_Intent is missing
    return notFound(); // Or return an error page or message
  }
    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)
    if(paymentIntent.metadata.productId == null) return notFound();

    const product = await db.product.findUnique({where: {id: paymentIntent.metadata.productId}})
    if(product == null) return notFound();

    const isSuccess = paymentIntent.status === "succeeded";

    return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
        <h1 className="text-4xl font-bold">{isSuccess ? "Successful Payment": "Error"}</h1>
    <div className="flex gap-4 items-center">
      <div className="aspect-video flex-shrink-0 w-1/3 relative">
        <Image src={product.imagePath} className="object-cover" alt={product.name} fill />
      </div>
      <div>
          <div className="text-lg">
            {formatCurreny(product.priceInCents / 100)}
          </div>
          <h1>{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
         <Button className="mt-4" size="lg" asChild>{isSuccess ? (<a></a>) : (<Link href={`/products/${product.id}/purchase`}>Try again</Link>)}</Button>
      </div>
    </div>
  </div>
  )
}

export default SuccessPage

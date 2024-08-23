"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurreny } from "@/lib/formatter"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import { FormEvent, useState } from "react"
type CheckOutFormProps = {
    product: {
      imagePath: string
      name: string
      description: string
      priceInCents: number
    },
    clientSecret: string
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

const CheckOutForm = ({product, clientSecret}: CheckOutFormProps ) => {
  return (
  <div className="max-w-5xl w-full mx-auto space-y-8">
    <div className="flex gap-4 items-center">
      <div className="aspect-video flex-shrink-0 w-1/3 relative">
        <Image src={product.imagePath} className="object-cover" alt={product.name} fill />
      </div>
      <div>
          <div className="text-lg">
            {formatCurreny(product.priceInCents)}
          </div>
          <h1>{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
      </div>
    </div>
    <Elements stripe={stripePromise} options={{clientSecret}}>
        <Form priceInCents={product.priceInCents} />
    </Elements>
  </div>
  )
}

const Form = ( {priceInCents} : { priceInCents: number}) => {
  const stripe = useStripe();
  const Element = useElements();
  const [IsLoading, setIsLoading] = useState(false);
  const handleForm = (e:FormEvent)=> {
    e.preventDefault();
    if(stripe == null || Element == null) return
      setIsLoading(true)
  }
  return (
    <form onSubmit={handleForm}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive">Error</CardDescription>
        </CardHeader>
        <CardContent>
           <PaymentElement />
        </CardContent>
        <CardFooter>
          <Button disabled={stripe == null || Element == null || IsLoading} className="">Purchase - {formatCurreny(priceInCents / 100)}</Button>
        </CardFooter>
      </Card>   
    </form>

  )
}

export default CheckOutForm

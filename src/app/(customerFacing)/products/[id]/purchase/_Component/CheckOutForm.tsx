"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurreny } from "@/lib/formatter"
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Image from "next/image"
import UserOrderExist from "@/app/Actions/order"
import { FormEvent, useState } from "react"
type CheckOutFormProps = {
    product: {
      id: string
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
            {formatCurreny(product.priceInCents / 100)}
          </div>
          <h1>{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
      </div>
    </div>
    <Elements stripe={stripePromise} options={{clientSecret}}>
        <Form priceInCents={product.priceInCents} productId={product.id} />
    </Elements>
  </div>
  )
}

const Form = ( {priceInCents, productId} : { productId: string, priceInCents: number}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [IsLoading, setIsLoading] = useState(false);
  const [Error, setErrorMessage] = useState<string>()
  const [email, setEmail] = useState<string>()
  const handleForm = async (e:FormEvent)=> {
    e.preventDefault();
    if(stripe == null || elements == null || email == null) return
      setIsLoading(true)
     
      const OrderExists = await UserOrderExist(email, productId)
    if(OrderExists) {
      setErrorMessage("You have already purchased check it in my order page");
      return
    }
    stripe.confirmPayment({elements, confirmParams: {
      return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
    }}).then(({error}) => {
      if(error?.type == "card_error" || error?.type == "validation_error") {
        setErrorMessage(error.message)
      }else{
        setErrorMessage("Error occured is Unknown");
      }
    }).finally(() => setIsLoading(false));
  }
  return (
    <form onSubmit={handleForm}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {Error && (
            <CardDescription className="text-destructive">${Error}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
           <PaymentElement />
            <div className="mt-4">
               <LinkAuthenticationElement onChange={e => setEmail(e.value.email)} />
            </div>
        </CardContent>
        <CardFooter>
          <Button disabled={stripe == null || Element == null || IsLoading} className="">Purchase - {formatCurreny(priceInCents / 100)}</Button>
        </CardFooter>
      </Card>   
    </form>

  )
}

export default CheckOutForm

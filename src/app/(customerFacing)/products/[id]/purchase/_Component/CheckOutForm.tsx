"use client"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
type CheckOutFormProps = {
    product: {},
    clientSecret: string
}
const stripePromise = loadStripe(process.env.NEXT_Stripe_Public_Key as string)

const CheckOutForm = ({product, clientSecret}: CheckOutFormProps ) => {
  return (
    <Elements stripe={stripePromise} options={{clientSecret}}>
        <Form />
    </Elements>
  )
}

const Form = () => {
  const stripe = useStripe();
  const Element = useElements();

  return <PaymentElement />
}

export default CheckOutForm

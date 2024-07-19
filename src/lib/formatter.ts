const Currency_Formatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
})

export const formatCurreny = (amount: number) =>{
    return Currency_Formatter.format(amount)
}

const Number_Formatter = new Intl.NumberFormat("en-US")

export const formatNumber = (number: number) => {
    return Number_Formatter.format(number)
}
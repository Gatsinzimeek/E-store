import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import db from "@/db/db"
import { formatCurreny, formatNumber } from "@/lib/formatter"

const getSalesData = async () =>{
  const data= await db.order.aggregate({
    _sum: {priceInCents: true},
    _count: true
  })
  return {
    amount: (data._sum.priceInCents || 0) / 100,
    numberOfSales: data._count
  }
}

const getUserData = async () => {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: {priceInCents: true}
    }),
  ])
  return {
    userCount,
    AvaragePerUser: userCount === 0 ? 0 : (orderData._sum.priceInCents || 0) / userCount /100,

  }
}

const getProductData = async () => {
  const [ActiveProduct,InactiveProduct] = await Promise.all([
    db.product.count({where: {isAvailableForPurchase: true}}),
    db.product.count({where: {isAvailableForPurchase: false}}),
  ])
  await awaited(2000);
  return {
    ActiveProduct,
    InactiveProduct
  }
}

const awaited = (duration: number) => {
  return new Promise(resolve => setTimeout(resolve,duration))
}


const AdminDashboard = async() => {

 const [sales, userData, ProductData] = await Promise.all([
  getSalesData(),
  getUserData(),
  getProductData(),
 ])
  return (
    <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <DashboardCard title="hell" Subtitle={`${formatNumber(sales.amount)} Orders`} body={formatCurreny(sales.numberOfSales)}></DashboardCard>
    <DashboardCard title="hell" Subtitle={`${formatCurreny(userData.AvaragePerUser)} Average Value`} body={formatNumber(userData.userCount)}></DashboardCard>
    <DashboardCard title="hell" Subtitle={`${formatCurreny(ProductData.InactiveProduct)} Inactive`} body={formatNumber(ProductData.ActiveProduct)}></DashboardCard>
    </div>
  )
}

type DashboardCardProps = {
    title: string;
    Subtitle: string;
    body: string
}

const DashboardCard = ({title, Subtitle, body}: DashboardCardProps ) => {
  return (
      <Card>
        <CardHeader>
          <CardTitle>
            {title}
          </CardTitle>
        <CardDescription>
            {Subtitle}
        </CardDescription>
        </CardHeader>
        <CardContent>
            {body}
        </CardContent>
      </Card>
  )
}

export default AdminDashboard

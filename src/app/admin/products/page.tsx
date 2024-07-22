import PageHeader from "../_components/PageHeader"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurreny,formatNumber } from "@/lib/formatter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ActiveTooggleDropdownItem, DeleteDropdownItem } from "./_components/ProductAction";
const page = () => {
  return (
    <>
    <div className="flex justify-between items-center gap-4">
      <PageHeader>Product</PageHeader>
      <Button><Link href="/admin/products/new">Add Product</Link></Button>

    </div>
    <ProductsTable></ProductsTable>
    </>
  )
}

export default page

const ProductsTable = async() => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: {orders: true} }
    },
    orderBy: {name: "asc"}
  })

  if(products.length === 0) return <p>No products Found</p>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available for purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
         {
          products.map(product => (
            <TableRow key={product.id}>
                <TableCell>
                  {product.isAvailableForPurchase ? (
                    <>
                      <span className="sr-only">Available For Sale</span>
                      <CheckCircle2 />
                    </>
                  ):
                  (
                    <>
                      <span className="sr-only">Not Available for Sale</span>
                      <XCircle />
                    </>
                  )
                  }
                </TableCell>
                <TableCell>
                   {product.name}
                </TableCell>
                <TableCell>
                  {formatCurreny(product.priceInCents / 100)}
                </TableCell>
                <TableCell>{formatNumber(product._count.orders)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>                        
                        <MoreVertical />
                        <span className="sr-only">Action</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                          <a href={`/admin/products/${product.id}/download`}>Download</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <ActiveTooggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                        <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0}/>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
            </TableRow>
          ))
         }
      </TableBody>
    </Table>
  )
}
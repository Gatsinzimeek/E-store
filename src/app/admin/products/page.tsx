import PageHeader from "../_components/PageHeader"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
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

const ProductsTable = () => {
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
         
      </TableBody>
    </Table>
  )
}
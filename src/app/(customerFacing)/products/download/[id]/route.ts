import db from "@/db/db"
import fs from "fs/promises"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest, {params: {downloadVerification}}: {params: {downloadVerification: string}}) => {
    const data = await db.downloadVerfication.findUnique({
        where: {id: downloadVerification, expiresAt: {gt: new Date() }},
        select: {product: {select: {filePath: true, name: true}}} 
      })
    
      if(data == null) {
        return NextResponse.redirect(new URL('/products/download/expired', req.url))
      }
      
      const {size} = await fs.stat(data.product.filePath)
      const file = await fs.readFile(data.product.filePath);
      const extension = data.product.filePath.split(".").pop() 
  
      return new NextResponse(file,{
          headers:{"Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
          "Content-Length": size.toString(),
      }})



}


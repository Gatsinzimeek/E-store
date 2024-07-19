import Nav, {NavLink} from "@/components/Nav"

const layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    < >
        <div className="container my-6">{children}</div>
    </>
  )
}

export default layout
 
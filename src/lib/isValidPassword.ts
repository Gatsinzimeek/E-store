export const isValidPassword = async(password: string, hashedpassword: string) => {
    console.log(await hashpassword(password))
    return await hashpassword(password) === hashedpassword
}

const hashpassword = async (password: string) => {
    const arrayBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(password))
 
    return Buffer.from(arrayBuffer).toString("base64")
}
import { prisma } from "../lib/prisma"

async function main() {
    try {
        console.log("Connecting to DB...")
        const users = await prisma.user.findMany()
        console.log("Success! Found users:", users.length)
    } catch (e) {
        console.error("DB Connection Failed:", e)
        process.exit(1)
    }
}

main()

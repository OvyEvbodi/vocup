import { PrismaClient } from "@prisma/client"

const database = new PrismaClient();

async function main() {
    const allUsers = await database.user.findMany();
    console.log(allUsers)
}

//convert to try catch block
main()
    .catch(async (error) => {
        console.log("an error occured /n/n/n")
        console.log(error)
        process.exit(1)
    })
    .finally(async() => {
        await database.$disconnect()
    })

import { PrismaClient } from "@prisma/client"
import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const app = express();
const PORT = 8080;

const database = new PrismaClient();

app.get('/', (req, res) => {
  res.send('Welcome to PrisMongEx')
})

app.get('/database', (req, res) => {
  async function db_connection() {
  const allUsers = await database.user.findMany();
  console.log(allUsers)
  return allUsers
}

    //convert to try catch bloc
  db_connection()
    .then(users => {
      res.type('json')
      res.send(JSON.stringify(users))
    })
    .catch(async (error) => {
      console.log("an error occured /n/n/n")
      console.log(error)
      process.exit(1)
    })
    .finally(async() => {
      await database.$disconnect()
    })
})

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
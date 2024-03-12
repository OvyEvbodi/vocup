import { PrismaClient } from "@prisma/client"
import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const app = express();
const PORT = 8080;

const database = new PrismaClient();

// express middleware
app.use(express.json())

app.get('/', (_, res) => {
  res.send('Welcome to PrisMongEx')
})

// sign up
app.post('/signup', (req, res) => {
  const saltRounds = 9;

  // get user object
  const { email, username, password } = req.body;

  // validate all fields
  // coming soon

  // encrypt password
  bcrypt.hash(password, saltRounds, (error, hash) => {
    //handle errors
    // coming soon

     // create user in databse
    const dbConnection = async () => {
      await database.user.create({
        data: {
          username,
          password: hash,
          email
        }
      })
    }
    dbConnection()
      .catch (async (error) => {
        console.log("an error occured /n/n/n")
        console.log(error)
        process.exit(1)
      })
      .finally(async() => {
        await database.$disconnect()
      })
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Origin', '*');
      res.setHeader('Content-Type', 'Application/json');
      res.setHeader('Access-Control-Allow-Headers', '*');

      res.status(201)
      res.type('json')
      res.send({ msg: "user created", email })
      res.end()
  })
})


app.get('/database', (_, res) => {
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
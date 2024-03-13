import { PrismaClient } from "@prisma/client"
import express from 'express'
import jsonwebtoken, { Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const app = express();

// express parameters
const PORT = 8080;

// database parameters
const database = new PrismaClient();

// jsonwebtoken setup
const jwtSecret:Secret = process.env.JWT_SECRET!;

// express middleware
app.use(express.json())

// Allow CORS 
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Origin', '*');
  res.setHeader('Content-Type', 'Application/json');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next()
})

app.get('/', (_, res) => {
  res.send('Welcome to PrisMongEx')
})


// sign up--------------------------------------------------------------------------------------
app.post('/signup', (req, res) => {
  const saltRounds: number = 9;

  // get user object
  const { email, username, password } = req.body;

  // validate all fields
  // coming soon

  // encrypt password
  bcrypt.hash(password, saltRounds, (error, hash) => {
    //handle errors and set status code 400 for bad request
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
    };
    dbConnection()
      .catch (async (error) => {
        console.log("an error occured /n/n/n")
        console.log(error)
        res.status(500)
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

app.post('/signin', (req, res) => {
  // get user data
  const { email, password } = req.body;

  // check for user in database
  const dbConnection = async () => {
    const user = await database.user.findMany({
      where: {
        email: email
      }
    })
    return user
  };

  dbConnection()
  .then(async (user) => {
    if (user.length === 0) {
      res.status(404)
      res.type('json')
      res.send({ msg: 'user not found, please sign in' })
      res.end()
    }
    // check that passwords match
    try {
      const match: boolean = await bcrypt.compare(password, user[0].password)
      if (match) {
        // create jwt (1 day expiration)
        const jwt = jsonwebtoken.sign({ email, password }, jwtSecret, { expiresIn: 86400 });
        res.status(200)
        res.type('json')
        // send jwt and user data (minus password) in response
        res.send({
          msg: 'signin sucessful',
          jwt,
          user
       })
        res.end()
      }
      else {
        res.status(401)
        res.type('json')
        res.send({ msg: 'incorrect password' })
        res.end()
      }
    } catch (error) {
      console.log(error)
    }
  })
  .catch ( async (error) => {
    console.log("an error occured /n/n/n")
    console.log(error)
    process.exit(1)
  })
  .finally(async() => {
    await database.$disconnect()
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
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
//role access
const { ROLE, users } = require('./data')
const { authUser, authRole } = require('./basicAuth')
const projectRouter = require('./routes/projects')



// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

app.use(setUser)
app.use('/projects', projectRouter)



// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

//part for role access 
app.get('/', (req, res) => {
    res.send('Home Page')
  })
  
  app.get('/dashboard', authUser, (req, res) => {
    res.send('Dashboard Page')
  })
  
  app.get('/admin', authUser, authRole(ROLE.ADMIN), (req, res) => {
    res.send('Admin Page')
  })
  
  function setUser(req, res, next) {
    const userId = req.body.userId
    if (userId) {
      req.user = users.find(user => user.id === userId)
    }
    next()
  }
  



const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
/*https://www.youtube.com/watch?v=HGgyd1bYWsE*/
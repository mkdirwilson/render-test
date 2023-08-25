
// simple webserver
// using http

// const http = require("http")

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]


// const app = http.createServer((request, response)=>{
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

// const PORT = 3001

// app.listen(PORT)

// console.log(`server is running on port ${PORT}`)


const express = require("express")

const app = express()

// important and using the CORS middleware
const cors = require("cors")

// using the cors middleware
app.use(cors())


// using the production build of our front end 
app.use(express.static('build'))

// middleware for parsing js object to json
app.use(express.json())



let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  app.get('/', (request, response)=> {
    response.send('<h1>Hello Prince</h1>')
  })

  // route for all notes
  app.get('/api/notes', (request, response)=>{
    response.json(notes)
  })


  // route fetching for a single note (resource)
  app.get('/api/notes/:id', (request, response)=>{
    const id = Number(request.params.id)
    const note = notes.find(note=>note.id === id)

    // status 200 is Ok, meaning successful request
    if(note){
      response.json(note)
    }

    // 404 code/content not found
    else {
      response.status(404).end()
    }
    
  })

  // deleting a resource 
  app.delete('/api/notes/:id', (request, response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
     // status for not content and usually used for deleting stuff
    response.status(204).end()
    
  })

  // adding notes or resources to the server
  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body

  
    if (!body.content) {
      // 400 content missing or bad request
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })


  // changing notes 
  app.put('/api/notes/:id', (request, response)=>{
    const note = request.body 
    
    response.json(note)
  })

 



  // middle a function that handles requests and responses
  const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

  app.use(requestLogger)

 
 const PORT = process.env.PORT || 3001
  app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
  })



  // HTTP verbs

  /*
  URL	verb	functionality
      notes/10	GET	fetches a single resource

      notes	GET	fetches all resources in the collection

      notes	POST	creates a new resource based on the request data

      notes/10	DELETE	removes the identified resource

      notes/10	PUT	replaces the entire identified resource with the request data

      notes/10	PATCH	replaces a part of the identified resource with the request data
  */



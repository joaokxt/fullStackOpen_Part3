const express = require('express') 
const app = express()

const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('content', function(req, res) { 
    return req.body ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status: :res[content-length] - :response-time ms :content'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(!person){
        response.status(404).end()
    } else {
        response.json(person)
    }  
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.number){
        return response.status(400).json({
            error: "no number given"
        })
    } 
    if(!body.name){
        return response.status(400).json({
            error: "no name given"
        })
    }

    const repeated = persons.find(p => p.name === body.name)
    if(repeated){
        return response.status(400).json({
            error: "name attribute must be unique"
        })
    }

    newPerson = {
        id: Math.floor(Math.random() * 1001),
        name: body.name || "John Doe",
        number: body.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    return response.status(204).end()
})

app.get('/info', (request, response) => {
    const info = `<p>Phonebook has info for ${persons.length} people</p>`
    const date = `<p> ${new Date()} </p>`
    response.send(info + date)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})
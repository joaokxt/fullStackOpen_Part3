// For env variables
require('dotenv').config()

// Import Person model and connect to DB
const Person = require('./models/person')

// Create express App
const express = require('express') 
const app = express()
// Import CORS for single origin policy
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

// Import morgan for logging
const morgan = require('morgan')
// Config morgan
morgan.token('content', function(req, res) { 
    return req.body ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status: :res[content-length] - :response-time ms :content'))

// ROUTE HANDLERS

// Get all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Get person by ID
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person){
               response.json(person) 
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Create person
app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body

    const newPerson = new Person({
        name: name,
        number: number,
    })

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number }, 
        { new: true, runValidators: true, context: 'query'}
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// Delete person
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(count => {
            const info = `<p>Phonebook has info for ${count} people</p>`
            const date = `<p> ${new Date()} </p>`
            response.send(info + date)
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})
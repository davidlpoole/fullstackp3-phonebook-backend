require('dotenv').config()

const express = require('express')
const app = express()
const { response } = require('express')
const cors = require('cors')

const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    console.error(error.message)
    next(error)
}

// MIDDLEWARE
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)



// GET ALL PEOPLE
app.get('/api/people', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

// DISPLAY PHONEBOOK INFO
app.get('/api/info', (request, response) => {
    Person.find({}).then(people => {
        const count = people.length
        const currentTime = new Date()
        const string = `
        <p>The phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
        `
        response.send(string)
    })
})

// GET A PERSON
app.get('/api/people/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


// ADD A NEW PERSON
app.post('/api/people', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    } else if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        dtadded: new Date(),
        dtupdated: new Date()
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// DELETE A PERSON
app.delete('/api/people/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// UPDATE A PERSON (a person's number)
app.put('/api/people/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
        dtupdated: new Date()
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// handler of requests with result to errors 
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
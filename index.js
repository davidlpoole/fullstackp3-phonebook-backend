const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

let people = [
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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const count = people.length
    const currentTime = new Date()
    const string = `
    <p>The phonebook has info for ${count} people</p>
    <p>${currentTime}</p>
    `
    response.send(string)
})

app.get('/api/people', (request, response) => {
    response.json(people)
})

app.get('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    const maxId = people.length > 0
        ? Math.floor(Math.random() * 100000000)
        : 0
    return maxId + 1
}

app.post('/api/people', (request, response) => {
    const body = request.body

    if (!body.name | !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const checkDuplicate = people.find(person => person.name === body.name)
    if (checkDuplicate) {
        return response.status(400).json({
            error: `${body.name} already exists in phonebook. 'Name' must be unique`
        })
    } else {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number,
            date: new Date(),
        }
        people = people.concat(person)
        response.json(person)
    }
})

app.delete('/api/people/:id', (request, response) => {
    const id = Number(request.params.id)
    people = people.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
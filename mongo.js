require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 2) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
        })
} else if (process.argv.length === 4) {
    const name = process.argv[2]
    const number = process.argv[3]

    const person = new Person({
        name: name,
        number: number,
        date: new Date()
    })
    person
        .save()
        .then(result => {
            console.log(`Added ${name} (${number}) to the phonebook!`)
            mongoose.connection.close()
        })
} else {
    console.log(
        `incorrect number of arguments...\n`
        + ` to display all current entries use: 'node mongo.js <yourpassword>'\n`
        + ` or to add a new person use: 'node mongo.js <yourpassword> <name> <number>'`
    )
    mongoose.connection.close()
}
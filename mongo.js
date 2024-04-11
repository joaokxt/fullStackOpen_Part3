const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://joaokxterck:${password}@nodecluster.h4exqvk.mongodb.net/personsApp?retryWrites=true&w=majority&appName=nodeCluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(result => {
        console.log(`Added ${person.name} with number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
})
}


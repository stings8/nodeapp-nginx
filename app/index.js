const express = require('express')
const mysql = require('mysql')
const { faker } = require('@faker-js/faker')
const PORT = 3000
const CONFIG = {
  host: 'db',
  user: 'root',
  password: 'owner',
  database: 'nodedb'
}

const connection = mysql.createConnection(CONFIG)

const app = express()
app.set('view engine', 'ejs')


const listPeoples = () => {
  const GET_PEOPLES = `SELECT Name From People`

  return new Promise((resolve, reject) => {
    connection.query(GET_PEOPLES, (error, result) => {
      if(error) return reject('Nenhum resultado encontrado')
      let list = JSON.parse(JSON.stringify(result))
      return resolve(list)
    })
  })
}

const createPeople = () => {
  const name = faker.person.fullName();
  const INSERT_PEOPLE = `INSERT INTO People(Name) values('${name}')`
  connection.query(INSERT_PEOPLE)

}

app.listen(PORT, () => {
  console.log('Running 🔥')
})

app.get('/', (req, res) => {
  createPeople()
  
  listPeoples().then(response => {
    res.render("../views/home", { peoples:  response })  
  }).catch(err => {
    res.render("../views/home", { peoples:  [], error: true })  
  })

})


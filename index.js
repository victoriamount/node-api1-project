// SETUP
console.log('Project is running')

const e = require('express')
const express = require('express')
const shortid = require('shortid')
const server = express()

server.use(express.json())

// FAKE DATA
let users = [
    { id: shortid.generate(), name: 'Sterling Mount',  bio: 'The Best Pupperoni' }
]

// HELPER FUNCTIONS 
const User = {
    createNew(user) {
        const newUser = {
            ...user, 
            id: shortid.generate(),
        }
        users.push(newUser)
        return newUser
    },    
    getAll() {
        return users
    },
    getById(id) {
        return users.find(u => u.id === id)
    }, 
    delete(id) {
        const user = users.find(u => u.id === id)
        if (user) {
            users = users.filter(u => u.id !== id)
        } 
        return user
    },
    update(id, changes) {
        const user = users.find(u => u.id === id)
        if (!user) {
            return null
        } else {
            users = users.map(u => {
                if (u.id === id) {
                    return { id, ...changes }
                }
                return u
            })
            return { id, ...changes }
        }

    }
}

// ENDPOINTS 
server.post('/api/users', (req, res) => {
    // 1 - gather info from the request object
    const clientUser = req.body
    if (!clientUser.name || !clientUser.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        return
    }
    // 2 - interact with db
    const newUser = User.createNew(clientUser)
    // 3 - send to client an appropriate response
    if (newUser) {
        res.status(201).json(newUser)        
    } else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
})

server.get('/api/users', (req, res) => {
    // 1 - gather info from the request object
    // 2 - interact with db
    const users = User.getAll()
    // 3 - send to client an appropriate response
    if (users) {
        res.status(200).json(users)
    } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
})
server.get('/api/users/:id', (req, res) => {
    // 1 - gather info from the request object
    const { id } = req.params
    // 2 - interact with db
    const user = User.getById(id)
    // 3 - send to client an appropriate response
    try {
        if (!user) {
            res.status(500).json({ errorMessage: "The user information could not be retrieved." })        
        } else {
            res.status(200).json(user)
        } 
    }
    catch(err) {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })  
    }
})
server.delete('/api/users/:id', (req, res) => {
    // 1 - gather info from the request object
    const { id } = req.params
    // 2 - interact with db
    const deleted = User.delete(id)
    // 3 - send to client an appropriate response
    try {
        if (deleted) {
            res.status(200).json(deleted)
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }
    catch(err) {
        res.status(500).json({ errorMessage: "The user could not be removed" })
    }
})
server.put('/api/users/:id', (req, res) => {
    // 1 - gather info from the request object
    const changes = req.body
    if (!changes.name || !changes.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        return
    }
    const { id } = req.params
    // 2 - interact with db
    const updatedUser = User.update(id, changes)
    // 3 - send to client an appropriate response
    try {
        if (updatedUser) {
            res.status(200).json(updatedUser)
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    }
    catch(err) {
        res.status(500).json({ errorMessage: "The user information could not be modified." }) 
    }
})


// CATCH_ALL ENDPOINT
server.use('*', (req, res) => {
    // req represents the request from the client
    // res represents the response we build for the client
    res.status(404).json({ message: 'not found' })
  })
  
// START THE SERVER
server.listen(5000, () => {
console.log('listening on port 5000')
})
// BUILD YOUR SERVER HERE

module.exports = {}; // EXPORT YOUR SERVER instead of {}
// BUILD YOUR SERVER HERE
const express = require('express')

const User = require('./users/model')

const server = express()
server.use(express.json())

server.put('/api/users/:id', async (req, res) => {
    try {
        const possibleUser = await User.findById(req.params.id)
        if(!possibleUser) {
           return res.status(404).json({
                message: 'The user with the specified ID does not exist"'
            })
        } else {
             // Check if both name AND bio are provided
            if(!req.body.name||!req.body.bio) {
              return res.status(400).json({
                message: 'Please provide name and bio for the user',
            }) 
            } else {
              const updatedUser =  await User.update(
              req.params.id, 
              req.body,
              { new: true, runValidators: true } // Return updated doc & run validation

            )

              
             return res.status(200).json(updatedUser)
            }
        }
    } catch(err) {
        return res.status(500).json({
                message: "The user information could not be modified",
                err: err.message,
                stack: err.stack
            })
    }
})

server.delete('/api/users/:id', async (req, res) => {

    try{ 
        const possibleUser = await User.findById(req.params.id)
        if(!possibleUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist"'
            })
        } else{
            const deletedUser = await User.remove(possibleUser.id)
            res.status(200).json(deletedUser)
        }
    } catch(err) {
        res.status(500).json({
                message: "error deleting user",
                err: err.message,
                stack: err.stack
            })
    }
       
    
})

server.post('/api/users', (req, res) => {
    const user = req.body;

    if (!user.name || !user.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
         User.insert(user)
         .then(newUser => {
            res.status(201).json(newUser)  // ← Send back the created user
        })

        .catch(err => {
            res.status(500).json({
                message: "error creating user",
                err: err.message,
                stack: err.stack
            })
        })

    }    
})

server.get('/api/users', (req, res) => {
    console.log('getting all users')

    User.find()
    .then(users => {
        console.log(users)
        res.json(users)
        
    })
    .catch(err => {
        console.log()
        res.status(500).json({
            message:'error getting users',
            err: err.message,
            stack: err.stack,
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    

    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            res.status(404).json({
                message: "The user with the specified ID does not exist",
             })
        }
        
        res.json(user)
        
    })
    .catch(err => {
        console.log()
        res.status(500).json({
            message:'error getting user',
            err: err.message,
            stack: err.stack,
        })
    })
})





server.use((req, res) => {
    res.status(404).json({
        message:'not found'
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}

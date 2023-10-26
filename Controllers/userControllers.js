const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config()
const User = require('../models/user')
// resister
exports.userResister = (req, res) => {
    let flag = true
    for (let x in req.body) {
        if (!req.body[x]) {
            flag = false
            break
        }
    }
    if (flag == false) {
        return res.status(422).json({ error: "Please fill all the fields" })
    }
    User.findOne({ email: req.body.email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "Email is already taken" })
            }
            bcrypt.hash(req.body.password, 12)
                .then(hashedPass => {
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPass


                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "Credential saved successfully", user: user })
                            // console.log(user)
                        })
                        .catch(err => console.log(err))
                })
        })
        .catch(error => console.log(error))
}


exports.userSignin = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password" })
            }
            // console.log(savedUser)
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // return res.json({ message: "successfully logged in" })
                        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET)

                        const { _id, name, email } = savedUser
                        res.json({ token: token, user: { _id, name, email } })
                        // console.log(req.body)
                        

                    }
                    else {
                        return res.json({ error: "Invalid email or password" })
                    }
                })
        })
        .catch(err => console.log(err))
}



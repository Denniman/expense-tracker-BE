import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()


import { User } from '../model/UserModel.js'

// @desc    Register a user
// @route   POST /api/signup
// @access  Public

const AuthController = {
    signUp: async (req, res) => {
        const {name, email, password} = req.body

        try {
            if(!name || !email || !password) {
                return res.status(400)
                .json({status: 'failed', message: 'Input fields must be provided'})
            }


            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

            if(!isValid) {
                return res.status(400)
                .json({status: 'failed', message: 'Provide a valid email'})
            }

            const emailExist = await User.findOne({email})

            if(emailExist) {
                return res.status(400)
                .json({status: 'failed', message: 'user already exist'})
            }
     
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
     
            if(hash) {
                const newUser = new User({ name, email, password: hash})
                const savedUser = await newUser.save()
     
                if(savedUser) {
                    jwt.sign(
                        {id: savedUser._id},
                        process.env.SECRET,
                        {expiresIn: 3600},
                        (err, token) => {
                            if(err) {
                                throw err
                            }
     
                            res.status(200).json(
                                { 
                                     status: 'success',
                                     data: {
                                         token: "Bearer " + token,
                                         id: savedUser._id,
                                         name: savedUser.name,
                                         email: savedUser.email,
                                     }, 
                                     message: 'successful'
                                 })
                        }
                    )
                }
            }
     
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: 'server error'})
        }
        
    },

    login: async (req, res) => {
        const {email, password} = req.body

        try {

            if(!email || !password) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'email and password cannot be empty'
                })
            }

            const isUser = await User.findOne({email})

            if(!isUser) {
                return res
                .status(404)
                .json({status: 'failed', message: 'record not found'})
            }

            const match = await bcrypt.compare(password, isUser.password)

            if(!match) {
                return res
                .status(400)
                .json({status: 'failed', message: 'email or password is not correct'})
            }

            jwt.sign(
                { id: isUser._id },
                process.env.SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) {
                    throw err;
                  }
        
                  return res.status(200).json({
                    status: 'success',
                    data: {
                      token:"Bearer " + token,
                      id: isUser._id,
                      name: isUser.name,
                      email: isUser.email,
                    },
                    message: 'successful',
                  });
                }
              );    

            
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: 'server error'})
        }
    }
}

export default AuthController
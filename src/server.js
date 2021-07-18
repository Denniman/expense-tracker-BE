import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoute.js'

const app = express()


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get('/', (req, res) => {
    res.json({status: 'Success', message: 'Hello world'});
})

app.use('/api', userRouter)


export default app;
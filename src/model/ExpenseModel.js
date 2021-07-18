import mongoose from 'mongoose'

const {Schema, model, Types} = mongoose

const expenseSchema = new Schema({

    userId: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

export const expense = model('expense', expenseSchema) 
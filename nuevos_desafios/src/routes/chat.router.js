import {Router} from 'express';
import { messageModel } from '../dao/models/message.model.js';
import mongoose from "mongoose"
export const router = Router();

let users = []

router.get('/',(req, res) => {
    res.setHeader('Content-Type','text/html');
    res.status(200).render("chat");
})

export const chatSocket = (io, socket) => {
    socket.on('id', async(user) => {
        console.log(user)
    
        users.push({
            id: socket.id,
            user
        })
    
        socket.emit('welcome', await messageModel.find());
        socket.broadcast.emit('newUser', user)
    })

    socket.on('newMessage', async (msg) => {
        try {
            if (!msg.user || !msg.message)
                throw new Error("Invalid message: properties user and message are required");

            let resultado = await messageModel.create(msg);
            console.log(resultado);
            io.emit('messageRecieved', msg);
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('disconnect', () => {
        console.log(`Client with ID ${socket.id} has disconnected`)
        let index = users.findIndex(user => user.id === socket.id)
        let user = users[index]
        io.emit('userDisconnected', user)
        console.log(user)
        users.splice(index, 1)
    })
}

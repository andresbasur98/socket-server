import { Socket } from 'socket.io';
import socketIO from 'socket.io';


//Centralizamos la lógica de los sockets aqui

export const desconectar = ( cliente: Socket ) =>{
    cliente.on('disconnect', ()=>{
        console.log('Cliente desconectado');
    })
}

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', ( payload: {de: string, cuerpo: string} )=>{ //Escucho el mensaje del cliente
        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload) // Emito el mensaje a los demás usuarios de la aplicación desde el servidor
    })
}
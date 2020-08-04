import express from 'express';
import { SERVER_PORT } from '../global/enviroment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/sockets';

export default class Server{
    
    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT; // Lo importamos de las variables globales

        this.httpServer = new http.Server(this.app) // Necesitamos conectar socket.io con express para ello usamos de intermediario el httpserver
        this.io = socketIO( this.httpServer );
    
        this.escucharSockets();
    }

    public static get instance(){ // Patron singleton para evitar instanciar sin querer el socket.io otra vez
        return this._instance || (this._instance = new this());
    }

    private escucharSockets(){
        console.log('Escuchando');
        this.io.on('connection', cliente =>{
            // console.log('Cliente conectado');

            //Conectar Cliente
            socket.conectarCliente(cliente)
            
            //Configurar Usuarios
            socket.configurarUsuario(cliente, this.io);
           
            //Mensajes
            socket.mensaje(cliente, this.io);

            //Desconectar
            socket.desconectar(cliente);

        })
    }

    start(callback: any){
        this.httpServer.listen(this.port, callback);
    }

}
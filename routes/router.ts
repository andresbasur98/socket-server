import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { Socket } from 'socket.io';
import { usuariosConectados } from '../sockets/sockets';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!'
    })
})

router.post('/mensajes', (req: Request, res: Response) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
    }
    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload)

    res.json({
        ok: true,
        cuerpo,
        de
    })
})

router.post('/mensajes/:id', (req: Request, res: Response) => {

    const id = req.params.id;
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;  //instance es la misma instancia que tenemos creada en el server.ts para eso hicimos el instance
    server.io.in(id).emit('mensaje-privado', payload); // in para mandarlo a un cliente particular

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    })
})

// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', (req: Request, res: Response) => {
    const server = Server.instance;

    server.io.clients((err: any, clientes: string[]) => {
        if (err) {
           return res.json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            clientes
        })

    })
})

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {

    

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    })

});

export default router;
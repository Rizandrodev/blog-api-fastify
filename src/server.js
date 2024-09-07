import fastify from "fastify";
import { postsRoutes } from "./Routes/posts.js";

const app=fastify({
    logger:{
        transport:{
            target:'pino-pretty'
        }
    }
})

app.register(postsRoutes)
app.listen({
    port:3000,
    host:'0.0.0.0'
})
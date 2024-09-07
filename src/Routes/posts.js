import { isAuth } from "../middlewares/isauth.js"

const posts=[]
 
export async function postsRoutes(app){

    app.get('/posts',{onRequest:[isAuth]},(req,reply)=>{
        console.log(req.params)
        return reply.status(200).send(posts)
    })
    
    app.post('/posts',{onRequest:[isAuth]},(req,reply)=>{
        const {username,title,content}=req.body

        const post={
            id:posts.length+1,
            owner:username,
            title,
            content,
            date:new Date().toISOString(),
            comments:[],
            likes:[]
        }
        posts.push(post )
        reply.status(201).send(post)
    })

    app.post('/posts/:id/comment',{onRequest:[isAuth]},(req,reply)=>{
        const {id}=req.params

        const postIndex=posts.findIndex(post=>post.id === +id)
        
        if(postIndex===-1){
            return reply.status(404).send({message:'post not found'})
        }

        const {username,content}=req.body

        const comment={
            owner:username,
            content,
            date:new Date().toISOString(),
        }
        posts[postIndex].comments.push(comment)
        return reply.status(201).send(posts[postIndex])
    })

    app.patch('/posts/:id/like',{onRequest:[isAuth]},(req,reply)=>{
        const {id}=req.params

        const postIndex=posts.findIndex(post=>post.id === +id)
        
        if(postIndex===-1){
            return reply.status(404).send({message:'post not found'})
        }

        const {username,content}=req.body
        const likeIndex=posts[postIndex].likes.findIndex(item=>item===username)
        if(likeIndex>0){
            posts[postIndex].likes.slice(likeIndex,1)
            return reply.status(200).send(posts[postIndex])

        }
        
        posts[postIndex].likes.push(username)
        return reply.status(200).send(posts[postIndex])
    })

    app.delete('/posts/:id',{onRequest:[isAuth]},(req,reply)=>{
        const {id}=req.params

        const postIndex=posts.findIndex(post=>post.id === +id)
        
        const {username}=req.body

        if(username!=posts[postIndex].owner){
            return reply.status(400).send({message:"user is not post ownwe"})
        }
        posts.splice(postIndex,1)
        console.log(postIndex)
        return reply.status(204 ).send()
    })
}

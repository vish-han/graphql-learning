const express=require('express');
const {ApolloServer}=require('@apollo/server');
const {expressMiddleware}=require('@apollo/server/express4');
const cors=require('cors');
const bodyParser=require('body-parser')
const axios=require('axios');
async function startApolloServer(){
    const app=express();
    const server=new ApolloServer({
        typeDefs:`
        
        type User{
        id:ID!
        name:String!
        username:String!
        email:String!
        phone:String!
        website:String!
        }
        
        type Todo{
        id:ID!
        title:String!
        completed:Boolean
        }
        
        type Query{
        getTodos:[Todo],
        getUsers:[User],
        getUser(id: ID!):User
        }
        `,
        resolvers: {
            Query: {
                getTodos: async () => {
                    try {
                        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        return [];
                    }
                },
                getUsers:async ()=>{
                    try{
                        const response=await axios.get('https://jsonplaceholder.typicode.com/users')
                        return response.data;
                    }
                    catch (error){
                        console.error('Error fetching data',error);
                        return [];
                    }
                },
                getUser:async (parent,{id})=>{
                    try{
                        const response=await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
                        return response.data;
                    }
                    catch (error){
                        console.error('Error fetching data',error);
                        return [];
                    }
                }


            }
        }
    });

   app.use(cors());
   app.use(bodyParser.json())

   await server.start();

   app.use('/graphql',expressMiddleware(server));

   app.listen(8000,()=>{
       console.log('Server Started at Port 8000');
   })
}
startApolloServer();
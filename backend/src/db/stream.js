import {StreamChat} from 'stream-chat'
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.log('Stream API key or Secret is missing')
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

const upsertStreamUser = async(userData)=>{
    try {
        await streamClient.upsertUsers([userData]); // upsert means create or update
        return userData;
    } catch (error) {
        console.log("Error upserting Stream users: ", error)
    }
}


const generateStreamToken = async (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.log("Error generating Stream token: ", error)
        return null;
    }
}

export {upsertStreamUser, generateStreamToken}
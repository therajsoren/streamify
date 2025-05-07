import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";

const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}},
                {$id: {$nin: currentUser.friends}},
                {isOnboarded: true}
            ]
        })

        res.status(200).json(recommendedUsers)

    } catch (error) {
        console.log("Error in getRecommendedUsers controller", error.message);

        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends)

    } catch (error) {
        console.log("Error in getMyFriends controller", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const {id: recipientId} = req.params;

        // prevent sending friend request to yourself
        if(myId === recipientId){
            return res.status(400).json({
                message: "You cannot send a friend request to yourself"
            })
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({
                message: "Recipient not found"
            })
        }

        // check if user id is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({
                message: "You already have a friend request in pending status"
            })
        }

        // check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ],
        })
        if(existingRequest){
            return res.status(400).json({
                message: "A friend request already exists between you and this user"
            })
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        })

        res.status(201).json(friendRequest)

    } catch (error) {
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


const acceptFriendRequest = async (req, res) => {
    try {
        const {id: requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({
                message: "Friend request not found"
            })
        }

        // verify the current user is the recipient
        if(!friendRequest.recipient.toString() === req.user._id.toString()){
            return res.stats(403).json({
                message: "You are not authorized to accept this friend request"
            })
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to the other's friends list

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {
                friends: friendRequest.recipient
            }
        })

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {
                friends: friendRequest.sender
            }
        })

        res.status(200).json({
            success: true,
            message: "Friend request accepted"
        })

    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export {getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest};
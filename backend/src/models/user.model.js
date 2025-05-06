import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        maxlength: 128
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    }
}, {timestamps: true});


// pre hook
// this will be called before the document is saved to the database
// it will hash the password before saving it to the database

userSchema.pre("save", async (next)=> {
    if(!this.isModified("password")){
        return next();
    }
    
    try {   
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.matchPassword = async (enteredPassword) => {
    const isPasswordCorrect = await bcrypt.compare(enteredPassword,this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);

export {User};
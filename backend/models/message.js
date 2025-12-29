const mongoose = require('mongoose');



const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
            maxLength: 1000,
            trim: true,
            validate: {
                validator: function (v) {
                    return v && v.trim().length > 0;
                },
                message: "Message cannot be empty or whitespace only",
            },
        },
       
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;




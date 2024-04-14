const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    image:{
        type: String,
        default: 'https://img.freepik.com/free-photo/online-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.jpg?size=626&ext=jpg&ga=GA1.1.1803636316.1713052800&semt=sph'
    },
    views:{
        type: Number,
        default: 0
    },
    comments:{
        typa: Object,
        default: {}
    }
});

module.exports = mongoose.model('POST',postSchema);

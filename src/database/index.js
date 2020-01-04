var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECT_STRING, { useNewUrlParser: true });

var userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    allowance: {
        type: Number,
        required: true,
        default: 0,
    },
    allowanceInterval: {
        type: Number,
        required: true,
        default: 7 * 24 * 60 * 60,
    },
    allowanceBegan: Number,
    allowanceLastUpdate: Number,
    currency: String,
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    savings: {
        type: Number,
        required: true,
        default: 0,
    },
  });

var User = mongoose.model('User', userSchema);

async function getUserByDiscordId(discordId) {
    var user = await User.findOne({ discordId }).exec();
    if (!user) {
        user = new User({
            discordId
        });
        user = await user.execPopulate();
    }
    return user;
}

module.exports = {
    getUserByDiscordId,
}
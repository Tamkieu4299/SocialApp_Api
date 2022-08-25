const router = require("express").Router();
const Conversation = require("../models/Conversation");

// create conversation
router.post("/", async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get conversation of an user
router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});


// get conversation by Id
router.get("/", async (req, res) => {
    const convId = req.query.convId;
    try {
        const conv = await Conversation.findById(convId);
        res.status(200).json(conv);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get conversation includes 2 id
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: {
                $all: [req.params.firstUserId, req.params.secondUserId],
            },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;

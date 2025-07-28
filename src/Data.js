

export const Model_Photos = [
    require("./Images/photo1.jpg"),
    require("./Images/photo2.jpg"),
    require("./Images/photo3.jpg"),
    require("./Images/photo4.jpg"),
    require("./Images/photo5.jpg"),
    require("./Images/photo6.jpg"),
    require("./Images/photo8.jpg"),
    require("./Images/photo6.jpg"),
    require("./Images/photo5.jpg"),
    require("./Images/photo4.jpg"),
    require("./Images/photo3.jpg"),
    require("./Images/photo2.jpg"),
    require("./Images/photo1.jpg"),
    require("./Images/photo1.jpg"),
    require("./Images/photo2.jpg"),
    require("./Images/photo3.jpg"),
    require("./Images/photo4.jpg"),
    require("./Images/photo5.jpg"),
    require("./Images/photo6.jpg"),
    require("./Images/photo8.jpg"),
    require("./Images/photo2.jpg"),
    require("./Images/photo4.jpg"),
    require("./Images/photo5.jpg"),
    require("./Images/photo8.jpg"),
    require("./Images/photo3.jpg"),
    require("./Images/photo2.jpg"),
    require("./Images/photo1.jpg"),
    require("./Images/photo5.jpg"),
    require("./Images/photo8.jpg"),
]

export const Model_Details = [
    {
        photo: Model_Photos[0],
        username: "Luna Star",
        bio: "Fun and flirty,ready to chat!"
    },
    {
        photo: Model_Photos[1],
        username: "Ruby Flame",
        bio: "Bold and Captivating"
    },
    {
        photo: Model_Photos[2],
        username: "Nova Spark",
        bio: "Charming and Irresistable"
    },
    {
        photo: Model_Photos[3],
        username: "Ember Dawn",
        bio: "Fiery and Fun-Loving!"
    },
    {
        photo: Model_Photos[4],
        username: "Sable Night",
        bio: "Mysterious and alluring!"
    },
    {
        photo: Model_Photos[5],
        username: "Vixen Rose",
        bio: "Your Virtual Sweetheart"
    },
    {
        photo: Model_Photos[6],
        username: "Sky Belle",
        bio: "Playful and adventurous"
    },
    {
        photo: Model_Photos[7],
        username: "Jane Doe",
        bio: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer."
    },
]
export const Conversations = [
    {
        photo: Model_Photos[0],
        username: "Luna Star",
        lastMessage: "Fun and flirty,ready to chat!",
        timestamp: "11s"
    },
    {
        photo: Model_Photos[1],
        username: "Ruby Flame",
        lastMessage: "Bold and Captivating",
        timestamp: "40m"
    },
    {
        photo: Model_Photos[2],
        username: "Nova Spark",
        lastMessage: "Charming and Irresistable",
        timestamp: "4m"
    },
    {
        photo: Model_Photos[3],
        username: "Ember Dawn",
        lastMessage: "Fiery and Fun-Loving!",
        timestamp: "4m"
    },
    {
        photo: Model_Photos[4],
        username: "Sable Night",
        lastMessage: "Mysterious and alluring!",
        timestamp: "4m"
    },
    {
        photo: Model_Photos[5],
        username: "Vixen Rose",
        lastMessage: "Your Virtual Sweetheart",
        timestamp: "4m"
    },
    {
        photo: Model_Photos[6],
        username: "Sky Belle",
        lastMessage: "Playful and adventurous",
        timestamp: "4m"
    },
    {
        photo: Model_Photos[7],
        username: "Jane Doe",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "14m"
    },
    {
        photo: Model_Photos[5],
        username: "Jane Doe",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "4m"
    },
    {
        photo: Model_Photos[0],
        username: "Jane Doe",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "2m"
    },
    {
        photo: Model_Photos[1],
        username: "Jane Doe",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "11s"
    },
]

export const Messages = [
    {
        senderID: 0,
        messageType: 0,
        reaction: "❤️",
        lastMessage: "Fun and flirty,ready to chat!",
        timestamp: "9:30 AM"
    },
    {
        senderID: 1,
        messageType: 1,
        reaction: "❤️",
        lastMessage: "Bold and Captivating",
        timestamp: "9:30 AM"
    },
    {
        senderID: 0,
        messageType: 2,
        reaction: "❤️",
        lastMessage: "Charming and Irresistable",
        timestamp: "9:30 AM"
    },
    {
        senderID: 1,
        messageType: 0,
        reaction: "❤️",
        lastMessage: "Fiery and Fun-Loving!",
        timestamp: "4m"
    },
    {
        senderID: 0,
        messageType: 0,
        reaction: "❤️",
        lastMessage: "Mysterious and alluring!",
        timestamp: "9:30 AM"
    },
    {
        senderID: 1,
        messageType: 1,
        reaction: "❤️",
        lastMessage: "Your Virtual Sweetheart",
        timestamp: "9:30 AM"
    },
    {
        senderID: 0,
        messageType: 0,
        reaction: "❤️",
        lastMessage: "Playful and adventurous",
        timestamp: "9:30 AM"
    },
    {
        senderID: 1,
        messageType: 2,
        reaction: "❤️",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "9:30 AM"
    },
    {
        senderID: 0,
        messageType: 0,
        reaction: "❤️",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "9:30 AM"
    },
    {
        senderID: 1,
        messageType: 0,
        reaction: "❤️",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "9:30 AM"
    },
    {
        senderID: 0,
        messageType: 0,
        reaction: "❤️",
        lastMessage: "Model. Entrepreneur. Nature lover. Photographer. Cat mom. Dreamer.",
        timestamp: "9:30 AM"
    },
]

export const Links = [
    {
        link: "Models",
        navigation:"home",
        icon: <i class="uil uil-18-plus"></i>
    },
    {
        link: "Search",
        navigation:"search",
        icon: <i class="uil uil-search"></i>
    },
    {
        link: "Messages",
        navigation:"messages",
        icon: <i class="uil uil-chat"></i>
    },
    {
        link: "Profile",
        navigation:"profile",
        icon: <i class="uil uil-user"></i>
    },

]
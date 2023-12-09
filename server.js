const Express = require("express");
const bodyParser = require("body-parser");
var admin = require("firebase-admin");

var serviceAccount = require("./reactnativepushapp-75f35-firebase-adminsdk-2vl1u-a9c47bf51b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let token;

const app = new Express();
const router = Express.Router();

app.use(bodyParser.json());
app.use("/", router);

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});

router.post("/register", (req, res) => {
    token = req.body.token;
    res.status(200).json({ message: "Successfully registered FCM Token!" });
});


router.post("/notifications", async (req, res) => {
    try {
        token = token;
        const { title, body, imageUrl } = req.body;
        await admin.messaging().send({
            token: token,
            data: {
                customData: "Daniel",
                id: "1",
                ad: "Dan Matula",
                subtitle: "Mesaj de pe Node.js"
            },
            android: {
                notification: {
                    body: "Push notification complex pentru date",
                    title: "Node Message",
                    color: "#fff566",
                    priority: "high",
                    sound: "default",
                    vibrateTimingsMillis: [200, 500, 800],
                    imageUrl: "https://plus.unsplash.com/premium_photo-1701075032615-1b6867a46d3c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
            }
        }).then((msg) => {
            console.log(msg)
        });
        res.status(200).json({ message: "Successfully sent notifications!" });
    } catch (err) {
        res
            .status(err.status || 500)
            .json({ message: err.message || "Something went wrong!" });
    }
});
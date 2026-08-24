// Entry point: boots the real server.
import app from './app.js';

app.listen(process.env.PORT || 3001, () => {
    console.log("Server started");
})

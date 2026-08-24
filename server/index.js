// Entry point: boots the real server. Tests never import this file directly —
// they import app.js instead, so they never actually bind to a port.
import app from './app.js';

app.listen(process.env.PORT || 3001, () => {
    console.log("Server started");
})

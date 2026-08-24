import request from 'supertest';
import app from "../app.js"

test("api health check route works", done => {
    request(app)
        .get("/api/health")
        .expect("Content-Type", /json/)
        .expect(200, done)
});

test("recommend route behaves with empty moods with 400 status code", done => {
    request(app)
        .post("/api/recommend")
        .send({})
        .expect(400, done)
})

test("recommend route works with non-empty moods", done => {
    // note this test right now does make actual calls to the API's, need mock functions later on
    request(app)
        .post("/api/recommend")
        .send({ moods: ["Cozy", "Mind-Bending", "Thrilling"]})
        .expect("Content-Type", /json/)
        .expect(200, done)
})
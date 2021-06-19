import express from "express"

const app = express()
const { PORT } = process.env
app.get('/', (request, response) => {
  response.send('Hello world!');
});
app.listen(PORT, () => console.log(`Running on port ${PORT}`))
const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 3001;
const envelopeRouter = require("./routes/envelope");
app.use(express.json());
app.use(morgan("tiny"));
app.use("/envelopes", envelopeRouter);

app.listen(PORT, (err) => {
  console.log(`Server started on PORT : ${PORT}`);
});

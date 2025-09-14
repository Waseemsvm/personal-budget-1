const express = require("express");
const app = express();
const PORT = 3001;

app.listen(PORT, (err) => {
  console.log(`Server started on PORT : ${PORT}`);
});

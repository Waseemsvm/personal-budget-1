const express = require("express");
const envelopeRouter = express.Router();
let envelopes = require("../model/data.json");
const findEnvelopeById = (id) => {
  return envelopes.find((envelope) => envelope.id === id);
};
envelopeRouter.get("/", (req, res, next) => {
  res.send(envelopes);
});

envelopeRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) return res.sendStatus(404);
  const envelope = findEnvelopeById(Number(id));
  if (!envelope) return res.sendStatus(404);
  res.send(envelope);
});

envelopeRouter.post("/", (req, res, next) => {
  const { id, title, budget } = req.body;
  if (!id && !title && !budget) return res.sendStatus(400);
  const envelope = { id, title, budget };
  envelopes.push(envelope);
  res.status(201).send(envelopes);
});

envelopeRouter.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  if (isNaN(id)) return res.sendStatus(404);
  const envelope = findEnvelopeById(Number(id));
  if (!envelope) return res.sendStatus(404);
  if (envelope.title !== body.title) envelope.title = body.title;
  if (envelope.budget !== Number(body.budget))
    envelope.budget = Number(body.budget);
  res.status(201).send(envelope);
});

envelopeRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  if (isNaN(id)) return res.sendStatus(404);
  envelopes = envelopes.filter((envelope) => envelope.id !== Number(id));
  return res.sendStatus(204);
});

envelopeRouter.post("/:from/:to", (req, res, next) => {
  const from = req.params.from;
  const fromEnvelope = findEnvelopeById(Number(from));
  const to = req.params.to;
  const toEnvelope = findEnvelopeById(Number(to));
  const { amount } = req.body;

  if (!fromEnvelope && !toEnvelope)
    return res
      .status(400)
      .json({ error: "One or both of the envelopes are not found" });

  if (!amount || typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ error: "Amount must be a positive number" });

  if (fromEnvelope.budget <= amount) {
    return res.status(400).json({
      error: "Insuffient funds in the source envelope",
      available: fromEnvelope.budget,
      requested: amount,
    });
  }

  fromEnvelope.budget -= amount;
  toEnvelope.budget += amount;

  res.json({
    message: "Transfer successful",
    from: fromEnvelope,
    to: toEnvelope,
    amount: amount,
  });
});

module.exports = envelopeRouter;

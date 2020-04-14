const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middlewares

function validateId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({
      error: "Invalid Repository Id",
    });
  }
  return next();
}

// *** Rotas *** //

// List
app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

// Create
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

// Update
app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  let repoIndex = repositories.findIndex((repo) => repo.id === id);
  let repository = repositories.find((repo) => repo.id === id);

  if (!repository || repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const { likes } = repository;

  repository = { id, title, url, techs, likes };
  repositories[repoIndex] = repository;

  return response.status(202).json(repository);
});

// Delete
app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

// Increment Like
app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;

const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4")

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  if (repositories.length <= 0){
    return response.status(400).json({error: 'There are no repositories'})
  }

  //retorna a resposta como json
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body //recebe o title, a url e as techs do corpo da requisição

  //objeto que será enviado
  const repository = { id: uuid(), url, title, techs, likes: 0 }

  //envia o objeto para o array repositories 
  repositories.push(repository) 

  //retorna a responso em formato json
  return response.json(repository) 
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params // requisita o parametro id
  const { title, url, techs} = request.body // pega os parametros do body

  // procura o repositorio
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  // se o index for menor que 0 retorna um erro
  if(repositoryIndex < 0){
    return response.status(400).send()
}

  // objeto que sera enviado
  const repository = { id, url, title, techs, likes: 0 }

  // o array repositories recebe os params de repository de acordo com o index
  repositories[repositoryIndex] = repository

  // retorna a resposta como json
  return response.status(200).json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params // requisita o parametro id

  // procura o repositorio
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  // se o index for menor que 0 retorna um erro
  if(repositoryIndex < 0){
        return response.status(400).json({error: 'Repository not found'})
  }

  //remove o repositorio
  repositories.splice(repositoryIndex, 1)

  //retorna um status code de sucesso
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params // requisita o parametro id

  // procura o repositorio
  const repository = repositories.find(repository => repository.id === id)

  // se nao tiver repositorio retorna um erro
  if(!repository){
        return response.status(400).send()
  }

  //adiciona um like
  repository.likes += 1

  //retorna a resposta em formato json
  return response.json(repository) 
});

module.exports = app;
# Docker, Node.js, CI e Kubernetes.

Dockerizar uma aplicação em node e gerar o build no DockerHub utilizando o GitHub Actions como CI com o seguinte fluxo:
 
- Push GitHub
- Docker Build
- Push da imagem Docker para o DockerHub

# Configurar o CI

- É preciso criar o arquivo docker-image.yml em .github/workflows para iniciar o CI do GitHub usando o GitHub Actions.

```
name: Docker Image CI

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Login to DockerHub Registry
      run: echo ${{ secrets.DOCKERHUB_PASSWORD }} | docker login -u ${{ secrets.DOCKERHUB_USERNAME }} --password-stdin
    - name: Build the latest Docker image
      run: docker build app/ --file Dockerfile --tag stenionljunior/node:latest
    - name: Push the latest Docker image
      run: docker push stenionljunior/node:latest
```
No seu repositório, clicar em Settings -> Secrets e configurar duas secrects com seu nome de usuário do DockerHub (DOCKERHUB_USERNAME) e outra com a senha (DOCKERHUB_PASSWORD). Essas secrets foram referenciadas no step "Login to DockerHub Registry"


Com a imagem disponível no DockerHub, iremos orquestrar utilizando o Kubernetes executando os comandos abaixo no master do cluster K8S:


- Criar o deployment com a imagem que foi gerada no DockerHub a partir do CI:
```
kubectl create deployment node-deployment --image=stenionljunior/node:latest
```


- Escalar a quantidade de réplicas do deployment para 3 réplicas:
```
kubectl scale --replicas 3 deployment node-deployment
```


- Criar o service para acessar o pod que está rodando a aplicação.
```
kubectl expose deployment node-deployment --port=3000 --type=NodePort
```

- Identificar a porta alocada e executa uma solicitação HTTP.

```
export PORT=$(kubectl get svc node-deployment -o go-template='{{range.spec.ports}}{{if .nodePort}}{{.nodePort}}{{"\n"}}{{end}}{{end}}')
echo "Accessing host01:$PORT"
```



- Executar o comando curl abaixo que terá como saída a mensagem "Bem-vindo..."

```
curl host01:$PORT
```

Na pasta k8s temos os manifestos no formato yaml caso prefira executar de forma declarativa.


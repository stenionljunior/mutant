# Docker, Node.js, CI e Kubernetes.

Dockerizar uma aplicação simples em node e gerar o build no DockerHub utilizando o GitHub Actions como CI com o seguinte fluxo:
 
- Push GitHub
- Docker Build
- Push da imagem Docker para o DockerHub

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


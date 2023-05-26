# API - Banco Digital

uma api criada como projeto em dupla.

`API crianda utilizando os padrões RESTful`

## Status Code

Abaixo, listamos os possíveis `status code` esperados como resposta da API.

```javascript
// 200 = requisição bem sucedida
// 201 = requisição bem sucedida e algo foi criado
// 400 = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 404 = o servidor não pode encontrar o recurso solicitado
// 500 = erro interno do servidor
```

### Listar contas bancárias

#### `GET` `/contas?senha_banco=123`

#### Exemplo de retorno

```javascript
// 2 contas encontradas
[
    {
        numero: "1",
        saldo: 0,
        usuario: {
            nome: 'Foo Bar',
            cpf: '00011122233',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'foo@bar.com',
            senha: '1234'
        }
    },
    {
        numero: "2",
        saldo: 1000,
        usuario: {
            nome: 'Foo Bar 2',
            cpf: '00011122234',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'foo@bar2.com',
            senha: '12345'
        }
    }
]

// nenhuma conta encontrada
[]
```

### Criar conta bancária

#### `POST` `/contas`

- Entradas

  - Nome
  - Cpf
  - Data Nascimento
  - Telefone
  - Email
  - Senha

- Saída

  - Dados usuário
  - Número da conta
  - Saldo

#### Saída

```javascript
// HTTP Status 201
{
    numero:  "1",
    saldo: 0,
    usuario: {
        nome: 'Foo Bar',
        cpf: '00011122233',
        data_nascimento: '2021-03-15',
        telefone: '71999998888',
        email: 'foo@bar.com',
        senha: '1234'
    }
}

// HTTP Status 400, 404
{
    mensagem: 'Mensagem do erro!'
}
```

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

- Entradas

  - Nome
  - Cpf
  - Data Nascimento
  - Telefone
  - Email
  - Senha

- Saída

  - Sucesso ou erro

#### Função

```javascript
function atualizarUsuarioConta(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  mensagem: "Conta atualizada com sucesso!";
}

// HTTP Status 400, 404
{
  mensagem: "Mensagem do erro!";
}
```

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

- Entradas

  - Numero da conta bancária (passado como parâmetro na rota)

- Saida

  - Sucesso ou erro

#### Função

```javascript
function excluirConta(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  mensagem: "Conta excluída com sucesso!";
}

// HTTP Status 400, 404
{
  mensagem: "Mensagem do erro!";
}
```

### Depositar

#### `POST` `/transacoes/depositar`

- Entrada

  - Número da conta
  - Valor

- Saida

  - Sucesso ou erro

#### Função

```javascript
function depositar(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  mensagem: "Depósito realizado com sucesso!";
}

// HTTP Status 400, 404
{
  mensagem: "Mensagem do erro!";
}
```

#### Exemplo do registro de um depósito

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta: "1",
    valor: 10000
}
```

### Sacar

#### `POST` `/transacoes/sacar`

- Entrada

  - Número da conta
  - Valor
  - Senha

- Saída

  - Sucesso ou erro

#### Função

```javascript
function sacar(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  mensagem: "Saque realizado com sucesso!";
}

// HTTP Status 400, 404
{
  mensagem: "Mensagem do erro!";
}
```

#### Exemplo do registro de um saque

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta: "1",
    valor: 10000
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

- Entrada

  - Número da conta (origem)
  - Senha da conta (origem)
  - Valor
  - Número da conta (destino)

- Saída

  - Sucesso ou erro

#### Função

```javascript
function tranferir(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  mensagem: "Transferência realizada com sucesso!";
}

// HTTP Status 400, 404
{
  mensagem: "Mensagem do erro!";
}
```

#### Exemplo do registro de uma transferência

```javascript
{
    data: "2021-08-10 23:40:35",
    numero_conta_origem: "1",
    numero_conta_destino: "2",
    valor: 10000
}
```

### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

- Entrada (query params)

  - Número da conta
  - Senha

- Saída

  - Saldo da conta

#### Função

```javascript
function saldo(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  saldo: 13000;
}

// HTTP Status 400, 404
{
  mensagem: "Mensagem do erro!";
}
```

### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

- Entrada (query params)

  - Número da conta
  - Senha

- Saída
  - Relatório da conta

#### Função

```javascript
function extrato(...) {
    //
}
```

#### Saída

```javascript
// HTTP Status 200
{
  depositos: [
    {
      data: "2021-08-18 20:46:03",
      numero_conta: "1",
      valor: 10000
    },
    {
      data: "2021-08-18 20:46:06",
      numero_conta: "1",
      valor: 10000
    }
  ],
  saques: [
    {
      data: "2021-08-18 20:46:18",
      numero_conta: "1",
      valor: 1000
    }
  ],
  transferenciasEnviadas: [
    {
      data: "2021-08-18 20:47:10",
      numero_conta_origem: "1",
      numero_conta_destino: "2",
      valor: 5000
    }
  ],
  transferenciasRecebidas: [
    {
      data: "2021-08-18 20:47:24",
      numero_conta_origem: "2",
      numero_conta_destino: "1",
      valor: 2000
    },
    {
      data: "2021-08-18 20:47:26",
      numero_conta_origem: "2",
      numero_conta_destino: "1",
      valor: 2000
    }
  ]
}

// HTTP Status 400, 404
{
    mensagem: 'Mensagem do erro!'
}
```

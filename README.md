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

#### `PUT` `/contas/atualizar/:numeroConta`

- Entradas

  - Nome
  - Cpf
  - Data Nascimento
  - Telefone
  - Email
  - Senha

- Saída

  - Sucesso ou erro

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

#### `DELETE` `/contas/deletar/:numeroDaConta`

- Entradas

  - Numero da conta bancária (passado como parâmetro na rota)

- Saida

  - Sucesso ou erro

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
    numeroContaOrigem: "1",
    numeroContaDestino: "2",
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

#### Saída

```javascript
// HTTP Status 200
{
  balance: 13000;
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

#### Saída

```javascript
// HTTP Status 200
{
	"deposits": [
		{
			"date": "2023-30-04  10:23:7",
			"numberAccount": 1,
			"value": 10000
		}
	],
	"withdrawals": [
		{
			"date": "2023-04-05  15:51:42",
			"numberAccount": 1,
			"value": 200
		}
	],
	"transferenciasEnviadas": [
		{
			"date": "2023-30-04  10:24:38",
			"numberAccountOrigin": 1,
			"numberAccountDestiny": 2,
			"value": 400
		}
	],
	"transferenciasRecebidas": [
		{
			"date": "2023-30-04  10:24:51",
			"numberAccountOrigin": 2,
			"numberAccountDestiny": 1,
			"value": 400
		}
	]
}

// HTTP Status 400, 404
{
    mensagem: 'Mensagem do erro!'
}
```

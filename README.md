# Controle de Slides com Flutter e NodeJS via WebSocket

Este projeto permite controlar um **Slideshow** (ou qualquer outro software) à distância, simulando movimentos de **mouse** e **teclado** através de um aplicativo Flutter conectado via **WebSocket** a um servidor NodeJS. O app Flutter utiliza os sensores de **acelerômetro** e **giroscópio** do dispositivo para detectar movimentos, proporcionando uma experiência fluida para navegar entre slides ou realizar ações remotamente.

## Funcionalidades

- Controle remoto de apresentações de slides.
- Simulação de movimentos do mouse e ações do teclado.
- Conexão em tempo real entre o **NodeJS** e o aplicativo **Flutter** via **WebSocket**.
- Utilização dos sensores de **acelerômetro** e **giroscópio** para detectar movimentos.
- Ideal para quem precisa controlar apresentações enquanto está longe do dispositivo.

## Requisitos

### Servidor (NodeJS)

- Node.js (v14.x ou superior)
- WebSocket
- Bibliotecas para simulação de mouse e teclado

### Aplicativo (Flutter)

- Flutter SDK (v2.0 ou superior)
- Plugin `sensors_plus` para acesso aos sensores do dispositivo
- WebSocket para comunicação com o servidor

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/cl0v/tv-controller
cd tv-controller
```

### 2. Configuração do Servidor NodeJS

Instale as dependências do NodeJS:

```bash
cd nodejs
npm install
```

### 3. Inicie o Servidor WebSocket

```bash
npm run start
```

### 4. Configuração do Aplicativo Flutter

Certifique-se de que o Flutter está instalado e as dependências estão configuradas:

```bash
cd flutter
flutter pub get
```

### 5. Execute o Aplicativo Flutter

Conecte um dispositivo ou use o emulador para rodar o app:

```bash
flutter run
```

## Como Funciona

### Servidor NodeJS

O servidor NodeJS recebe comandos do aplicativo Flutter via WebSocket e simula as ações de mouse e teclado no sistema host. Dependendo dos dados enviados pelo acelerômetro e giroscópio, o servidor realiza as seguintes ações:

- **Movimento do Mouse**: Com base na inclinação e movimento do dispositivo.
- **Avanço/Retrocesso de Slide**: Utilizando gestos ou inclinações específicas do dispositivo para enviar comandos de teclado (ex.: teclas `seta para esquerda` e `seta para direita`).

### Aplicativo Flutter

O aplicativo coleta os dados de movimento através dos sensores (acelerômetro/giroscópio) e envia esses dados para o servidor NodeJS via WebSocket. O servidor interpreta esses dados e os transforma em comandos de mouse/teclado.

## Exemplos de Uso

### Movimento para a Esquerda/Direita

- Incline o dispositivo para a esquerda para simular o pressionamento da **seta para a esquerda**.
- Incline o dispositivo para a direita para simular o pressionamento da **seta para a direita**.

### Movimento do Mouse

- Movimentos suaves no eixo **X** ou **Y** do giroscópio podem ser usados para mover o cursor do mouse.

## Capturas de tela
![Exemplo de uso](/screenshots/output.gif)

## Tecnologias Utilizadas

- **NodeJS**: Para gerenciar o servidor WebSocket e controlar as ações de mouse e teclado.
- **WebSocket**: Para comunicação em tempo real entre o servidor e o app Flutter.
- **Flutter**: Para capturar dados do acelerômetro e giroscópio e enviar ao servidor.
- **sensors_plus**: Plugin Flutter para acessar sensores como o acelerômetro e giroscópio.
- **robotjs**: Biblioteca NodeJS para simular ações de mouse e teclado.

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça um push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Buy me a Coffee

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/cl0v">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## Licença

Este projeto está licenciado sob a [Licença Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Contato

Caso tenha dúvidas ou sugestões, sinta-se à vontade para abrir uma **issue** ou entrar em contato pelo [LinkedIn](https://www.linkedin.com/in/marcelo-fernandes-viana-a49311329/).

### Estrutura do Projeto:

- **nodejs/**: Contém o código do servidor NodeJS.
- **flutter/**: Contém o código do aplicativo Flutter.

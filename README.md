# Maze Solver Game

## Descrição

Este projeto é um jogo de labirinto gerado aleatoriamente em JavaScript. O objetivo é explorar diferentes métodos para encontrar um caminho da entrada até a saída do labirinto. O jogo oferece duas opções de solução automática: um algoritmo correto que encontra o caminho mais curto e um algoritmo de backtracking que tenta soluções de forma aleatória.

---

## Funcionalidades

- **Geração automática de labirinto** com paredes externas e internas aleatórias.
- **Visualização do labirinto** e movimentação animada do solucionador.
- Dois modos de solução:
  - **Solução correta**: encontra o caminho mais curto usando busca em largura (BFS).
  - **Solução errada**: resolve usando backtracking com tentativas aleatórias.
- Contador de **movimentos** e **tempo** de resolução.
- Modal de vitória exibindo o tempo e movimentos finais.
- Botões para **iniciar a solução correta**, **iniciar a solução errada** e **resetar o jogo**.

---

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno.
2. O labirinto será gerado automaticamente.
3. Use os botões:
   - **Solução correta**: o jogo resolve automaticamente com o caminho ideal.
   - **Solução errada**: o jogo tenta resolver com backtracking aleatório.
   - **Resetar**: reinicia o labirinto e zera os contadores.
4. Após completar, um modal exibirá o tempo e os movimentos feitos.

---

## Estrutura do projeto

- **MazeGenerator**: Classe responsável pela criação do labirinto.
- **Game**: Classe que gerencia a lógica do jogo, animação, timer, movimentos, e interação com o DOM.
- **HTML/CSS**: Estrutura e estilo da interface do usuário.
- **JavaScript**: Lógica completa do jogo e interação.

---

## Tecnologias

- JavaScript (ES6+)
- HTML5
- CSS3

---

## Responsividade

Este projeto é totalmente responsivo, oferecendo uma boa experiência de uso tanto em dispositivos desktop quanto em dispositivos móveis.

---

## Licença

Este projeto é aberto e gratuito para uso e modificação.

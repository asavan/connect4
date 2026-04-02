# Connect4

### Four in row column or diagonaly.

[![Test covered](https://github.com/asavan/connect4/actions/workflows/static.yml/badge.svg)](https://github.com/asavan/connect4/actions/workflows/static.yml)
[![google play](https://img.shields.io/endpoint?color=green&logo=google-play&logoColor=green&url=https%3A%2F%2Fplay.cuzi.workers.dev%2Fplay%3Fi%3Dru.asavan.connect4%26gl%3DUS%26hl%3Den%26l%3D%24name%26m%3D%24version)](https://play.google.com/store/apps/details?id=ru.asavan.connect4)


## Demo
play                                          |  win                        
:--------------------------------------------:|:-------------------------:
![Play](/screenshots/screen1.jpg "play")      |  ![Win](/screenshots/screen2.jpg "Win")


## Доработки
- [x] Сделать честные "дырки" https://codepen.io/wteja/pen/jePLZr/
- [x] Кнопка рестарта после окончания раунда
- [x] Добавить AI
- [x] Анимация падения последнего диска
- [ ] Меню и кнопка выключения звука


### Собрать webassembly module
```bash
emcc -s EXPORT_ES6=1 -s ENVIRONMENT=worker -s EXPORTED_FUNCTIONS="['_init','_getBestMove','_playMove','_resetBoard','_getBoardState','_isGameOver']" -s EXPORTED_RUNTIME_METHODS="['cwrap']" -o connect4_solver.js connect4_solver.cpp
```

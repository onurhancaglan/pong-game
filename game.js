var gameStart = function () {
    var CONSTS = {
        gameSpeed: 20,
        side: 1,
        game: 0,
        playerTurn: 1,
        player1Hit: true,
        player2Hit: true
    };

    var arena = {
        CSS: {
            width: 900,
            height: 600,
            background: '#ADEFD1FF',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        }
    };

    var line = {
        CSS: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #00203FFF',
            position: 'absolute',
            top: 0,
            left: '50%'
        }
    };

    var player1 = {
        speed: 0,
        score: 0,
        CSS: {
            left: 0,
            top: 255,
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#00203FFF'
        }
    };

    var player2 = {
        speed: 0,
        score: 0,
        CSS: {
            top: 255,
            right: 0,
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#00203FFF'
        }
    };

    var player1Score = {
        CSS: {
            top: 100,
            left: 200,
            color: '#00203FFF',
            position: 'absolute',
            fontSize: 100
        }
    };

    var player2Score = {
        CSS: {
            top: 100,
            right: 200,
            position: 'absolute',
            color: '#00203FFF',
            fontSize: 100
        }
    };

    var winnerText = {
        CSS: {
            width: 300,
            height: 100,
            position: 'absolute',
            top: 250,
            left: 300,
            color: 'black',
            fontSize: '30px',
            textShadow: '-7px 9px 7px black',
            textAlign: 'center'
        }
    }

    var newGameButton = {
        CSS: {
            width: '150px',
            height: '30px',
            position: 'absolute',
            top: '338px',
            left: '375px',
            borderRadius: '50px',
            color: 'white',
            background: 'rgb(0, 32, 63)'
        }
    }

    var ball = {
        topSpeed: 0,
        leftSpeed: 0,
        acceleration: 14,
        CSS: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 50,
            background: '#00203FFF'
        },
        roll: function () {
            if (player1.score === 5 || player2.score === 5) {
                CONSTS.game = 0;

                $('#score-player-2').text(player2.score);
                $('#score-player-1').text(player1.score);

                draw.drawItemTo('div', 'winner-text', winnerText.CSS, '#pong-game',
                    'WİNNER ' + (player1.score === 5 ? 'PLAYER 1' : 'PLAYER 2'));
                draw.drawItemTo('button', 'btn-new-game', newGameButton.CSS, '#pong-game', 'NEW GAME');
            } else {
                ball.CSS.top = Math.random() < 0.5 ? 0 : arena.CSS.height - ball.CSS.height;
                ball.CSS.left = 450 - ball.CSS.width / 2;

                CONSTS.player1Hit = true;
                CONSTS.player2Hit = true;

                //BALL DİRECTION 
                if (CONSTS.game === 0) {
                    CONSTS.game = 1;

                    if (Math.random() < 0.5) {
                        CONSTS.playerTurn = -1;
                    }
                }

                $('#score-player-2').text(player2.score);
                $('#score-player-1').text(player1.score);

                var angle = 0;

                if (ball.CSS.top === 0) {
                    angle = CONSTS.playerTurn === -1 ? Math.random() * 60 + 10 : Math.random() * 60 + 280;
                } else {
                    angle = CONSTS.playerTurn === -1 ? Math.random() * 60 + 100 : Math.random() * 60 + 200;
                }

                var rads = angle * Math.PI / 180;
                var ballTopAngle = Math.cos(rads);
                var ballLeftAngle = Math.sin(rads);

                ball.topSpeed = ball.acceleration * ballTopAngle;
                ball.leftSpeed = ball.acceleration * -ballLeftAngle;
            }
        }
    };

    var draw = {
        drawItemTo: function (type, id, css, appendTo, text) {
            $('<' + type + '/>', {
                id: id,
                text: text
            }).css(css).appendTo(appendTo);
        },
        drawGameItems: function () {
            this.drawItemTo('div', 'pong-game', arena.CSS, 'body');
            this.drawItemTo('div', 'pong-line', line.CSS, '#pong-game');
            this.drawItemTo('div', 'pong-ball', ball.CSS, '#pong-game');
            this.drawItemTo('div', 'player-1', player1.CSS, '#pong-game');
            this.drawItemTo('div', 'player-2', player2.CSS, '#pong-game');
            this.drawItemTo('div', 'score-player-2', player2Score.CSS, '#pong-game', player2.score);
            this.drawItemTo('div', 'score-player-1', player1Score.CSS, '#pong-game', player1.score);
        }
    }

    var game = {
        stickAnger: function () {
            if (player1.CSS.top <= 0) {
                $('#player-1').css('top', 0);
                player1.CSS.top = 0;
            }

            if (player1.CSS.top + player1.CSS.height >= arena.CSS.height) {
                $('#player-1').css('top', arena.CSS.height - player1.CSS.height);
                player1.CSS.top = arena.CSS.height - player1.CSS.height;
            }

            if (player2.CSS.top <= 0) {
                $('#player-2').css('top', 0);
                player2.CSS.top = 0;
            }

            if (player2.CSS.top + player2.CSS.height >= arena.CSS.height) {
                $('#player-2').css('top', arena.CSS.height - player2.CSS.height);
                player2.CSS.top = arena.CSS.height - player2.CSS.height;
            }
        },
        loop: function () {
            window.pongLoop = setInterval(function () {
                if (CONSTS.game !== 0) {
                    player1.CSS.top += player1.speed;
                    $('#player-1').css('top', player1.CSS.top);

                    player2.CSS.top += player2.speed;
                    $('#player-2').css('top', player2.CSS.top);

                    game.stickAnger();

                    ball.CSS.top += ball.topSpeed;
                    ball.CSS.left += ball.leftSpeed;

                    //COlLİSİON
                    if (player1.CSS.top <= ball.CSS.top + ball.CSS.height / 1 && ball.CSS.top + ball.CSS.height / 1 <=
                        (player1.CSS.top + player1.CSS.height) + ball.CSS.width && ball.CSS.left + ball.CSS.width <=
                        player1.CSS.width + ball.CSS.width && CONSTS.player2Hit) {
                        ball.leftSpeed = ball.leftSpeed * -1;

                        CONSTS.player1Hit = true;
                        CONSTS.player2Hit = false;
                    }

                    if (player2.CSS.top <= ball.CSS.top + ball.CSS.height / 8 &&
                        ball.CSS.top + ball.CSS.height / 8 <= player2.CSS.top + player2.CSS.height &&
                        ball.CSS.left + ball.CSS.width >= arena.CSS.width - player2.CSS.width &&
                        CONSTS.player1Hit) {
                        ball.leftSpeed = ball.leftSpeed * -1;

                        CONSTS.player1Hit = false;
                        CONSTS.player2Hit = true;
                    }

                    //STİCK HALF COLLISION
                    // if (player1.CSS.top + player1.CSS.height / 2 <= ball.CSS.top + ball.CSS.height &&
                    //     ball.CSS.left <= player1.CSS.width) {
                    //     ball.topSpeed = ball.topSpeed;
                    // }

                    // if (ball.CSS.top + ball.CSS.height < (player1.CSS.top + player1.CSS.height) - player1.CSS.height / 2 &&
                    //     ball.CSS.left <= player1.CSS.width) {
                    //     ball.topSpeed = ball.topSpeed;
                    // }

                    $('#pong-ball').css({
                        left: ball.CSS.left,
                        top: ball.CSS.top
                    });

                    //BOUNCA TOP BOTTOM
                    if (ball.CSS.top <= 0 ||
                        ball.CSS.top >= arena.CSS.height - ball.CSS.height) {
                        ball.topSpeed = ball.topSpeed * -1;
                    }

                    // BALL OUT OF BOUNDS | SCORE
                    if (ball.CSS.left > arena.CSS.width) {
                        CONSTS.playerTurn = 1;
                        player1.score++;

                        ball.roll();
                    } else if (ball.CSS.left <= 0) {
                        CONSTS.playerTurn = -1;
                        player2.score++;

                        ball.roll();
                    }
                }
            }, CONSTS.gameSpeed);
        }
    }

    var storage = {
        //TODO
        saveGame: function () {
            localStorage.setItem('save-game-data', JSON.stringify({
                ball,
                player1Score,
                player2Score,
                player2,
                player1,
                CONSTS
            }));
        },
        loadGame: {
            getGameData: function () {
                return JSON.parse(localStorage.getItem('save-game-data'));
            },
            setGameData: function (loadGameData) {
                ball = loadGameData.ball;
                player1Score = loadGameData.player1Score;
                player2Score = loadGameData.player2Score;
                player2 = loadGameData.player2;
                player1 = loadGameData.player1;
                CONSTS = loadGameData.CONSTS;
            }
        }
    }

    var events = {
        setEvents: function () {
            window.addEventListener('keydown', this.onPress);
            window.addEventListener('keyup', this.onBreak);

            $(document).on('click', '#btn-new-game', this.newGame);
        },
        newGame: function () {
            $('#pong-game').remove();
            gameStart();
        },
        onPress: function (event) {
            //Disable arrow key on page
            if (event.keyCode === 38 || event.keyCode === 40) {
                event.cancelBubble = true;
                event.returnValue = false;
            }

            switch (event.keyCode) {
                case 87:
                    player1.speed = -12;
                    break;
                case 83:
                    player1.speed = 12;
                    break;
                case 38:
                    player2.speed = -12;
                    break;
                case 40:
                    player2.speed = 12;
                    break;
            }
        },
        onBreak: function (event) {
            if (event.keyCode === 87 || event.keyCode === 83) {
                player1.speed = 0;
            }

            if (event.keyCode === 38 || event.keyCode === 40) {
                player2.speed = 0;
            }
        }
    }

    function start() {
        draw.drawGameItems();
        events.setEvents();
        ball.roll();
        game.loop();
    }

    start();
}

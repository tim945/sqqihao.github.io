define(["app/C/Sprite"], function ( Sprite ) {

    var explodeEffect = new GT.Sound({
        id: "explodeEffect-2",
        src: "./app/audio/explodeEffect.mp3",
        loop: true,
        volume: 1,
        tag: "explodeEffect",
        channel: 2
    });
    explodeEffect.load();

    /**
     * @desc missile 所有的导弹都继承这个类;
     */
    var Missile = P(EventBase , function ( missile ) {

        /**
         * @desc 初始化伤害值， x轴和y轴， 移动的速度， 以及伤害值....等....
         */
        missile.init = function ( canvas, context, bg, x, y, w ,h , info) {

            this.canvas = canvas;
            this.context = context;
            this.bg = bg;
            this.x = x;
            this.y = y;
            this.speedX = info.speedX || 0;
            this.speedY = info.speedY || -3;
            this.damage = info.damage || 1;
            this.task = info.task || {};
            this.w = w;
            this.h = h;

        };

        missile.setup = function () {
            this.x = this.x + this.speedX;
            this.y = this.y + this.speedY;
            //把当前子弹和所有的敌机进行碰撞检测;
            //先获取当前所有的敌机
            var enemys = this.task.getEnemy();
            for(var i=0; i< enemys.length; i++) {
                //如果当前的子弹和某台敌机碰到了;
                if( util.canvasCollision(
                    //子弹的信息;
                    {
                        left : this.x,
                        top : this.y,
                        right : this.x+this.w,
                        bottom : this.y+this.h
                    },
                    {
                        left : enemys[i].x,
                        top : enemys[i].y,
                        right : enemys[i].x+enemys[i].w,
                        bottom : enemys[i].y+enemys[i].h
                    }
                )) {
                    //被一个子弹射中以后， 只要子弹不消失;还会被这个子弹射中
                    if( (enemys[i].blood--)===0 ) {
                        enemys[i].remove&&enemys[i].remove();
                        enemys[i].destory&&enemys[i].destory();
                    };
                    //播放音乐;
                    explodeEffect.play();
                    this.remove&&this.remove();
                    console.log("collision");
                }
            };
        };

        /**
         * @desc
         * */
        missile.draw = function() {
            this.context.drawImage(this.bg, this.x, this.y , this.w, this.h);
        };

        missile.destory = function () {

        }

        missile.outOfArea = function() {
            if(this.x<-this.w||this.x>this.canvas.width||this.y<-this.h||this.y>this.canvas.height) {
                return true;
            }
        };

    });
    return Missile;
})
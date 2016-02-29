/**
 * Created by jingdai on 2015/8/25.
 */
(function(w){
    w.turnplate={
        awards:[],				//大转盘奖品名称
        ratio: window.innerWidth/720,
        canvas: 540,                //大转盘宽
        outsideRadius:225,			//大转盘外圆的半径
        textRadius:180,				//大转盘奖品位置距离圆心的距离
        iconRadius: 170,
        insideRadius:68,			//大转盘内圆的半径
        startRadian: 0,				//开始弧度
        startIndex:0,
        startAngle: 247.5,          //开始角度
        font: 20,
        icon: 70,
        bRotate:false,				//false:停止;ture:旋转
        isEmpty: false
    };

    raffle = function(){this.Init();};
    raffle.prototype = {
        Init: function(){this.Wheel = $('#wheelcanvas');},
        //计算大转盘显示比例
        Compute : function(){
            var canvas = document.getElementById("wheelcanvas");
            var w = turnplate.canvas*turnplate.ratio;
            canvas.width = w;
            canvas.height = w;
            turnplate.outsideRadius *= turnplate.ratio;
            turnplate.textRadius *= turnplate.ratio;
            turnplate.iconRadius *= turnplate.ratio;
            turnplate.insideRadius *= turnplate.ratio;

            var root = parseInt($("html").css("font-size"));
            turnplate.font *= turnplate.ratio;
            turnplate.icon *= turnplate.ratio;
        },
        //渲染图标
        drawIcons : function(){
            var canvas = this.Wheel[0];
            var ctx = canvas.getContext("2d");
            //按奖项数量计算圆周角度
            var arc = Math.PI / (turnplate.awards.length/2);
            ctx.clearRect(0,0,this.Wheel.width(),this.Wheel.width());
            // canvas画转盘弧度从三点钟方向为0度。
            for(var i = 0; i < turnplate.awards.length; i++) {
                var img = document.createElement("img");
                img.src = turnplate.awards[i].imgUrl;
                img.id = "img_r"+i;
                img.onload = function () {
                    //添加对应图标
                    ctx.save();
                    var i = this.id.split("_r")[1];
                    var radian = turnplate.startRadian + i * arc;
                    //重新定位画布上的位置
                    ctx.translate(r.Wheel.width()/2 + Math.cos(radian + arc / 2) * turnplate.iconRadius, r.Wheel.width()/2 + Math.sin(radian + arc / 2) * turnplate.iconRadius);
                    //按圆周角度旋转画布
                    ctx.rotate(radian + arc / 2 + Math.PI / 2);
                    // drawImage设置图标宽高
                    ctx.drawImage(this,-turnplate.icon / 2,0,turnplate.icon,turnplate.icon);
                    ctx.restore();
                }
            }
        },
        //渲染转盘
        drawRouletteWheel: function() {
            var canvas = this.Wheel[0];
            if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (turnplate.awards.length/2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0,0,this.Wheel.width(),this.Wheel.width());
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
            ctx.strokeStyle = "#FFBE04";
            //font 属性设置或返回画布上文本内容的当前字体属
            ctx.font = turnplate.font+'px Microsoft YaHei';
            //canvas画弧度从三点钟方向为0度
            var len = turnplate.isEmpty?8:turnplate.awards.length;

            for(var i = 0; i < len; i++) {
                var radian = turnplate.startRadian + i * arc;
                //记住指针索引位置
                if(turnplate.startAngle >= radian/Math.PI*180 && (turnplate.startAngle <= (radian+arc)/Math.PI*180))
                    turnplate.startIndex = i;

                var bgColor = "#ffeb8c";
                if(!!turnplate.awards[i]&&!!turnplate.awards[i].bgColor){
                    bgColor = turnplate.awards[i].bgColor;
                }else{
                    if(i %2 == 0)
                        bgColor = "#ffd571";
                }
                ctx.fillStyle = bgColor;
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                ctx.arc(this.Wheel.width()/2, this.Wheel.width()/2, turnplate.outsideRadius, radian, radian + arc, false);
                ctx.arc(this.Wheel.width()/2, this.Wheel.width()/2, turnplate.insideRadius, radian + arc, radian, true);
                ctx.stroke();
                ctx.fill();
                //锁画布(为了保存之前的画布状态)
                ctx.save();

                //空转盘
                if(turnplate.isEmpty){
                    ctx.restore();
                    continue;
                }


                //----绘制奖品开始----
                ctx.fillStyle = "#a95b10";
                var text = turnplate.awards[i].awardName,quantum = turnplate.awards[i].quantum;
                var unit = turnplate.awards[i].unit;
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(this.Wheel.width()/2 + Math.cos(radian + arc / 2) * turnplate.textRadius, this.Wheel.width()/2 + Math.sin(radian + arc / 2) * turnplate.textRadius);

                //rotate方法旋转当前的绘图
                ctx.rotate(radian + arc / 2 + Math.PI / 2);

                /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
                if(!!quantum && quantum > 1){
                    var texts = [];
                    texts.push(quantum);
                    texts.push(unit+text);
                    for(var j = 0; j<texts.length; j++){
                        if(j == 0){
                            ctx.fillText(texts[j], -ctx.measureText(texts.join(" ")).width / 2, 0);
                        }
                        else{
                            ctx.fillText(texts[j], (turnplate.font-ctx.measureText(texts[j]).width) / 2, 0);
                        }
                    }
                }else{
                    //在画布上绘制填色的文本。文本的默认颜色是黑色
                    //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                }


                //把当前画布返回（调整）到上一个save()状态之前
                ctx.restore();
                //----绘制奖品结束----
            }
        }
    },
        //旋转转盘
        rotateFn : function (item){
            turnplate.bRotate = !turnplate.bRotate;
            var angles = (turnplate.startIndex - item)*360/turnplate.awards.length;
            console.log(angles);
            this.Wheel.stopRotate();
            this.Wheel.rotate({
                angle:0,
                animateTo:angles+360*1,
                duration:1000,
                callback:function (){
                    Page.end(item);
                }
            });
        }
    }
    w.raffle = raffle;
})(window);
r = new raffle();
(function(w){
    w.icons={"ok":"images/tips-smile.png","warn":"images/tips-warning.png"};

    page = function(){this.Init();};
    page.prototype = {
        Init: function(){
            this.getAwardData();
        },
        alert: function(txt,icon){
            if(!txt){
                txt = this._errorCode["00"];
            }
            if($(document).height()>window.outerHeight){
                $(".rf-tips-mask").height($(document).height());
            }

            $("#rf_tips_title").hide();
            if(!icon)
                icon = icons.warn;
            $("#rf_icon").attr("src", icon);

            $(".rf-tips-wrap,#rf_alert,.rf-tips-mask").show();
            $("#rf_alert").html(txt);
            $("#rf_btn").text("确定");
            $("#rf_btn").click(function(){
                $(".rf-tips-mask,.rf-tips-wrap").hide();
            });
        },
        _errorCode: {
            "00":"当前抽奖人数过多，请稍后重试",
            "54":"很遗憾!积分不足！<br/><em>快去邀请小伙伴加入赚积分吧。</em>",
            "66": "抽奖活动还未开始，请耐心等待。<br/><em class='s'>活动时间：2015年9月3日~2015年12月31日。</em>",
            "70":"很遗憾！活动已过期。<br/><em>欢迎下次再来！</em>",
            "67": "你已抽奖！欢迎明天再来。",
            "73":"当前没有正在进行的抽奖活动！"
        },
        _toDate: function(str){
            var sd=str.split("-");
            return new Date(sd[0],sd[1],sd[2]);
        },
        _getIndex: function(id){
            for(var i = 0,awards = turnplate.awards,len = awards.length;i<len;i++){
                if(id == awards[i].awardId){
                    return i;
                    break;
                }
            }
            return -1;
        },
        _pageData: function(){
            //获取页面信息
            $.getJSON("config/data.json",function(data){
                if(!!data){
                    //data = eval("("+data+")");
                    $("#rf_title").html(data.title);
                    var u = navigator.userAgent;
                    if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                        data.desc.push({
                            "descTitle":"声明",
                            "data":[
                                {"text":"抽奖功能为我家亳州平台提供，所提供的奖品由平台提供，与苹果公司无关。"}]
                        });
                    }
                    var template = $("#rf_activity").html().replace(/&lt;/g,"<");
                    $("#rf_activity").html(doT.template(template)(data));
                    //显示提示信息
                    $("#rf_activity").removeClass("hide");
                }
            });
        },
        getAwardData: function(){
            //获取奖项信息
            $.get("config/getAwards.json",function(data){
                if(!!data && !!data.flag && data.flag== "true"){
                    //请求页面信息
                    Page._pageData();

                    var data = data.data;
                    var dArr = [];
                    dArr.push(data.start);
                    dArr.push(data.end);
                    $("#rf_date").text(dArr.join("~"));
                    $.extend(turnplate.awards,data.awards);

                    // 自适应画布宽高
                    r.Compute();
                    r.drawIcons();
                    r.drawRouletteWheel();

                    Page.EventSet();
                }else{
                    turnplate.isEmpty = !turnplate.isEmpty;
                    // 自适应画布宽高
                    r.Compute();
                    r.drawRouletteWheel();

                    Page.EventSet();
                }
            });
        },

        EventSet: function(){
            //点击指针抽奖
            $('.pointer').click(function (){
                if(turnplate.isEmpty){
                    Page.alert(Page._errorCode["73"])
                    return;
                }
                if(turnplate.bRotate)return;
                // 发送抽奖请求
                Page.start();
            });
        },
        // 发起抽奖请求
        start : function(){
            $.ajaxSettings.error(function(e){
                Page.alert();
            });
            $.post("config/draw.json",{"userId":"","acId":""},function(data){
                if(!!data && data.flag == "true"){
                    var _index = Page._getIndex(data.data.id);
                    if(_index > -1)
                        r.rotateFn(_index);
                    else{
                        //未索引到奖项
                        Page.alert();
                    }
                }else{
                    var err = Page._errorCode[data.flag];
                    if(data.flag == "66")
                        Page.alert(err,icons.ok);
                    else
                        Page.alert(err);
                }
            });
        },
        // 显示抽奖结果
        end : function(data){
            var award = turnplate.awards[data];
            $("#rf_tips").text(award.awardName+award.quantum+award.unit);
            $("#rf_icon").attr("src",award.imgUrl);
            $("#rf_alert").hide();
            $(".hide").removeClass("hide");
            $(".rf-tips-mask").height($(document).height());

            turnplate.bRotate = !turnplate.bRotate;
        }
    }
    w.page = page;
})(window);

Page = new page();

<template>
    <div>
        <div class="slider">
            <div class="content">
                <div class="bg-img-div">
                    <img id="bg-img" src="" />
                </div>
                <div class="slider-img-div" id="slider-img-div">
                    <img id="slider-img" src="" />
                </div>
            </div>
            <div class="slider-move">
                <div class="slider-move-track">拖动滑块完成拼图</div>
                <div class="slider-move-btn" id="slider-move-btn"></div>
            </div>
            <div class="bottom">
                <div class="refresh-btn" id="slider-refresh-btn"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { captchaGet, captchaCheck } from "../../api/Captcha";

let currentCaptchaId = ref(null);
let currentCaptchaConfig = ref(null);
let isPrintLog = ref(false);

const emit = defineEmits(["close-dialog"]);

function printLog(...params) {
    if (isPrintLog.value) {
        console.log(JSON.stringify(params));
    }
}

function initConfig(
    bgImageWidth,
    bgImageHeight,
    sliderImageWidth,
    sliderImageHeight,
    end
) {
    currentCaptchaConfig.value = {
        startTime: new Date(),
        trackArr: [],
        movePercent: 0,
        bgImageWidth,
        bgImageHeight,
        sliderImageWidth,
        sliderImageHeight,
        end,
    };
    console.log("init", currentCaptchaConfig.value);
    return currentCaptchaConfig.value;
}

function down(event) {
    if (!currentCaptchaConfig.value) {
        currentCaptchaConfig.value = initConfig(0, 0, 0, 0, 0);
    }
    let targetTouches = event.originalEvent
        ? event.originalEvent.targetTouches
        : event.targetTouches;
    let startX = event.pageX;
    let startY = event.pageY;
    if (startX === undefined) {
        startX = Math.round(targetTouches[0].pageX);
        startY = Math.round(targetTouches[0].pageY);
    }
    currentCaptchaConfig.value.startX = startX;
    currentCaptchaConfig.value.startY = startY;

    const pageX = currentCaptchaConfig.value.startX;
    const pageY = currentCaptchaConfig.value.startY;
    const startTime = currentCaptchaConfig.value.startTime;
    const trackArr = currentCaptchaConfig.value.trackArr;
    trackArr.push({
        x: pageX - startX,
        y: pageY - startY,
        type: "down",
        t: new Date().getTime() - startTime.getTime(),
    });
    printLog("start", startX, startY);
    // pc
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    // 手机端
    window.addEventListener("touchmove", move, false);
    window.addEventListener("touchend", up, false);
    doDown(currentCaptchaConfig.value);
}

function move(event) {
    if (event instanceof TouchEvent) {
        event = event.touches[0];
    }
    let pageX = Math.round(event.pageX);
    let pageY = Math.round(event.pageY);
    const startX = currentCaptchaConfig.value.startX;
    const startY = currentCaptchaConfig.value.startY;
    const startTime = currentCaptchaConfig.value.startTime;
    const end = currentCaptchaConfig.value.end;
    const bgImageWidth = currentCaptchaConfig.value.bgImageWidth;
    const trackArr = currentCaptchaConfig.value.trackArr;
    let moveX = pageX - startX;
    const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "move",
        t: new Date().getTime() - startTime.getTime(),
    };
    trackArr.push(track);
    if (moveX < 0) {
        moveX = 0;
    } else if (moveX > end) {
        moveX = end;
    }
    currentCaptchaConfig.value.moveX = moveX;
    currentCaptchaConfig.value.movePercent = moveX / bgImageWidth;
    doMove(currentCaptchaConfig.value);
    console.log("move", track);
}

function up(event) {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
    window.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", up);
    if (event instanceof TouchEvent) {
        event = event.changedTouches[0];
    }
    currentCaptchaConfig.value.stopTime = new Date();
    let pageX = Math.round(event.pageX);
    let pageY = Math.round(event.pageY);
    const startX = currentCaptchaConfig.value.startX;
    const startY = currentCaptchaConfig.value.startY;
    const startTime = currentCaptchaConfig.value.startTime;
    const trackArr = currentCaptchaConfig.value.trackArr;

    const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "up",
        t: new Date().getTime() - startTime.getTime(),
    };

    trackArr.push(track);
    console.log("up", track);
    valid(currentCaptchaConfig.value);
}

async function valid(captchaConfig) {
    let data = {
        id: currentCaptchaId.value,
        data: {
            bgImageWidth: captchaConfig.bgImageWidth,
            bgImageHeight: captchaConfig.bgImageHeight,
            sliderImageWidth: captchaConfig.sliderImageWidth,
            sliderImageHeight: captchaConfig.sliderImageHeight,
            startSlidingTime: captchaConfig.startTime,
            endSlidingTime: captchaConfig.stopTime,
            trackList: captchaConfig.trackArr,
        },
    };

    captchaCheck(data)
        .then((res) => {
            console.log(res);
            if (res.data.code === 200) {
                emit("close-dialog");
            } else {
                refreshCaptcha();
            }
        })
        .catch((err) => {
            console.log(err);
            refreshCaptcha();
        });
}

function refreshCaptcha() {
    captchaGet()
        .then((res) => {
            console.log(res);
            reset();
            currentCaptchaId.value = res.data.id;
            const bgImg = document.getElementById("bg-img");
            const sliderImg = document.getElementById("slider-img");
            bgImg.src = res.data.captcha.backgroundImage;
            sliderImg.src = res.data.captcha.templateImage;
            initConfig(
                bgImg.offsetWidth,
                bgImg.offsetHeight,
                sliderImg.offsetWidth,
                sliderImg.offsetHeight,
                206
            );
        })
        .catch((err) => {
            console.log(err);
        });
}

function doDown() {
    const sliderMoveBtn = document.getElementById("slider-move-btn");
    sliderMoveBtn.style.backgroundPosition = "-5px 31.0092%";
}

function doMove(currentCaptchaConfig) {
    const moveX = currentCaptchaConfig.moveX;
    const sliderMoveBtn = document.getElementById("slider-move-btn");
    const sliderImgDiv = document.getElementById("slider-img-div");
    sliderMoveBtn.style.transform = `translate(${moveX}px, 0px)`;
    sliderImgDiv.style.transform = `translate(${moveX}px, 0px)`;
}

function reset() {
    const sliderMoveBtn = document.getElementById("slider-move-btn");
    const sliderImgDiv = document.getElementById("slider-img-div");
    sliderMoveBtn.style.backgroundPosition = "-5px 11.79625%";
    sliderMoveBtn.style.transform = "translate(0px, 0px)";
    sliderImgDiv.style.transform = "translate(0px, 0px)";
    currentCaptchaId.value = null;
}

onMounted(() => {
    const sliderMoveBtn = document.getElementById("slider-move-btn");
    const sliderRefreshBtn = document.getElementById("slider-refresh-btn");
    sliderMoveBtn.addEventListener("mousedown", down);
    sliderMoveBtn.addEventListener("touchstart", down);
    sliderRefreshBtn.addEventListener("click", refreshCaptcha);
    refreshCaptcha();
});

// onUnmounted(() => {
//     const sliderMoveBtn = document.getElementById("slider-move-btn");
//     sliderMoveBtn.removeEventListener("mousedown", down);
//     sliderMoveBtn.removeEventListener("touchstart", down);
// });
</script>
<style lang="less" scoped>
.slider {
    background-color: #fff;
    width: 278px;
    height: 285px;
    z-index: 999;
    box-sizing: border-box;
    padding: 9px;
    border-radius: 6px;
    box-shadow: 0 0 11px 0 #999999;
}

.slider .content {
    width: 100%;
    height: 159px;
    position: relative;
}

.bg-img-div {
    width: 100%;
    height: 100%;
    position: absolute;
    transform: translate(0px, 0px);
}

.slider-img-div {
    height: 100%;
    position: absolute;
    transform: translate(0px, 0px);
}

.bg-img-div img {
    width: 100%;
}

.slider-img-div img {
    height: 100%;
}

.slider .slider-move {
    height: 60px;
    width: 100%;
    margin: 11px 0;
    position: relative;
}

.slider .bottom {
    height: 19px;
    width: 100%;
}

.refresh-btn,
.slider-move-track,
.slider-move-btn {
    background: url(https://static.geetest.com/static/ant/sprite.1.2.4.png)
        no-repeat;
}

.refresh-btn {
    display: inline-block;
}

.slider-move .slider-move-track {
    line-height: 38px;
    font-size: 14px;
    text-align: center;
    white-space: nowrap;
    color: #88949d;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}

.slider {
    user-select: none;
}

.slider-move .slider-move-btn {
    transform: translate(0px, 0px);
    background-position: -5px 11.79625%;
    position: absolute;
    top: -12px;
    left: 0;
    width: 66px;
    height: 66px;
}

.slider-move-btn:hover,
.refresh-btn:hover {
    cursor: pointer;
}

.bottom {
    width: 20px;
    height: 20px;
    background-position: 0 44.86874%;
}

.bottom .refresh-btn {
    width: 20px;
    height: 20px;
    background-position: 0 81.38425%;
}
</style>

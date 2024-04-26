<script setup>
import { onMounted } from "vue";
onMounted(() => {
    window.onload = function () {
        if (!window.sessionStorage["token"]) {
            window.localStorage.removeItem("token");
        }
    };
    window.onunload = function () {
        window.sessionStorage["token"] = true;
    };
    window.onbeforeunload = function () {
        window.sessionStorage["token"] = true;
    };
});
</script>

<template>
    <router-view></router-view>
</template>

<style lang="less">
body {
    background-color: #f0f2fd;
}
</style>

<template>
    <div class="main">
        <div class="visible">
            <div id="usersNum"></div>
        </div>
        <div class="quickTo"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserNum } from "../../api/adminHome";
import * as echarts from "echarts";

// 获取用户新增量和累积量并处理数据
const getData = () => {
    getUserNum()
        .then((res) => {
            console.log(res.data);
            dataVisible(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 数据可视化
const dataVisible = (data) => {
    const chartDom = document.getElementById("usersNum");
    chartDom?.removeAttribute("_echarts_instance_");
    const myChart = echarts.init(chartDom);

    const option = {
        dataZoom: {
            type: "slider",
            startValue: data.dateList.length - 20,
            endValue: data.dateList.length,
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
            },
        },
        legend: {
            data: ["总用户量", "新增用户量"],
        },
        xAxis: {
            type: "category",
            data: data.dateList,
            axisTick: {
                alignWithLabel: true,
            },
        },
        yAxis: [
            {
                type: "value",
                name: "新增用户量", // 左侧 y 轴标签
            },
            {
                type: "value",
                name: "总用户量", // 右侧 y 轴标签
            },
        ],
        series: [
            {
                name: "总用户量",
                type: "line",
                data: data.customerNum,
                yAxisIndex: 1,
            },
            {
                name: "新增用户量",
                type: "bar",

                data: data.newNUm,
            },
        ],
    };

    myChart.setOption(option);
};

onMounted(() => {
    getData();
});
</script>

<style lang="less" scoped>
.main {
    height: 100%;
    width: 100%;
    .visible {
        width: 100%;
        height: 50%;
        #usersNum {
            width: 100%;
            height: 100%;
        }
    }
}
</style>

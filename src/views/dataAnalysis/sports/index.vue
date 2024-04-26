<template>
    <div class="main">
        <div id="chart1"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getChartData31 } from "../../../api/dataAnalysis";
import * as echarts from "echarts";

// 获取所有数据
const getAllData = () => {
    getChartData31()
        .then((res) => {
            drawChart1(res.data);
        })
        .then((err) => {
            console.log(err);
        });
};
// 绘制图像
const drawChart1 = (data) => {
    const chartDom = document.getElementById("chart1");
    chartDom?.removeAttribute("_echarts_instance_");
    const myChart = echarts.init(chartDom);

    let userIds = data.map((item) => {
        return item.userId;
    });
    let averageTimes = data.map((item) => {
        return item.averageTime;
    });
    let averageConsumptions = data.map((item) => {
        return item.averageConsumption;
    });

    const option = {
        dataZoom: {
            type: "slider",
            startValue: 0,
            endValue: 30,
        },
        grid: {
            height: "77%",
        },
        title: {
            text: "用户运动时长与消耗分析",
            left: "center",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
            },
        },
        xAxis: {
            type: "category",
            data: userIds,
            axisLabel: {
                show: false,
            },
            name: "所有用户",
            nameLocation: "center",
            nameTextStyle: {
                fontWeight: "bold",
                fontSize: 20,
            },
        },
        yAxis: [
            {
                type: "value",
                name: "平均时长(min)",
            },
            {
                type: "value",
                name: "平均消耗(kcal)",
            },
        ],
        series: [
            {
                name: "平均时长",
                type: "bar",
                data: averageTimes,
            },
            {
                name: "平均消耗",
                type: "line",
                yAxisIndex: 1,
                data: averageConsumptions,
            },
        ],
    };

    myChart.setOption(option);
};

onMounted(() => {
    getAllData();
});
</script>

<style lang="less" scoped>
.main {
    height: 100%;
    width: 100%;
    #chart1 {
        height: 100%;
        width: 100%;
    }
}
</style>

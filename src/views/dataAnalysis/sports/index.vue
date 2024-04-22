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
            let data = [
                {
                    userId: 1,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
                {
                    userId: 2,
                    averageTime: 60.0,
                    averageConsumption: 200.0,
                },
                {
                    userId: 3,
                    averageTime: 30.0,
                    averageConsumption: 80.0,
                },
                {
                    userId: 4,
                    averageTime: 75.0,
                    averageConsumption: 150.0,
                },
                {
                    userId: 5,
                    averageTime: 90.0,
                    averageConsumption: 180.0,
                },
                {
                    userId: 6,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
                {
                    userId: 7,
                    averageTime: 60.0,
                    averageConsumption: 200.0,
                },
                {
                    userId: 8,
                    averageTime: 30.0,
                    averageConsumption: 80.0,
                },
                {
                    userId: 9,
                    averageTime: 75.0,
                    averageConsumption: 150.0,
                },
                {
                    userId: 10,
                    averageTime: 90.0,
                    averageConsumption: 180.0,
                },
                {
                    userId: 11,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
                {
                    userId: 12,
                    averageTime: 60.0,
                    averageConsumption: 200.0,
                },
                {
                    userId: 13,
                    averageTime: 30.0,
                    averageConsumption: 80.0,
                },
                {
                    userId: 14,
                    averageTime: 75.0,
                    averageConsumption: 150.0,
                },
                {
                    userId: 15,
                    averageTime: 90.0,
                    averageConsumption: 180.0,
                },
                {
                    userId: 16,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
                {
                    userId: 17,
                    averageTime: 60.0,
                    averageConsumption: 200.0,
                },
                {
                    userId: 18,
                    averageTime: 30.0,
                    averageConsumption: 80.0,
                },
                {
                    userId: 19,
                    averageTime: 75.0,
                    averageConsumption: 150.0,
                },
                {
                    userId: 20,
                    averageTime: 90.0,
                    averageConsumption: 180.0,
                },
                {
                    userId: 21,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
                {
                    userId: 22,
                    averageTime: 60.0,
                    averageConsumption: 200.0,
                },
                {
                    userId: 23,
                    averageTime: 30.0,
                    averageConsumption: 80.0,
                },
                {
                    userId: 24,
                    averageTime: 75.0,
                    averageConsumption: 150.0,
                },
                {
                    userId: 25,
                    averageTime: 90.0,
                    averageConsumption: 180.0,
                },
                {
                    userId: 26,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
                {
                    userId: 27,
                    averageTime: 60.0,
                    averageConsumption: 200.0,
                },
                {
                    userId: 28,
                    averageTime: 30.0,
                    averageConsumption: 80.0,
                },
                {
                    userId: 29,
                    averageTime: 75.0,
                    averageConsumption: 150.0,
                },
                {
                    userId: 30,
                    averageTime: 90.0,
                    averageConsumption: 180.0,
                },
                {
                    userId: 31,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
                {
                    userId: 32,
                    averageTime: 30.0,
                    averageConsumption: 80.0,
                },
                {
                    userId: 33,
                    averageTime: 75.0,
                    averageConsumption: 150.0,
                },
                {
                    userId: 34,
                    averageTime: 90.0,
                    averageConsumption: 180.0,
                },
                {
                    userId: 35,
                    averageTime: 45.0,
                    averageConsumption: 120.0,
                },
            ];
            drawChart1(data);
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

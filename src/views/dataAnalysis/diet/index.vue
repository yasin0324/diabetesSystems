<template>
    <div class="main">
        <div class="part1">
            <div id="chart1"></div>
            <div id="chart2"></div>
        </div>
        <div class="part2"><div id="chart3"></div></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    getChartData21,
    getChartData22,
    getChartData23,
} from "../../../api/dataAnalysis";
import * as echarts from "echarts";

// 获取所有数据
const getAllData = () => {
    getChartData21()
        .then((res) => {
            console.log(res.data);
            showChart2(res.data);
        })
        .then((err) => {
            console.log(err);
        });
    getChartData22()
        .then((res) => {
            console.log(res.data);
            showChart1(res.data);
        })
        .then((err) => {
            console.log(err);
        });
    getChartData23()
        .then((res) => {
            showChart3(res.data);
        })
        .then((err) => {
            console.log(err);
        });
};
// 营养素摄入分析
const showChart1 = (data) => {
    const chartDom = document.getElementById("chart1");
    chartDom?.removeAttribute("_echarts_instance_");
    const myChart = echarts.init(chartDom);

    // 定义你想要的顺序
    const order = ["早餐", "午餐", "晚餐", "加餐"];

    // 对数据进行排序
    data.sort(
        (a, b) => order.indexOf(a.periodLabel) - order.indexOf(b.periodLabel)
    );

    // 将你的数据转换为 ECharts 需要的格式
    const series = [
        {
            name: "含糖量",
            type: "bar",
            stack: "总量",
            data: data.map((item) => item.glucose),
        },
        {
            name: "蛋白质",
            type: "bar",
            stack: "总量",
            data: data.map((item) => item.protein),
        },
        {
            name: "脂肪",
            type: "bar",
            stack: "总量",
            data: data.map((item) => item.fat),
        },
        {
            name: "碳水化合物",
            type: "bar",
            stack: "总量",
            data: data.map((item) => item.carbohydrate),
        },
        {
            name: "热量",
            type: "bar",
            stack: "总量",
            data: data.map((item) => item.heat),
            itemStyle: {
                borderRadius: [50, 50, 0, 0],
            },
        },
    ];

    const option = {
        title: {
            text: "用户饮食营养素摄入情况",
            left: "center",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
            formatter: function (params) {
                var tooltipText = params[0].name + "<br/>";
                params.forEach(function (item) {
                    var unit = item.seriesName === "热量" ? "kcal" : "g";
                    tooltipText +=
                        item.seriesName + ": " + item.value + unit + "<br/>";
                });
                return tooltipText;
            },
        },
        legend: {
            data: ["含糖量", "蛋白质", "脂肪", "碳水化合物", "热量"],
            orient: "horizontal",
            bottom: 0,
            type: "scroll",
        },
        grid: {
            width: "80%",
            height: "65%",
        },
        xAxis: {
            type: "category",
            data: data.map((item) => item.periodLabel),
        },
        yAxis: {
            type: "value",
        },
        series: series,
    };

    myChart.setOption(option);
};
// 用户食物选择偏好图
const showChart2 = (data) => {
    const chartDom = document.getElementById("chart2");
    chartDom?.removeAttribute("_echarts_instance_");
    const myChart = echarts.init(chartDom);

    const formattedData = data.map((item) => ({
        value: item.num,
        name: item.type,
    }));

    const foodTypes = data.map((item) => item.type);

    const option = {
        title: {
            text: "用户食物选择偏好",
            left: "center",
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} 次 ({d}%)",
        },
        legend: {
            type: "scroll",
            orient: "vertical",
            right: 0,
            top: 20,
            data: foodTypes,
        },
        series: [
            {
                name: "食物类别",
                type: "pie",
                radius: "60%",
                data: formattedData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        ],
    };

    myChart.setOption(option);
};
// 食物营养散点图
const showChart3 = (value) => {
    const foodData = value.map(function (item) {
        return [item.gl, item.gi];
    });
    console.log(value);
    console.log(foodData);

    const chartDom = document.getElementById("chart3");
    chartDom?.removeAttribute("_echarts_instance_");
    const myChart = echarts.init(chartDom);

    const option = {
        title: {
            text: "食物营养散点图",
            left: "center",
        },
        tooltip: {
            trigger: "item",
        },
        xAxis: {
            name: "升糖负荷(GL)",
        },
        yAxis: { name: "升糖指数(GI)" },
        series: [
            {
                symbolSize: 20,
                data: foodData,
                type: "scatter",
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
    display: flex;
    flex-direction: row-reverse;
    .part1 {
        height: 100%;
        width: 30%;
        display: flex;
        flex-direction: column;
        #chart1 {
            width: 100%;
            height: 50%;
        }
        #chart2 {
            width: 100%;
            height: 50%;
        }
    }
    .part2 {
        height: 100%;
        width: 65%;
        #chart3 {
            height: 100%;
            width: 100%;
        }
    }
}
</style>

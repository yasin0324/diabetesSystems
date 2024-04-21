<template>
    <div class="main">
        <div class="chart1">
            <div id="chart11"></div>
            <div id="chart12"></div>
            <div id="chart13"></div>
            <div id="chart14"></div>
        </div>
        <div class="chart2">
            <div id="chart2"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getChartData1, getChartData2 } from "../../../api/dataAnalysis/index";
import * as echarts from "echarts";

// 获取饼状图数据
const getData1 = () => {
    getChartData1(["空腹"])
        .then((res) => {
            handleData1(res.data, 0);
        })
        .catch((err) => {
            console.log(err);
        });
    getChartData1(["午餐前", "晚餐前"])
        .then((res) => {
            handleData1(res.data, 1);
        })
        .catch((err) => {
            console.log(err);
        });
    getChartData1(["早餐后", "午餐后", "晚餐后"])
        .then((res) => {
            handleData1(res.data, 2);
        })
        .catch((err) => {
            console.log(err);
        });
    getChartData1(["睡前", "夜间"])
        .then((res) => {
            handleData1(res.data, 3);
        })
        .catch((err) => {
            console.log(err);
        });
};
// 处理数据
const handleData1 = (value, index) => {
    let normalCount = 0;
    let highCount = 0;
    let lowCount = 0;
    let normalRange = [];

    if (index === 0) {
        normalRange = [4.4, 6.1];
    } else if (index === 1) {
        normalRange = [5.0, 7.8];
    } else if (index === 2) {
        normalRange = [5.0, 9.4];
    } else if (index === 3) {
        normalRange = [3.9, 8.1];
    }
    for (let userId in value) {
        let blood = value[userId];
        if (blood < normalRange[0]) {
            // 平均血糖偏低
            lowCount++;
        } else if (blood > normalRange[1]) {
            // 平均血糖偏高
            highCount++;
        } else {
            // 平均血糖正常
            normalCount++;
        }
    }

    // 保存结果
    let data = [
        { value: lowCount, name: "偏低" },
        { value: normalCount, name: "正常" },
        { value: highCount, name: "偏高" },
    ];

    if (index === 0) {
        drawChart1(data, 0);
    } else if (index === 1) {
        drawChart1(data, 1);
    } else if (index === 2) {
        drawChart1(data, 2);
    } else if (index === 3) {
        drawChart1(data, 3);
    }
};
// 绘制饼状图
const drawChart1 = (data, index) => {
    const chartDom = document.getElementById(`chart1${index + 1}`);
    chartDom?.removeAttribute("_echarts_instance_");
    const myChart = echarts.init(chartDom);

    let title = "";
    if (index === 0) {
        title = "空腹血糖";
    } else if (index === 1) {
        title = "餐前血糖";
    } else if (index === 2) {
        title = "餐后血糖";
    } else if (index === 3) {
        title = "其他血糖";
    }
    const option = {
        title: {
            text: title,
            left: "center",
        },
        tooltip: {
            trigger: "item",
        },
        legend: {
            orient: "horizontal",
            left: "center",
            top: "bottom",
        },
        series: [
            {
                type: "pie",
                radius: "50%",
                data: data,
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

// 时段标签列表
const periodLabels = [
    "空腹",
    "早餐后",
    "午餐前",
    "午餐后",
    "晚餐前",
    "晚餐后",
    "睡前",
    "夜间",
];
const data = ref([]);
const getData2 = async () => {
    // 遍历每个时段标签
    for (let i = 0; i < periodLabels.length; i++) {
        // 调用接口获取数据
        let response = await getChartData2(periodLabels[i]);

        // 将数据转换为你需要的格式
        let formattedData = [
            response.data[2],
            response.data[0],
            response.data[1],
            response.data[3],
        ];
        // 将格式化后的数据添加到数组中
        data.value.push(formattedData);
    }
    console.log(data.value);
    drawChart2(data.value);
};
// 绘制k线图
const drawChart2 = (data) => {
    const chartDom = document.getElementById("chart2");
    chartDom?.removeAttribute("_echarts_instance_");
    const myChart = echarts.init(chartDom);

    const maxValues = data.map((item) => item[3]);
    const minValues = data.map((item) => item[2]);
    const avgValues = data.map((item) => (item[0] + item[1]) / 2);

    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
            },
        },
        title: {
            text: "血糖分布图",
            left: "center",
            top: "bottom",
        },
        xAxis: {
            data: periodLabels,
        },
        yAxis: {},
        series: [
            {
                type: "candlestick",
                data: data,
                tooltip: {
                    show: false,
                },
            },
            {
                type: "line",
                data: maxValues,
                name: "最高值",
                smooth: true,
                lineStyle: {
                    color: "red",
                },
            },
            {
                type: "line",
                data: minValues,
                name: "最低值",
                smooth: true,
                lineStyle: {
                    color: "blue",
                },
            },
            {
                type: "line",
                data: avgValues,
                name: "平均值",
                smooth: true,
                lineStyle: {
                    color: "green",
                },
            },
        ],
    };

    myChart.setOption(option);
};

onMounted(() => {
    getData1();
    getData2();
});
</script>

<style lang="less" scoped>
.main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .chart1 {
        display: flex;
        flex-direction: row;
        height: 50%;
        width: 100%;
        #chart11,
        #chart12,
        #chart13,
        #chart14 {
            width: 25%;
            height: 100%;
        }
    }
    .chart2 {
        height: 50%;
        width: 100%;
        #chart2 {
            height: 100%;
            width: 100%;
        }
    }
}
</style>

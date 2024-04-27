<template>
    <div class="main">
        <div class="visible">
            <div id="usersNum"></div>
        </div>
        <el-divider />
        <div class="quickTo">
            <el-row>
                <el-col :span="8">
                    <div class="background1">
                        <div>
                            <el-button
                            type="success"
                            color="rgb(194,212,116)"
                            round
                            @click="router.push('/home/health/food')"
                            >
                            食物数据管理
                            </el-button>
                            <el-button
                            type="success"
                            color="rgb(175,217,125)"
                            round
                            @click="router.push('/home/health/articles')"
                            >
                            文章数据管理
                            </el-button>
                            <el-button
                            type="success"
                            color="rgb(156,220,133)"
                            round
                            @click="router.push('/home/health/sports')"
                            >
                            运动数据管理
                            </el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="background2">
                        <div>
                            <el-button
                            type="success"
                            color="rgb(175,132,138)"
                            round
                            @click="router.push('/home/data/blood')"
                            >
                            血糖分析可视化
                            </el-button>
                            <el-button
                            type="success"
                            color="rgb(154,137,159)"
                            round
                            @click="router.push('/home/data/diet')"
                            >
                            饮食分析可视化
                            </el-button>
                            <el-button
                            type="success"
                            color="rgb(134,142,180)"
                            round
                            @click="router.push('/home/data/sportsdata')"
                            >
                            运动分析可视化
                            </el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="background3">
                        <div>
                            <el-button
                            type="success"
                            color="rgb(96,191,187)"
                            round
                            @click="router.push('/home/userData')"
                            >
                            用户管理
                            </el-button>
                            <el-button
                            type="success"
                            color="rgb(90,180,193)"
                            round
                            @click="router.push('/home/notice')"
                            >
                            公告管理
                            </el-button>
                            <el-button
                            type="success"
                            color="rgb(79,161,202)"
                            round
                            @click="router.push('/home/feed_back')"
                            >
                            反馈管理
                            </el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUserNum } from "../../api/adminHome";
import * as echarts from "echarts";

const router = useRouter()

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
    .quickTo{
        width: 100%;
        height: 45%;
        .el-row{
            width: 100%;
            height: 100%;
            .el-col{
                padding: 1%;
               .background1{
                    width: 100%;
                    height: 100%;
                    border-radius: 5vh;
                    background-image: linear-gradient(to bottom right, rgb(249, 192, 48), rgb(5, 238, 149));
                    background-size: cover;
                    background-position: center; 
                    background-repeat: no-repeat;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    div{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        .el-button{
                            color: #fff;
                            margin-top: 5%;
                            margin-bottom: 5%;
                            margin-left: 0%;
                        }
                    }
                }
                .background2{
                    width: 100%;
                    height: 100%;
                    border-radius: 5vh;
                    background-image: linear-gradient(to bottom right, rgb(247, 109, 71), rgb(30, 160, 246));
                    background-size: cover;
                    background-position: center; 
                    background-repeat: no-repeat;
                    div{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        .el-button{
                            color: #fff;
                            margin-top: 5%;
                            margin-bottom: 5%;
                            margin-left: 0%;
                        }
                    }
                }
                .background3{
                    width: 100%;
                    height: 100%;
                    border-radius: 5vh;
                    background-image: linear-gradient(to bottom right, rgb(71, 247, 147), rgb(9, 125, 233));
                    background-size: cover;
                    background-position: center; 
                    background-repeat: no-repeat;
                    div{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        .el-button{
                            color: #fff;
                            margin-top: 5%;
                            margin-bottom: 5%;
                            margin-left: 0%;
                        }
                    }
                } 
            }
            
        }
    }
}
</style>

<script lang="ts" setup>
import { listen } from "@tauri-apps/api/event"
import { onMounted,reactive,ref } from "vue"
import { forbidselect } from "../../common";
import { getCurrent,LogicalSize } from "@tauri-apps/api/window";
import RightMenu from "./../../components/RightMenu.vue"
const show = ref(false)
const appWindow = getCurrent();
appWindow.setShadow(false);
appWindow.setSize(new LogicalSize(100,50));
appWindow.setAlwaysOnTop(true)
show.value = true;
const alwaystop = ref(false)
const setalwaystop = function(){
    alwaystop.value = !alwaystop.value;
    appWindow.setAlwaysOnTop(alwaystop.value)    
}
const speed = reactive({
    r:"",
    t:""
})
onMounted(async ()=>{
    forbidselect('netspeed')
    document.getElementById("netspeed")?.addEventListener("contextmenu",(e)=>{
        e.preventDefault();
    })
    const unlisten =await listen("netspeed",(e:any)=>{
        speed.r = e.payload[0]>=1024000?(e.payload[0]/1024/1024).toFixed(1)+'MB/s':(e.payload[0]/1024).toFixed(1)+'KB/s'
        speed.t = e.payload[1]>=1024000?(e.payload[1]/1024/1024).toFixed(1)+'MB/s':(e.payload[1]/1024).toFixed(1)+'KB/s'
    })
    await appWindow.listen("tauri://destroyed",function(){
        unlisten()
    })
})

const closewindow = function(){
    appWindow.close();
}

</script>

<template>
    <div id="netspeed" v-if="show" class="netspeed" data-tauri-drag-region>
        <div class="up" data-tauri-drag-region>
            <div class="upimg" data-tauri-drag-region>
                <img :src="'./icon/up.png'" style="width: 15px;height: 15px;" draggable="false" data-tauri-drag-region />
            </div>
            <div style="width: 70px;" data-tauri-drag-region>
                {{speed.t }}
            </div>
        </div>
        <div class="down" data-tauri-drag-region>
            <div class="downimg" data-tauri-drag-region>
                <img :src="'./icon/down.png'" style="width: 15px;height: 15px;" draggable="false" data-tauri-drag-region />
            </div>
            <div style="width: 70px;" data-tauri-drag-region>
                {{speed.r }}
            </div>
        </div>
        <right-menu background="rgba(123,123,123,0.5)" border-radius="5px">
            <div style="display: flex;justify-content: center;align-items: center;height: 100%;width: 100%;" data-tauri-drag-region>
                <div>
                    <img @click="setalwaystop" :src="alwaystop?'./icon/wintop.png':'./icon/windown.png'" style="width: 25px;height: 25px;">
                </div>
                <div>
                    <img @click="closewindow" :src="'./icon/close.png'" style="width: 25px;height: 25px;">
                </div>
            </div>
        </right-menu>
    </div>
</template>

<style lang="less">
.netspeed{
    background: rgba(40,40,40,0.8);
    width: 100px;
    height: 50px;
    font-size: 13px;
    box-sizing: border-box;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    color:yellow;
    cursor: default;
    padding: 5px 5px;
    .up{
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        .upimg{
            width: 20px;height: 25px;display: flex;align-items: center;justify-content: center;
        }
    }
    .down{
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        .downimg{
            width: 20px;height: 25px;display: flex;align-items: center;justify-content: center;
        }
    }
}
</style>
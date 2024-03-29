<script lang="ts" setup>
import RightMenu from "./../../components/RightMenu.vue"
import { ref,reactive,onMounted } from 'vue'
import { forbidselect } from './../../common/index.ts'
import { getCurrent,getAll } from "@tauri-apps/api/window";
import { WebviewWindow,getAll as getAllWebview } from '@tauri-apps/api/webviewWindow'
import { invoke } from "@tauri-apps/api/core"
invoke("netspeed");
const appWindow = getCurrent()
appWindow.setAlwaysOnTop(true)
appWindow.setShadow(false)
import {
  restoreStateCurrent,
  StateFlags,
} from '@tauri-apps/plugin-window-state';

restoreStateCurrent(StateFlags.ALL);
onMounted(()=>{
    forbidselect('menus')
    setInterval(()=>{
        console.log(getAll(),getAllWebview())
    },5000)
})
const toolshow = ref<boolean>(false)
const color =ref(['#FFE66E','#A1EF9B','#FFAFDF','#D7AFFF','#9EDFFF','#E0E0E0','#767676','pink'])
const notes = reactive(
    [
        {
            uuid:"note-123123123123123213",
            title:"title",
            html:"<h1><p>1<br/>2312313<p>",
            background:"#FFE66E"
        },
        {
            uuid:"note-123123123sadad123123213",
            title:"title",
            html:"<p>12312313<p>",
                background:"#FFAFDF"
        },
        {
            uuid:"note-asdasddadasdsadsa",
            title:"title",
            html:"<p>12312313<p>",
            background:"#D7AFFF"
        },
        {
            uuid:"note-1231231asdadsa23123123213",
            title:"title",
            html:"<p>12312313<p>",
            background:"#9EDFFF"
        },
        {
            uuid:"note-12312312asdsda3123123213",
            title:"title",
            html:"<p>12312313<p>",
            background:"#E0E0E0"
        },
        {
            uuid:"note-12312312asdasds3123123213",
            title:"title",
            html:"<p>12312313<p>",
            background:"#767676"
        },
]   
)
const setindex = ref(0);
const colorshow = ref(false)
const setcolor = function(index:number,color:string){
    notes[index].background = color
    colorshow.value = false
}


const shownotewindow = function(note:any){
    new WebviewWindow(note.uuid,{
        url:'/#/note',
        width:400,
        height:400,
        skipTaskbar:false,
        decorations:false,
        transparent:true,
        x:20,
        y:20,
        shadow:false,
        alwaysOnTop:true
    })
}

import { writeText } from '@tauri-apps/plugin-clipboard-manager';
const getcolor =async function(){
    if (!window.EyeDropper) {
        return 
    }
    const eyeDropper = new window.EyeDropper();
    window.Clipboard
    let {sRGBHex} = await eyeDropper.open();
    console.log(sRGBHex)
    await writeText(sRGBHex);
}

const getnetspeed = function(){
    new WebviewWindow("netspeed",{
        url:'/#/netspeed',
        width:100,
        height:50,
        x:200,
        y:200,
        shadow:false,
        skipTaskbar:false,
        decorations:false,
        transparent:true,
        minimizable:false,
        maximizable:false,
        alwaysOnTop:true
    })
}

const getwallpaper = function(){
    console.log('click start')
    new WebviewWindow("wallpaper",{
        url:'/#/wallpaper',
        width:800,
        height:600,
        x:200,
        y:200,
        shadow:false,
        skipTaskbar:false,
        decorations:false,
        transparent:true,
        minimizable:false,
        maximizable:false,
        alwaysOnTop:true
    })
    console.log('click end')
}

const windowclose = function(){
    appWindow.close();
}
</script>
 
<template> 
    <div class="home"> 
        <div id="menus" class="menus">
            <img :src="'./icon/add.png'" class="menu" @click="" />
            <img :src="'./icon/Picture.png'" class="menu" @click="getwallpaper" />
            <img :src="'./icon/getcolor.png'" class="menu" @click="getcolor" />
            <img :src="'./icon/netspeed.png'" class="menu" @click="getnetspeed" />
            <img :src="'./icon/weather.png'" class="menu" @click="" />
            <right-menu v-model="toolshow" border-radius="10px">
                <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;" data-tauri-drag-region>
                    <div >
                        <img @click="windowclose" :src="'./icon/close.png'" style="width: 25px;height: 25px;">
                    </div>
                </div>
            </right-menu>
        </div>
        <div id="notes" class="notes">
            <div  @click="shownotewindow(itemnote)" v-for="(itemnote,indexnote) in notes"  :style="{background:itemnote.background}" id="note" class="note">
                <div class="title" @click="colorshow = true;setindex = indexnote">
                    <img :src="'./icon/Menu-Vertical.png'" style=" transform: rotate(90deg);width: 20px;height: 20px;">
                </div>
                <div class="html" v-html="itemnote.html"></div>
                <div class="setcolor" :style="{top:(colorshow&&indexnote==setindex)?'0px':'-40px'}">
                    <div v-for="itemcolor in color" :style="{background:itemcolor,height:'40px',width:'12.5%'}" @click="setcolor(indexnote,itemcolor)"></div>
                </div>
                <right-menu border-radius="10px"></right-menu>
            </div>
        </div>
    </div>
</template>

<style lang="less">

::-webkit-scrollbar{
    display: none;
}
.home{
    position: relative;
    width: 100%;
    height: 100%;
    transition: all 0.1s linear; 
    box-sizing: border-box;
    .notes{
        margin-top: 10px;
        width: 100%;
        height: calc(100% - 90px);
        background: pink;
        border-radius: 10px;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 10px;
        .note{
            width: 100%;
            height: 400px;
            border-radius: 10px;
            box-sizing: border-box;
            filter: drop-shadow(0px 0px 5px black);
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            padding: 10px;
            position: relative;
            overflow: hidden;
            overflow-y: scroll;
            .html{
                width: 100%;
                height: 100%;
            }
            .title{
                position: absolute;
                right: 15px;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
            }
            .title:hover{
                filter: drop-shadow(0px 0px 10px black);
                background: rgba(125,124,125,0.2);
            }
            .setcolor{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 40px;
                background: white;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                display: flex;
                flex-direction: row;
                transition: all 0.2s linear;
            }
        }
    }
    .menus{
        position: relative;
        width: 100%;
        height: 80px;
        background: pink;
        border-radius: 10px;
        display: flex;
        justify-content:space-evenly;
        align-items: center; 
        .menu{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: transparent;
            transition: all 0.2s linear;
            display: flex;
            justify-content:space-evenly;
            align-items: center; 
        }
        .menu:hover{
            width: 60px;
            height: 60px;
            filter: drop-shadow(0px 0px 10px black);
            
        }
    }
}

</style>


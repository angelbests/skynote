<script lang="ts" setup>
import { onMounted,ref} from 'vue';
interface Props {
    background?:string,
    borderRadius?:string,
    zIndex?:number,
}
withDefaults(defineProps<Props>(),{
    background:"rgba(235,235,235,0.7)",
    borderRadius:"0",
    zIndex:100,
})
const rightmenuref = ref<HTMLElement>()
const show =ref(false)

onMounted(()=>{
    rightmenuref.value?.parentElement?.addEventListener("contextmenu",(e)=>{
        e.preventDefault();
        show.value = !show.value
    })
})
</script>

<template>
    <div ref="rightmenuref" class="rightmenu" v-show="show" :style="{background:background,borderRadius:borderRadius,zIndex:zIndex}" data-tauri-drag-region >
        <slot></slot>
    </div>
</template>

<style>
.rightmenu{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
</style>
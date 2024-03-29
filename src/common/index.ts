
export const forbidselect = function(id:string){
    let dom = document.getElementById(id);
    if(dom){
        dom.addEventListener("selectstart",(e)=>{
            e.preventDefault()
        })
        return true
    }
    return false
}
s.isGrid = function(){
    if(!s.params.lightBox && (s.params.sliderType == "12grid" || s.params.sliderType == "12mosaic"))
        return true;
}
s.is12grid = function(){
    if(!s.params.lightBox && s.params.sliderType == "12grid")
        return true;
}
s.is12mosaic = function(){
    if(!s.params.lightBox && s.params.sliderType == "12mosaic")
        return true;
}
s.isLightbox = function(){
    if(s.params.lightBox)
        return true;
}
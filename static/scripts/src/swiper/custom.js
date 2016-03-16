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

s.setSlideSize_12mosaic = function(slide, s){
    var width, height;
    var slide = jQuery(slide);
    var img = slide.find('img');
    var maxHeight = s.container.height() / s.params.slidesPerColumn;

    var attrWidth  = parseInt(img.attr('width'));
    var attrHeight  = parseInt(img.attr('height'));
    var ratio   = attrWidth / attrHeight;

    if(slide.is(':first-child')){
        height = s.container.height();
    }
    else{
        height = maxHeight;
    }
    width   = height * ratio;
    img.width(width)
         .height(height);
    slide.width(width)
         .height(height);
    img[0].style.setProperty('width', width + "px", 'important');
    img[0].style.setProperty('height', height + "px", 'important');
    return width;
}

s.setSlideSize_12grid = function(slide, s){
    var width, height;
    var slideWidth, slideHeight;
    var slide = jQuery(slide);
    var img = slide.find('img');
    var maxHeight = s.container.height() / s.params.slidesPerColumn - s.params.spaceBetween;

    var attrWidth  = parseInt(img.attr('width'));
    var attrHeight  = parseInt(img.attr('height'));
    var imgRatio   = attrWidth / attrHeight;
    var slideRatio   = 16 / 9; 

    if(s.params.width && s.params.height)
        slideRatio   = s.params.width / s.params.height;
    if(slide.is(':first-child')){
        slideHeight = s.container.height();
    }
    else{
        slideHeight = maxHeight;
    }
    slideWidth   = slideHeight * slideRatio;

    slide.width(slideWidth)
         .height(slideHeight);

    
    width   = attrWidth;
    height  = attrHeight;
    if((width > slideWidth) && (height > slideHeight)){
        if(slideHeight * imgRatio <= slideWidth){
            height  = slideHeight;
            width   = slideHeight * imgRatio;
        }
        else{
            width   = slideWidth;
            height  = slideWidth / imgRatio;
        }
    }
    else if(width > slideWidth){
        width   = slideWidth;
        height  = slideWidth / imgRatio;
    }
    else if(height > slideHeight){
        height  = slideHeight;
        width   = slideHeight * imgRatio;
    }
    
    img.width(width)
         .height(height);
    img[0].style.setProperty('width', width + "px", 'important');
    img[0].style.setProperty('height', height + "px", 'important');
    return slideWidth;
}
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
    var top = 0, left = 0;
    var slideWidth, slideHeight;
    var aspectWidth, aspectHeight;
    var slide = jQuery(slide);
    var img = slide.find('img');
    var maxHeight = s.container.height() / s.params.slidesPerColumn - s.params.spaceBetween;

    var attrWidth  = parseInt(img.attr('width'));
    var attrHeight  = parseInt(img.attr('height'));
    var imgRatio   = attrWidth / attrHeight;
    var slideRatio   = 16 / 9; 

    if(s.params.slider_width && s.params.slider_height)
        slideRatio   = s.params.slider_width / s.params.slider_height;
    if(slide.is(':first-child')){
        slideHeight = s.container.height();
    }
    else{
        slideHeight = maxHeight;
    }
    slideWidth   = slideHeight * slideRatio;

    width   = attrWidth;
    height  = attrHeight;
    if(slideRatio > imgRatio){
        width = "100%";
        height = "auto";
        aspectHeight = slideWidth / imgRatio;
        top = (slideHeight - aspectHeight) / 2;
    }
    else{
        width = "auto";
        height = "100%";
        aspectWidth = slideHeight * imgRatio;
        left = (slideWidth - aspectWidth) / 2;
    }
    img.css({
        width: width,
        height: height,
        position: 'relative',
        left: left + "px",
        top: top + "px"
    });
    img[0].style.setProperty('width', width , 'important');
    img[0].style.setProperty('height', height , 'important');

    slide.height(slideHeight);
    
    return slideWidth;
}
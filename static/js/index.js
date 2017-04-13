function template(config){
    if(!config.data && !$.isArray(config.data)) return;
    var defaultTemplate = {
        parentElement : 'body',
        element : '<span>{value}</span>',
    };

    var config = $.extend(defaultTemplate, config),
        i = 0,
        length = config.data.length,
        str = '';

    for(;i < length; i++){
        str += config.element.replace(/{value}/g, config.data[i])
    }

    $(config.parentElement).append(str);
}

template({
    parentElement : '.banner .swiper-wrapper',
    data : ['static/images/aboutme01.jpg','static/images/aboutme02.jpg','static/images/liucheng.jpg'],
    element : '<img class="swiper-slide" src={value} />'
});


function floor(){
    this.floors = $('.floor'); 
    this.flag = true;      
}

        
floor.prototype.getPosition =  function (){
    
    var positions = [];

    $.each(this.floors,function(i,e){
        positions.push(Math.ceil($(e).offset().top))
    })

    this.positions = positions;
}

    floor.prototype.move = function(){
        var self = this;
        $('html,body').animate({scrollTop:self.positions[self.next]}, 200, function(){
            self.flag = true;
        });
    }

    floor.prototype.nowPosition = function (height){
        var scrollY = window.scrollY,
            self = this,
            isBottom = $(document).scrollTop() >= height;
        if(scrollY > 0){
            this.positions.forEach(function (i, index){
                if(scrollY >= i){
                    if (isBottom) {  
                        self.now = index + 1;
                    } else{
                        self.now = index;
                    } 
                }
            });
        }else{
            self.now = 0;
        }
    }

    floor.prototype.event = function(){
        this.getPosition();
        var value = 0,
            self = this,
            length = self.floors.length - 1,
            height = $(document).height()-$(window).height(),
            scrollFunc = function(e){
                if(self.flag){
                    self.flag = false;
                    e = e || window.event; 
                    if(e.wheelDelta){//IE/Opera/Chrome 
                        value = e.wheelDelta; 
                    }else if(e.detail){//Firefox 
                        value = -e.detail; 
                    }
                    self.nowPosition(height);
                    if(value > 0){
                        self.next = self.now <= 0 ? 0 : self.now - 1;
                    }else if(value < 0){
                        self.next = self.now >= length ? length : self.now + 1;
                    } 
                    self.move();         
                }
                
                    e.stopPropagation();
                    e.preventDefault(); 
                
            } 
        /*注册事件*/ 
        if(document.addEventListener){ 
            document.addEventListener('DOMMouseScroll',scrollFunc,false); 
        }//W3C 
        window.onmousewheel=document.onmousewheel=scrollFunc;//IE/Opera/Chrome 

    }
    var bannerimageLength = $('.banner img').length;
    console.log()
    var newfloor= new floor();
    newfloor.event()

    var mySwiper = new Swiper('.swiper-container',{  
        
        speed:500,  //滚动页面的速度
        autoplay:3000,
        autoplayDisableOnInteraction : false,
        loop : true,
        lazyLoading : true,
        simulateTouch:false, //禁止触屏事件
        mode: 'horizontal',  // 滑动方向上下垂直  horizontal
        onSlideChangeEnd: function(swiper){
                                if(swiper.activeIndex == 1 || swiper.activeIndex == bannerimageLength+1){
                                    $('.ball').show();
                                }else{
                                    $('.ball').hide();
                                }
                            }
    });

    

    $(document).on('click','.arrow-left',function(){
        mySwiper.slideNext();
        return false;
    })

    $(document).on('click','.arrow-right',function(){
        mySwiper.slidePrev();
        return false;
    })

    $(document).on('mouseover','.swiper-container',function(){
        mySwiper.stopAutoplay()
    })

    $(document).on('mouseleave','.swiper-container',function(){
        mySwiper.startAutoplay()
    })
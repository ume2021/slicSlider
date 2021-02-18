
const SlicSlider = class{

  constructor(){
    // フィールド定義
    this.className='';              // 対象クラス名
    this.width=300;    // px単位
    this.height=200;   // px単位
    this.autoSlid=false;
    this.autoSlidInterval=4000;                             // ミリ秒指定
    this.slidBarDisplay=true;                               // スライドバー（左右のバー）：有無
    this.slidPointDisplay=true;                             // スライドポイント（画像下のスライド）：有無
    this._intervalId = 0;    // IntervalId
  }

  chkNum (val){
    if( Number.isNaN(val) ){
      return false;
    } else {
      if( val == null ){
        return false;
      } else {
        return true;
      }
    }
  }
    
  chkStr(val){
    if( typeof val == 'string' ){
      if( val.length == 0 ){
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
    
  chkBoolean (val){
    if( typeof val == 'boolean' ){
      return true;
    } else {
      return false;
    }
  };
  
  setInParamData(param){
    try{
    
      if( this.chkNum(param.width) ){
        this.width = param.width;
      }

      if( this.chkNum(param.height) ){
        this.height = param.height;
      }

      if( this.chkBoolean(param.autoSlid) ){
        this.autoSlid = param.autoSlid;
      }
    
      if( this.chkNum(param.autoSlidInterval) ){
        this.autoSlidInterval = param.autoSlidInterval;
      }

      if( this.chkBoolean(param.slidBarDisplay) ){
        this.slidBarDisplay = param.slidBarDisplay;
      }

      if( this.chkBoolean(param.slidPointDisplay) ){
        this.slidPointDisplay = param.slidPointDisplay;
      }

    }catch(error){
      console.error( "[param]P_CN:" + param.className + 
        " | P_W:" + param.width + 
        " | P_H:" + param.height + 
        " | P_AS:" + param.autoSlid + 
        " | P_ASI:" + param.autoSlidInterval + 
        " | P_SBD:" + param.slidBarDisplay + 
        " | P_SPD:" + param.slidPointDisplay + 
        " | " + error.toString() );
    }
  }
  
  slider(className, param=undefined){

    try{
    
      if( param != undefined ){
        this.setInParamData(param);
      }
      
      let elements = document.querySelectorAll("." + className);
      
      if( elements == undefined ){
        this.errorFunc = 'slider';
        this.errorCode = '01';
        this.error = 'param:className is not element';
        return;
      }
      
      if( elements.length == 0 ){
        this.errorFunc = 'slider';
        this.errorCode = '02';
        this.error = 'param:className is not element';
        return;
      }
      this.className = className;
      
      let parElement = elements[0].parentElement;
      parElement.style.width = this.width + "px";
      parElement.style.height = this.height + "px";
      parElement.classList.add('_slsl_background');
      
      let fAllNone = true;
      let index = 0;
      for( let el of elements ){
        // 元画像の縦横比を確認
        let ratioOrignalImage = 0;
        if( el.naturalHeight == undefined ){
          ratioOrignalImage = this.height / this.width;
        } else {
          ratioOrignalImage = el.naturalHeight / el.naturalWidth;
        }
      
        // 画像の幅・高さの変更
        if( ratioOrignalImage < 1 ){
          el.style.width = this.width + "px";
        } else {
          el.style.height = this.height + "px";
        }

        // 画像用クラス適用
        el.classList.add('_slsl_image');

        // 画像の初期表示確定
        if( el.hasAttribute("slid_active") ){
          if( el.getAttribute("slid_active") == 'active' ){
            el.style.display="block";
            fAllNone = false;
          } else {
            el.style.display="none";
            el.setAttribute("slid_active", '');
          }
        } else {
          el.style.display="none";
          el.setAttribute("slid_active", '');
        }
        
        // スライド本体にattributeを設定
        el.setAttribute('slid_index', index);
        index++;
      }
      
      if(fAllNone){
        elements[0].setAttribute("slid_active", 'active');
        elements[0].style.display = "block";
      }
      
      if( this.autoSlid ){
        // time out setting(対象関数のパラメータを受け渡しするために、無名関数内でCallすること）
        this._intervalId = setInterval(() =>{
          this.doNext(this.className, this.slidPointDisplay);
        } ,this.autoSlidInterval);
      }
      
      let delElement = document.querySelector('._slsl_slid_parent');
      if( delElement != undefined ){
        delElement.remove();
      }
      
      let elParent = document.createElement("div");
      elParent.classList.add('_slsl_slid_parent');
      elParent.style.width = this.width - 10 + "px";
      elParent.style.height = this.height - 5 + "px";
      elParent.style.top = "0px";
      elParent.style.left = "5px";
      
      // スライドバー/スライドポイント設定
      if( this.slidBarDisplay || this.slidPointDisplay ){
        
        let rightElement = null;
        
        // スライドバー設定
        if( this.slidBarDisplay ){
          let leftElement = document.createElement("div");
          leftElement.classList.add('_slsl_slidbar');
          leftElement.onclick = (mEvent) =>{
            this.doBefore(this.className, this.slidPointDisplay);
          }
          elParent.appendChild(leftElement);
          
          
          rightElement = document.createElement("div");
          rightElement.classList.add('_slsl_slidbar');
          rightElement.onclick = (mEvent) =>{
            this.doNext(this.className, this.slidPointDisplay);
          }
        }

        let parentEl = document.createElement("div");
        parentEl.classList.add('_slsl_slidpoint_parent');
        
        // スライドポイント設定
        if( this.slidPointDisplay ){
          let parCount = 30;
          if( parCount < elements.length ){
            parCount = elements.length;
          }
          
          for( let el of elements ){
            // 子要素（スライドポイント本体）
            let childEl = document.createElement("div");
            if( el.getAttribute('slid_active') == 'active' ){
              childEl.classList.add('_slsl_slidpoint_select');
            } else {
              childEl.classList.add('_slsl_slidpoint');
            }
            childEl.classList.add('_slsl_slidpoint_size');
            childEl.onclick = (mEvent) =>{
              this.doIndex(this.className, mEvent, el.getAttribute('slid_index'), this.slidPointDisplay);
            }
            
            // 要素追加
            parentEl.appendChild(childEl);
            
          }
        }
        
        elParent.appendChild(parentEl);
        
        // スライドバー（右）設定
        if( this.slidBarDisplay ){
          elParent.appendChild(rightElement);
        }
        
        // 親要素追加
        parElement.appendChild(elParent);
        
      }
      
    }catch(error){
      console.error( "[param]CN:" + this.className + 
        " | W:" + this.width + 
        " | H:" + this.height + 
        " | AS:" + this.autoSlid + 
        " | ASI:" + this.autoSlidInterval + 
        " | SBD:" + this.slidBarDisplay + 
        " | SPD:" + this.slidPointDisplay + 
        " | " + error.toString() );
    }
  }
  
  doNext(className, slidPointDisplay){
    try{
      let elements = document.querySelectorAll("." + className);
      
      let fNext = false;
      let fAllNone = true;
      let index = -1;
      for( let el of elements ){
        if( el.getAttribute("slid_active") == 'active' ){
          el.style.display="none";
          el.setAttribute("slid_active", '');
          fNext = true;
        } else {
          if( fNext ){
            el.style.display="block";
            el.setAttribute("slid_active", 'active');
            fNext = false;
            fAllNone = false;
            index = el.getAttribute('slid_index');
            break;
          } else {
            el.style.display="none";
            el.setAttribute("slid_active", '');
          }
        }
      }
      
      if( fAllNone ){
        elements[0].style.display="block";
        elements[0].setAttribute("slid_active", 'active');
        index = elements[0].getAttribute('slid_index');
      }
      
      // スライドポイント設定
      if( slidPointDisplay ){
        let elSlidPoints = document.querySelector("." + '_slsl_slidpoint_parent').children;
        let pointIndex = 0;
        for( let el of elSlidPoints ){
          if( index == pointIndex ){
            el.classList.add('_slsl_slidpoint_select');
            el.classList.remove('_slsl_slidpoint');
          } else {
            el.classList.add('_slsl_slidpoint');
            el.classList.remove('_slsl_slidpoint_select');
          }
          
          pointIndex++;
        }
      }

    }catch(error){
      console.error( "[param]CN:" + className + " | SPD:" + slidPointDisplay + " | " + error.toString() );
    }
  }
  
  doBefore(className, slidPointDisplay){
    try{
      let elements = document.querySelectorAll("." + className);
      
      let fAllNone = true;
      let index = -1;
      for( let el of elements ){
        index++;
        if( el.getAttribute("slid_active") == 'active' ){
          fAllNone = false;
          break;
        }
      }
      
      if( fAllNone ){
        elements[0].style.display="block";
        elements[0].setAttribute("slid_active", 'active');
        index = elements[0].getAttribute('slid_index');
      } else {
        // 非表示
        elements[index].style.display="none";
        elements[index].setAttribute("slid_active", '');
      
        // index調整
        if( index == 0 ){
          index = elements.length -1;
        } else {
          index--;
        }
        
        // 表示
        elements[index].style.display="block";
        elements[index].setAttribute("slid_active", 'active');
        index = elements[index].getAttribute('slid_index');
      }
      
      // スライドポイント設定
      if( slidPointDisplay ){
        let elSlidPoints = document.querySelector("." + '_slsl_slidpoint_parent').children;
        let pointIndex = 0;
        for( let el of elSlidPoints ){
          if( index == pointIndex ){
            el.classList.add('_slsl_slidpoint_select');
            el.classList.remove('_slsl_slidpoint');
          } else {
            el.classList.add('_slsl_slidpoint');
            el.classList.remove('_slsl_slidpoint_select');
          }
          
          pointIndex++;
        }
      }

    }catch(error){
      console.error( "[param]CN:" + className + " | SPD:" + slidPointDisplay + " | " + error.toString() );
    }
  }
  
  doIndex(className,mEvent,index,slidPointDisplay){
    try{
      let elements = document.querySelectorAll("." + className);
      
      let fAllNone = true;
      for( let el of elements ){
        if( el.getAttribute('slid_index') == index ){
          el.style.display="block";
          el.setAttribute("slid_active", 'active');
          fAllNone = false;
        }else{
          el.style.display="none";
          el.setAttribute("slid_active", '');
        }
      }
      
      if( fAllNone ){
        elements[0].style.display="block";
        elements[0].setAttribute("slid_active", 'active');
        index = elements[0].getAttribute('slid_index');
      }
      
      // スライドポイント設定
      if( slidPointDisplay ){
        let elSlidPoints = document.querySelector("." + '_slsl_slidpoint_parent').children;
        let pointIndex = 0;
        for( let el of elSlidPoints ){
          if( index == pointIndex ){
            el.classList.add('_slsl_slidpoint_select');
            el.classList.remove('_slsl_slidpoint');
          } else {
            el.classList.add('_slsl_slidpoint');
            el.classList.remove('_slsl_slidpoint_select');
          }
          
          pointIndex++;
        }
      }

    }catch(error){
      console.error( "[param]CN:" + className + " | I:" + index + " | SPD:" + slidPointDisplay + " | " + error.toString() );
    }
  }
  
}


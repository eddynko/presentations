if (! window.FeeblePoint2) { (function( FeeblePoint2, undefined ) {
	  
    //----------------------------------------------------------------------
    //  FeeblePoint2     edit a few basic settings here, if you need to
    //---------------------------------------------------------------------- 
    // disable things by setting to false:
    // if you disable a feature its keys settings will be ignored for you
  
    const WANT_LEGEND_IN_HEADER         = false; // show keys at top of page?
    const WANT_POINTER_ACTIONS          = true; // have pointer appear?
    const WANT_SLIDE_NAVIGATION_ACTIONS = false; // jump between headings?
  
    // change keys here!
    //  - use "shift", "alt", "ctrl" and the keycode, separated by +
    //  - case matters! (use the JavaScript keycode names)
    //  - set a value to empty ("") to disable a single action
    //  
    //  examples: "KeyP", "Digit9", "ctrl+alt+shift+KeyZ"
    
    const KEY_FOR_POINTER_FINGER = "KeyP";
    const KEY_FOR_POINTER_RING   = "shift+KeyP";
    const KEY_FOR_ADVANCE_SLIDE  = "Enter";
    const KEY_FOR_BACK_SLIDE     = "KeyB";
    const KEY_FOR_INDEX_SLIDE    = "Digit0";
  
    const SLIDE_TAG = 'h2'; // If you change this, probably need to fix CSS too
  
    // that's probably all you need to change
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
  
    const POINTER_FINGER="finger", POINTER_RING="ring",
    ADVANCE_SLIDE="advance", INDEX_SLIDE= "index", BACK_SLIDE= "back";
    let key_codes = {};
    key_codes[ POINTER_FINGER ] = KEY_FOR_POINTER_FINGER;
    key_codes[ POINTER_RING   ] = KEY_FOR_POINTER_RING;
    key_codes[ ADVANCE_SLIDE  ] = KEY_FOR_ADVANCE_SLIDE;
    key_codes[ INDEX_SLIDE    ] = KEY_FOR_INDEX_SLIDE;
    key_codes[ BACK_SLIDE     ] = KEY_FOR_BACK_SLIDE;
  
    let key_desc = {};
    key_desc[POINTER_FINGER] = "for pointer";
    key_desc[POINTER_RING]   = "for ring";
    key_desc[ADVANCE_SLIDE]  = "to advance";
    key_desc[INDEX_SLIDE]    = "to index/start";
    key_desc[BACK_SLIDE]     = "to go back";
  
    let key_controllers = {}
    const KEY_CONTROL   = "ctrl";
    const KEY_ALT       = "alt";
    const KEY_SHIFT     = "shift";
    const MODIFIER_KEYS = [KEY_CONTROL, KEY_ALT, KEY_SHIFT];  
    let key_action_names = [ // order used in header legend
      ADVANCE_SLIDE, INDEX_SLIDE, BACK_SLIDE,
      POINTER_FINGER, POINTER_RING 
    ]
    // actions that aren't pointer types are slide actions
    let POINTER_TYPES = [POINTER_FINGER, POINTER_RING];
    
    const CSS_JS_ENABLED = 'fp2';
    const CSS_CURSOR_OFF = 'fp2-cursor-off';
    const CSS_POINTER_DISPLAYED = "fp2-pointer-displayed";
    const CSS_KEY = "fp2-key";
    
    function get_key_controller(str){
      let is_enabled = false;
      let modifier_functions = [];
      let pretty = "";
      let key = "";
      if (str) {
        keys = str.split("+");
        for(let i=0; i<MODIFIER_KEYS.length; i++) {
          let mkey = MODIFIER_KEYS[i];
          let want_key = keys.includes(mkey);
          let pretty_mkey;
          if (mkey === KEY_CONTROL) {
            modifier_functions.push(function(e){return e.ctrlKey === want_key});
            pretty_mkey = "^";
          }else if (mkey === KEY_ALT) {
            modifier_functions.push(function(e){return e.altKey === want_key});
            pretty_mkey = "Alt";
          } else if (mkey === KEY_SHIFT) {
            modifier_functions.push(function(e){return e.shiftKey === want_key});
            pretty_mkey = "⇧";
          }
          if (want_key) {
            pretty += pretty_mkey + "&nbsp;";
          }
        }
        key = keys[keys.length-1];
        pretty += key.replace(/^(Key|Digit)/, "");
        is_enabled = true;
      }
      return {
        is_enabled: is_enabled,
        pretty: pretty,
        key: key,
        modifier_functions: modifier_functions
      }
    }
  
    function is_triggered_controller(event, action_name) {
      let controller = key_controllers[action_name];
      let is_triggered = false;
      if (controller && controller.key === event.code) {
        is_triggered = true;
        for (let i=0; i<controller.modifier_functions.length; i++) {
          is_triggered = is_triggered && controller.modifier_functions[i](event);
        }
      }
      return is_triggered;
    }
  
    let pointer_div;
    let is_pointer_displayed = false;
    let pointer_type = null;
    let curr_id = 0;
    let url = window.location.href;
    let qty_headings = 0;
    let headings = document.getElementsByTagName(SLIDE_TAG.toLowerCase());
    
    const body = document.body;
    body.classList.add("fp2");
    
    if (WANT_POINTER_ACTIONS) {
      
      function toggle_pointer_display(){
        if (is_pointer_displayed) {
          pointer_div.classList.remove(CSS_POINTER_DISPLAYED);
          body.classList.remove(CSS_CURSOR_OFF);
        } else {
          pointer_div.classList.add(CSS_POINTER_DISPLAYED);
          body.classList.add(CSS_CURSOR_OFF);
        }
        is_pointer_displayed = ! is_pointer_displayed;
      }
  
      function change_pointer_type(to_type) {
        if (pointer_type != to_type) {
          pointer_type = to_type;
          // clumsy to use innerHTML here... but it works
          pointer_div.innerHTML='<svg><use xlink:href="#' + pointer_type + '-svg"></use></svg>';
          POINTER_TYPES.forEach(function(type_name) {
            if (type_name == to_type) {
              pointer_div.classList.add(to_type);
            } else {
              pointer_div.classList.remove(type_name);
            }
          });
        }
      }
      
      document.onmousemove = function (event) {
        event = event || window.event; // IE-ism
        if (event.pageX == null && event.clientX != null) {
          event.pageX = event.clientX +
            (document.scrollLeft || body && body.scrollLeft || 0) -
            (document.clientLeft || body && body.clientLeft || 0);
          event.pageY = event.clientY +
            (document.scrollTop  || body && body.scrollTop  || 0) -
            (document.clientTop  || body && body.clientTop  || 0 );
        }
        pointer_div.style.left = event.pageX + "px";
        pointer_div.style.top  = event.pageY + "px";
      };
      
      pointer_div = document.createElement("div"); 
      pointer_div.id = "fp2-pointer";
      body.appendChild(pointer_div);
  
    }
    
    // set up key controllers
    let header_html_items = [];
    for (let i=0; i<key_action_names.length; i++){
      let action_name = key_action_names[i];
      if (key_codes[action_name]) {
        let is_a_pointer_action = POINTER_TYPES.includes(action_name);
        // only register keys implementing behaviour we want
        if ((WANT_POINTER_ACTIONS && is_a_pointer_action) 
          || (WANT_SLIDE_NAVIGATION_ACTIONS && ! is_a_pointer_action)) {
          let controller = get_key_controller(key_codes[action_name]);
          if (controller.is_enabled) {
            key_controllers[action_name] = controller;
            header_html_items.push(
              "<li>press <span class='" + CSS_KEY + "'>" + controller.pretty
              + "</span> " + key_desc[action_name] + "</li>"
            );
          }
        }
      }
    }
  
    if (WANT_SLIDE_NAVIGATION_ACTIONS) {
      let top_000 = document.createElement('span');
      top_000.id = "000";
      body.prepend(top_000);
    }
  
    if (WANT_LEGEND_IN_HEADER) {
      let header_html = header_html_items.join(",\n");
      if (header_html) {
        header_html = "<ul>" + header_html + "</ul>";
      }
      let header = document.createElement("header");
      header.id = "fp2-legend";
      header.innerHTML = header_html;
      body.prepend(header);
    }
  
    if (WANT_SLIDE_NAVIGATION_ACTIONS) {
      
      function get_id(n, offset) {
        if (typeof n === 'string') {
          n = parseInt(n, 10);
          if (isNaN(n)) { n = 0; }
        }
        if (offset > 0) {
          if (n < qty_headings - 1) { n += offset; }
        } else if (offset < 0){
          if (n > 0) { n += offset; }
        }
        return ("0000" + n).slice(-3);
      }
  
      function get_prev(n) { return get_id(n, -1); }
      function get_next(n) { return get_id(n, +1); }
      
      body.appendChild(document.createElement(SLIDE_TAG.toLowerCase()));
  
      for (var i=0; i < headings.length; i++) {
        let element = headings.item(i);
        element.classList.add("stop");
      }
  
      headings = document.getElementsByClassName("stop");
      qty_headings = headings.length;
      for (var i=0; i < qty_headings; i++) {
        let element = headings.item(i);
        element.id = get_id(i+1);
      };
      let ihash = url.indexOf('#');
      if (ihash > -1) {
        if (ihash < url.length-1) {
          curr_id = get_id(url.substring(ihash+1));
        }
        url = url.substring(0, ihash);
      }
      
      function goto(id) {
        element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({behavior: 'smooth', block: 'start'});
        } // else failed to find element with this id
      }
  
    }  
  
    /* risky for anything other than simple text: this might
       break embedded markup... good for <p> tags etc        */
    let rainbows = document.getElementsByClassName("rainbow");
    const re = /\s+/
    for (var i=0; i < rainbows.length; i++) {
      let text = rainbows[i].innerHTML;
      let texts = text.split(re);
      for (var j=0; j < texts.length; j++) {
        texts[j] = "<span class='" 
        + "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
         + "'>" + texts[j] + "</span>";
      }
      rainbows[i].innerHTML = texts.join(" ");
    }
    
    document.addEventListener('keydown', function(event) {
      let is_jump = false;
      if (is_triggered_controller(event, ADVANCE_SLIDE)) {
        curr_id = get_next(curr_id);
        is_jump = true;
      } else if (is_triggered_controller(event, BACK_SLIDE)) {
        curr_id = get_prev(curr_id);
        is_jump = true;
      } else if (is_triggered_controller(event, INDEX_SLIDE)) {
        curr_id = get_id(0, 0);
        is_jump = true;
      } else {
        let WANT_POINTER_ACTIONS_type = null;
        if (is_triggered_controller(event, POINTER_FINGER)) {
          WANT_POINTER_ACTIONS_type = POINTER_FINGER
        } else if (is_triggered_controller(event, POINTER_RING)) {
          WANT_POINTER_ACTIONS_type = POINTER_RING
        }
        if (WANT_POINTER_ACTIONS_type != null) {
          want_toggle = true;
          if (WANT_POINTER_ACTIONS_type != pointer_type) { // change the pointer type
            if (is_pointer_displayed) {
              want_toggle = false;
            }
            change_pointer_type(WANT_POINTER_ACTIONS_type);
          }
          if (want_toggle) {
            toggle_pointer_display();
          }
        }
      }
      if (is_jump) {
        goto(curr_id);
        window.history && window.history.pushState && window.history.pushState("", "", url + "#" + curr_id);
      }
    });
  
    }( window.FeeblePoint2 = window.FeeblePoint2 || {} ));
  }
function drop_down(x, y, wid, heit, options, meanings) {
	this.x = x;
	this.y = y;
	this.wid = wid;
	this.heit = heit;
	this.options = options;
	this.current_option = options[0];
	this.meanings = meanings;
	this.current_meaning = meanings[0];
	this.open = false;
	this.background_color = "#555555";
	this.list_background_color = "#777777";
	this.label_color = "#000000"
	
	this.draw = draw;
	function draw() {
		if (this.open) {
			draw_opaque_rectangle(this.x, this.y, this.wid, this.heit, this.background_color);
			rectangle([this.x, this.y], this.wid, this.heit);
			draw_label(this.current_option, this.x, this.y + this.heit, this.label_color);
			
			for (var i = 0; i < this.options.length; i++) {
				draw_opaque_rectangle(this.x, this.y + (i + 1) * this.heit, this.wid, this.heit, this.list_background_color);
				rectangle([this.x, this.y + (i + 1) * this.heit], this.wid, this.heit);
				draw_label(this.options[i], this.x, this.y + this.heit * (i + 2), this.label_color);
			}
		}
		else {
			draw_opaque_rectangle(this.x, this.y, this.wid, this.heit, this.background_color);
			rectangle([x, y], wid, heit);
			draw_label(this.current_option, x, y + heit, this.label_color);
		}
		
	}
	
	this.click = click;
	function click(x, y) {
		if (x > this.x && x < this.x + this.wid && y > this.y && y < this.y + this.heit) {
			this.open = !this.open;
		} 
		else if (this.open && x > this.x && x < this.x + this.wid && y > this.y + this.heit && y < this.y + this.heit * (this.options.length + 1)) {
			var index = Math.floor((y - this.y - this.heit) / this.heit);
			this.current_option = this.options[index];
			this.current_meaning= this.meanings[index];
			this.open = false;
			return true;
		}
		else {
			this.open = false;
		}
		
		return false;
	}
}

function button(label, x, y, buttonWid, buttonHeit, func, params, toggle, label2) {
  this.label = label;
  this.x = x;
  this.y = y;
  this.buttonWid = buttonWid;
  this.buttonHeit = buttonHeit;
  this.toggle = toggle;
  this.toggled = false;
  this.label2 = label2;
  this.func = func;
  this.params = params;
  this.visible = true;
  this.color = "yellow"

  this.draw = draw;
  function draw() {
	if (this.visible) {
		rectangle([this.x, this.y], this.buttonWid, this.buttonHeit, "black");
		var labelToDraw = this.toggled?this.label2:this.label;
		draw_label(labelToDraw, this.x + 1, this.y + this.buttonHeit - 2, this.color);
	}
  }

  this.press = press;
  function press(pressX, pressY) {
	if (this.visible) {
		if ((pressX > this.x) && (pressX < this.x + this.buttonWid) && (pressY > this.y) && (pressY < this.y + this.buttonHeit)) {
		  if (this.toggle) {
			this.toggled = !this.toggled;
			this.draw();
		  }

		  if (this.params == undefined) {
			this.func();
		  }
		  else {
			this.func(params);
		  }
		}
	}
  }
}
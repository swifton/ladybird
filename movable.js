function movable(x, y, rotation, direction) {
	this.x = x;
	this.y = y;
	this.new_x = x;
	this.new_y = y;
	this.display_x = x;
	this.display_y = y;
	
	this.rotation = rotation;
	this.new_rotation = rotation;
	this.display_rotation = rotation;
	
	this.direction = direction;
	this.new_direction = direction;
	
	this.update_display_position = update_display_position;
	function update_display_position(counter, lent) {
		this.display_x = (this.x * (lent - counter) + this.new_x * counter) / lent;
		this.display_y = (this.y * (lent - counter) + this.new_y * counter) / lent;
		this.display_rotation = (this.rotation * (lent - counter) + this.new_rotation * counter) / lent;
	}
	
	this.update_position = update_position;
	function update_position() {
		this.x = this.new_x;
		this.y = this.new_y;
		this.direction = this.new_direction;
		this.rotation = this.new_rotation;
	}
}
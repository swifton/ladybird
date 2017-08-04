realtime = true;

var field = [];
var field_wid = 25;
var field_heit = 15; 

var field_cell_size = 30;
var field_pos_x = 100;
var field_pos_y = 100;
var program_input_x = 1000;
var program_input_y = 100;

var directions = {
	up: 1,
	down: 3,
	left: 2,
	right: 0
}

var ladybird = new movable(3, 4, -Math.PI / 2, directions.up);
var log = new movable(0, 0, 0, 0);
var log_attached = false;

var transition_counter = 0;
var transition_lent = 30;

var ladybird_direction = directions.up;
var ladybird_new_direction = directions.up;


var ladybird_size = field_cell_size / 2;

for (var i = 0; i < field_wid; i++) {
	field.push([]);
	for (var j = 0; j < field_heit; j++) {
		field[i].push(0);	
		if (i == 20) {field[i][j] = -1;}
	}
}

var commands = {
	move: 0, 
	right: 1,
	left: 2, 
	pick_up: 3,
	wait: 4
}

var command_names_list = ['wait', 'move', 'left', 'right', 'pick_up'];
var commands_list = [commands.wait, commands.move, commands.left, commands.right, commands.pick_up];

var program = [commands.move, commands.move, commands.right, commands.move];
var program_input = [new drop_down(program_input_x, program_input_y, 50, 20, command_names_list, commands_list)];
var current_command = 0;

var start = new button("start", 1000, 500, 50, 20, start_simulation);

function step() {
	transition_counter += 1;
	ladybird.update_display_position(transition_counter, transition_lent);
	log.update_display_position(transition_counter, transition_lent);
	
	if (transition_counter == transition_lent) {
		ladybird.update_position();
		log.update_position();
		execute_program();
		transition_counter = 0;
	}
	
	resize_canvas();
	clear_canvas();
	
	draw_field();
	draw_ladybird();
	start.draw();
	draw_input();
	draw_log();
}

function mouse_click(x, y) {
	start.press(x, y);
	for (var i = 0; i < program_input.length; i++) {
		if (program_input[i].click(x, y) && i == program_input.length - 1) {
			program_input.push(new drop_down(program_input_x, program_input_y + program_input.length * 25, 50, 20, command_names_list, commands_list));
			break;
		}
	}	
}

function start_simulation() {
	program = [];
	for (var i = 0; i < program_input.length; i++) {
		program.push(program_input[i].current_meaning);
	}	
	current_command = 0;
}

function draw_input() {
	var selected_index;
	
	for (var i = 0; i < program_input.length; i++) {
		program_input[i].draw();
		if (program_input[i].open) {
			selected_index = i;
		}
	}
	
	if (selected_index != undefined) {
		program_input[selected_index].draw();
	}
}

function draw_field() {
	for (var i = 0; i < field_wid; i++) {
		for (var j = 0; j < field_heit; j++) {
			if (field[i][j] >=0) {
				rectangle([field_pos_x + i * field_cell_size, field_pos_y + j * field_cell_size], field_cell_size, field_cell_size);
			}
		}
	}
}

function draw_ladybird() {
	draw_filled_circle(field_pos_x + ladybird.display_x * field_cell_size + ladybird_size, field_pos_y + ladybird.display_y * field_cell_size + ladybird_size, ladybird_size, "red");
	
	draw_filled_circle(field_pos_x + ladybird.display_x * field_cell_size + ladybird_size * (1 + Math.cos(ladybird.display_rotation)), field_pos_y + ladybird.display_y * field_cell_size + ladybird_size * (1 + Math.sin(ladybird.display_rotation)), ladybird_size / 5, "black");
}

function draw_log() {
	var log_size = 20
	draw_opaque_rectangle(field_pos_x + log.display_x * field_cell_size, field_pos_y + log.display_y * field_cell_size, log_size, log_size, "brown");
}

function execute_program() {
	if (current_command < program.length) {
		switch (program[current_command]) {
			case commands.move:
				move_ladybird();
				break;
			
			case commands.right:
				ladybird.new_direction = (ladybird.direction  + 3) % 4;
				ladybird.new_rotation = ladybird.rotation + Math.PI / 2;
				break;
			
			case commands.left:
				ladybird.new_direction = (ladybird.direction + 1) % 4;
				ladybird.new_rotation = ladybird.rotation - Math.PI / 2;
				break;
			
			case commands.pick_up:
				if ((log.x == ladybird.x + 1 && log.y == ladybird.y) || (log.x == ladybird.x - 1 && log.y == ladybird.y) || (log.x == ladybird.x && log.y == ladybird.y + 1) || (log.x == ladybird.x && log.y == ladybird.y - 1)) {
					log_attached = true;
				}
				break;
			
			case commands.wait:
				break;
		}
		current_command += 1;
	}
}

function move_ladybird() {
	switch (ladybird.direction) {
		case directions.up:
			ladybird.new_y = ladybird.y - 1;
			break;
		
		case directions.down:
			ladybird.new_y = ladybird.y + 1;
			break;
		
		case directions.left:
			ladybird.new_x = ladybird.x - 1;
			break;
		
		case directions.right:
			ladybird.new_x = ladybird.x + 1;
			break;
	}
	
	if (ladybird.new_x < 0 || ladybird.new_y < 0 || ladybird.new_x > field_wid || ladybird.new_y > field_heit) {
		ladybird.new_x = ladybird.x;
		ladybird.new_y = ladybird.y;
		return;
	}
	
	if (field[ladybird.new_x][ladybird.new_y] < 0) {
		ladybird.new_x = ladybird.x;
		ladybird.new_y = ladybird.y;
		return;
	}
	/*
	if (ladybird.new_x == log.x && ladybird.new_y == log.y) {
		if (ladybird.new_x < 0 || ladybird.new_y < 0 || ladybird.new_x > field_wid || ladybird.new_y > field_heit) {
			ladybird.new_x = ladybird.x;
			ladybird.new_y = ladybird.y;
			return;
		}
		else if () {
			
		}
	}
	else*/ if (log_attached) {
		log.new_x = ladybird.x;
		log.new_y = ladybird.y;
	}
}

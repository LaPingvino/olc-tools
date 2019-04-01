//the length is calculated of a full code without the plus
function numberOfCodes(length, level) {
	if (length > 10) {
		n = 5 + (length - 10);
	} else {
		n = length / 2;
	}
	corners = 0;
	level++;
	if (level%2 == 0) {
		corners = 4;
	}
	level = Math.floor(level/2);
	return n * (2*level + 1) * (2*level + 1) - corners;
}

function digitton(digit) {
	DIGITS = "23456789CFGHJMPQRVWX";
	for (i=0;i<20;i++) {
		if (DIGITS[i] == digit) {
		return i;
		}
	}
}

//637
//204
//518

//R V W X
//J M P Q
//C F G H
//6 7 8 9
//2 3 4 5
function smallnb(digit, direction) {
	DIGITS = "23456789CFGHJMPQRVWX";
	switch (direction) {
		case 0:
			return digit;
		case 1:
			return DIGITS[(digitton(digit)+16)%20];
		case 2:
			return DIGITS[(digitton(digit)+(digitton(digit)%4==0?+3:-1))%20];
		//TODO: continue here
	}
}

//23456789CFGHJMPQRVWX
function largenb(digits, direction) {
}

function showProximity(code, level=0) {	
	codes = [code];
	length = numberOfCodes(code.replace("+", "").length);
	for(i=length;i>0;i--) {
		code //TODO: continue here
	}
}

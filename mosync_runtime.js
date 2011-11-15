/*
Copyright (C) 2011 MoSync AB

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License,
version 2, as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
MA 02110-1301, USA.
*/

//Return the canvas position on the document.
function getCanvasElementPosition(element) {
	//Top left corner of the canvas is used as the
	//reference to calculate the mouse position
	var posX = element.offsetLeft;
	var posY = element.offsetTop;
	var canvasPos = new Array(0);
	canvasPos['x'] = posX;
	canvasPos['y'] = posY;
	return canvasPos;
}

//Retrieve the mouse position on canvas
function getMousePositionInElement(element, event) {
	var elementPosition = getCanvasElementPosition(element); //canvas position on the page
	var mousePosition = getMousePosition(event); //mouse cordinates on the page.
	var x = mousePosition.x - elementPosition.x;
	var y = mousePosition.y - elementPosition.y;
	var position = new Array(); //mouse position w.r.t canvas
	position['x'] = x;
	position['y'] = y;
	return position;
}

//Retrieve the mouse co-ordinates in the document (web page)
function getMousePosition(event) {
	var x = event.pageX;
	var y = event.pageY;
	var mouseposition = new Array();
	mouseposition['x'] = x;
	mouseposition['y'] = y;
	return mouseposition;
}

function loadImageFromData(binary, offset, size) {
	image = new Image();
	var format = "png";
	if(binary.readUint8(offset+0) == 0xff
		&& binary.readUint8(offset+1) == 0xd8)
		format = "jpeg";
							
	// base64 for image1: 
	// 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
			
	base64img = "data:image\/" + format + ";base64," + Base64.encode(binary, offset, size);				
	image.src = base64img;
	return image;
}

function Syscall(core) {
	this.core = core;
	this.ctx = null;
	this.currentColor = "rgb(0, 255, 0)";
	this.currentIntColor = 0;
	this.currentClipRect = [];
	this.events = [];
	this.loadedResources = [];
	this.maIOCtl = MoSyncGenerated.maIOCtl;
}
	
// expects instance of class Memory
Syscall.prototype.loadResources = function (binary) {
	var offset = 0;
	
	if(binary.readInt8(offset++) != 'M'.charCodeAt(0)) return false;
	if(binary.readInt8(offset++) != 'A'.charCodeAt(0)) return false;
	if(binary.readInt8(offset++) != 'R'.charCodeAt(0)) return false;
	if(binary.readInt8(offset++) != 'S'.charCodeAt(0)) return false;
	
	function readUnsignedVarInt() {
		var res = 0;
		var nBytes = 0;
		while(true) {
			var b = binary.readUint8(offset++);
			res |= (b&0x7f)<<(nBytes*7);
			if(b > 0x7f)
				break;
			nBytes++;
			if(nBytes >= 4) {
				// fail
				return 0;
			}
		}
		return res;
	}

	
	var numResources = readUnsignedVarInt();
	var resSize = readUnsignedVarInt();

	var handle = 1;
	this.loadedResources.push(0);
	while(true) {
		var type = binary.readUint8(offset++);
		if(type == 0) break;
		
		var size = readUnsignedVarInt();
		var resource = {type: type, size: size, data: 0};
		
		this.loadedResources.push(resource);
		
		switch(type) {
			case MoSyncConstants.RT_PLACEHOLDER:
				
				break;	
			case MoSyncConstants.RT_UBIN:
			case MoSyncConstants.RT_BINARY:
				var memory = new Memory(size);
				for(var i = 0; i < size; i++) {
					memory.writeUint8(i, binary.readUint8(offset+i));
				}
				resource.data = memory;
			break;
			case MoSyncConstants.RT_IMAGE:
				resource.data = loadImageFromData(binary, offset, size);
			break;
		}
		
		offset+=size;
		handle ++;
	}
	
	return true;
}

Syscall.prototype.initCanvasContextDefaults = function(ctx) {
	ctx.lineWidth   = 1;
	ctx.font = 'bold 12px sans-serif';
	ctx.textBaseline = 'top';
	ctx.fillStyle = this.currentColor;
	ctx.strokeStyle = this.currentColor;

	ctx.restore();
	ctx.save(); 
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(ctx.canvas.width, 0);
	ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
	ctx.lineTo(0, ctx.canvas.height);
	ctx.clip();

}

Syscall.prototype.createNewEmptyCanvas = function() {
	// remove and recreate canvas (if we switch between webgl and old canvas..)
	var containerElement = document.getElementById("msCanvasContainer");
	var canvasElement = document.getElementById("msCanvas");
	var oldWidth = canvasElement.width;
	var oldHeight = canvasElement.height;
	containerElement.removeChild(canvasElement);
	this.visibleCanvas =  document.createElement('canvas');
	containerElement.appendChild(this.visibleCanvas);
	this.visibleCanvas.setAttribute("id","msCanvas");
	this.visibleCanvas.width = oldWidth;
	this.visibleCanvas.height = oldHeight;
	// -----------------------------------------------------------------------------
}


Syscall.prototype.initContext = function() {
	this.createNewEmptyCanvas();

	this.visibleCanvas = document.getElementById("msCanvas");
	this.visibleCanvasContext = this.visibleCanvas.getContext("2d");
	
	this.backBuffer = document.createElement('canvas');
	this.backBuffer.width = this.visibleCanvas.width;
	this.backBuffer.height = this.visibleCanvas.height;
	this.backBufferContext2D = this.backBuffer.getContext('2d');
	
	this.ctx = this.backBufferContext2D;
	//this.ctx = canvas.getContext("2d");

	this.initCanvasContextDefaults(this.ctx);
	
	/*
	this.ctx.lineWidth   = 1;
	this.ctx.font = 'bold 12px sans-serif';
	this.ctx.textBaseline = 'top';
	this.ctx.fillStyle = this.currentColor;
	this.ctx.strokeStyle = this.currentColor;
	*/
//	ctx.translate(0.5, 0.5);

	this.maSetColor(0);
	this.ctx.fillRect (0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	this.maUpdateScreen();
}

Syscall.prototype.maSetClipRect = function(x, y, w, h) {
	this.currentClipRect = [x, y, w, h];
	this.ctx.restore();
	this.ctx.save(); 
	this.ctx.beginPath();
	this.ctx.moveTo(x, y);
	this.ctx.lineTo(x+w, y);
	this.ctx.lineTo(x+w, y+h);
	this.ctx.lineTo(x, y+h);
	this.ctx.clip();
};

Syscall.prototype.maGetClipRect = function(out) {
	var mem_ds = this.core.mem_ds;
	for(var i = 0; i < 4; i++) {
		mem_ds.writeInt32(out + i*4, currentClipRect[i]);
	}
}

Syscall.prototype.init = function() {
	this.initContext();		
	this.maSetClipRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

	this.startTime = (new Date().getTime());
	
	var syscall = this;
	document.onmousedown = function(event) {
		syscall.mouseDown = true;
		var pos = getMousePositionInElement(syscall.visibleCanvas, event);
		if(pos.x<0 || pos.y<0 || pos.x>=syscall.backBuffer.width || pos.y>=syscall.backBuffer.height)
			return;
		syscall.events.push([MoSyncConstants.EVENT_TYPE_POINTER_PRESSED, pos.x, pos.y]);
		syscall.core.wakeVm();
	}
	
	document.onmouseup = function(event) {
		syscall.mouseDown = false;
		var pos = getMousePositionInElement(syscall.visibleCanvas, event);
		if(pos.x<0 || pos.y<0 || pos.x>=syscall.backBuffer.width || pos.y>=syscall.backBuffer.height)
			return;		
		syscall.events.push([MoSyncConstants.EVENT_TYPE_POINTER_RELEASED, pos.x, pos.y]);
		syscall.core.wakeVm();
	}
		
	document.onmousemove = function(event) {
		if(typeof(syscall.mouseDown) == "undefined") {
			return;	
		}
			
		var pos = getMousePositionInElement(syscall.visibleCanvas, event); 
		if(pos.x<0 || pos.y<0 || pos.x>=syscall.backBuffer.width || pos.y>=syscall.backBuffer.height)
			return;
		if(syscall.mouseDown) {
			syscall.events.push([MoSyncConstants.EVENT_TYPE_POINTER_DRAGGED, pos.x, pos.y]);
			syscall.core.wakeVm();
		}		
	}

	function mapKeyCode(jsKeyCode) {
		//console.log("keycode: " + jsKeyCode);
		switch(jsKeyCode) {
			case 16: return MoSyncConstants.MAK_SOFTLEFT;
			case 18: return MoSyncConstants.MAK_SOFTRIGHT;
			case 17: return MoSyncConstants.MAK_FIRE; // space
			case 37: return MoSyncConstants.MAK_LEFT;
			case 38: return MoSyncConstants.MAK_UP;
			case 39: return MoSyncConstants.MAK_RIGHT;
			case 40: return MoSyncConstants.MAK_DOWN;		
		}
		
		return 0;
	}
	
	document.onkeydown = function(event) {
		wkey = event.which?event.which:event.keyCode;
		//console.log("key press!");
		syscall.events.push([MoSyncConstants.EVENT_TYPE_KEY_PRESSED, mapKeyCode(wkey)]);
		syscall.core.wakeVm();		
	}
	
	document.onkeyup = function(event) {
		//console.log("key release!");
		wkey = event.which?event.which:event.keyCode;
		syscall.events.push([MoSyncConstants.EVENT_TYPE_KEY_RELEASED, mapKeyCode(wkey)]);		
		syscall.core.wakeVm();
	}
	
	this.framebuffer = null;
	
	//this.initFloatSupport();
}

Syscall.prototype.maGetEvent = function(out) {
	if(this.events.length == 0) return 0;
	event = this.events.shift();
	
	var mem_ds = this.core.mem_ds;

	for(i = 0; i < event.length; i++) {
		mem_ds.writeInt32(out + i*4, event[i]);
	}
	
	//console.log("Got event " + event);
	
	return 1;
}

Syscall.prototype.maWait = function(delay) {
	if(this.events.length != 0) return;
	//console.log(delay);
	delay = delay>>>0;
	if(delay == 0) delay = 0xffffffff;
	throw {type: "sleep", data:(delay)};
}

Syscall.prototype.maGetMilliSecondCount = function() {
	var time = new Date().getTime();
	return (time - this.startTime);
}

Syscall.prototype.maSetColor = function(col) {
	var oldColor = this.currentIntColor;
	this.currentIntColor = col;
	r = (col&0x00ff0000)>>16;
	g = (col&0x0000ff00)>>8;
	b = (col&0x000000ff);
	this.currentColor = "rgb(" + r + ", " + g + ", " + b + ")";
	this.ctx.fillStyle = this.currentColor;
	this.ctx.strokeStyle = this.currentColor;
	return oldColor;
}

function EXTENT(x, y) {
	return ((x&0xffff)<<16)|(y&0xffff);
}

Syscall.prototype.maGetScrSize = function() {
	return EXTENT(this.ctx.canvas.width, this.ctx.canvas.height);
}

Syscall.prototype.maFillRect = function(x, y, w, h) { 
	this.ctx.fillRect (x, y, w, h);
}

// should be a bit faster :)
function fastBlit(fbufdata, mem_dsU8, length) {
	var ptr = 0;
	var iptr = 0;
	var pixel = 0;
	var n = length & 0x7;
	if(n>0) {
		do {
			fbufdata[ptr] = mem_dsU8[ptr++];
			fbufdata[ptr] = mem_dsU8[ptr++];
			fbufdata[ptr] = mem_dsU8[ptr++];
			ptr++;
		} while(--n);
	}
	
	n = length >> 3;
	
  	do 
  	{
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		fbufdata[ptr] = mem_dsU8[ptr++];
		ptr++;
	}
	while (--n);	
}


function slowBlit(fbufdata, mem_dsU32, length) {
		var ptr = 0;
		while(--length) {
			fbufdata[ptr] = mem_dsU8[ptr++];
			fbufdata[ptr] = mem_dsU8[ptr++];
			fbufdata[ptr] = mem_dsU8[ptr++];
			fbufdata[ptr++] = 255;
		}
}

Syscall.prototype.maUpdateScreen = function() {

	if(this.framebuffer != null) {
		var fbufdata = this.framebuffer.data;
		var length = this.framebuffer.data.length>>>2;
		
		//slowBlit(fbufdata, this.framebufferPointer, length);
		fastBlit(fbufdata, this.framebufferPointer, length);
		this.visibleCanvasContext.putImageData(this.framebuffer, 0, 0);		
	} else {
		this.visibleCanvasContext.drawImage(this.backBuffer, 0, 0);
	}
	
	//throw {type: "sleep", data:1};
}

Syscall.prototype.maDrawText = function(x, y, text) {
	text = this.core.pointerToString(text);
	//console.log("maDrawText(" + x + ", " + y + ", " + text + ")");
	this.ctx.fillText  (text, x, y);
}

Syscall.prototype.maGetTextSize = function(text) {
	metrics = this.ctx.measureText(this.core.pointerToString(text));
	return EXTENT(metrics.width, 12);
}

Syscall.prototype.maDrawTextW = function(x, y, text) {
	text = this.core.pointerToString(text, true);
	//console.log("maDrawText(" + x + ", " + y + ", " + text + ")");
	this.ctx.fillText  (text, x, y);
}

Syscall.prototype.maGetTextSizeW = function(text) {
	metrics = this.ctx.measureText(this.core.pointerToString(text, true));
	return EXTENT(metrics.width, 12);
}

Syscall.prototype.maLine = function(x1, y1, x2, y2) {
	// skip antialiasing.
	x1+=0.5;
	x2+=0.5;
	y1+=0.5;
	y2+=0.5;
	
	this.ctx.beginPath();
	this.ctx.moveTo(x1, y1);
	this.ctx.lineTo(x2, y2);
	this.ctx.stroke();
	this.ctx.closePath();
}

Syscall.prototype.maPlot = function(posX, posY) {
}

Syscall.prototype.maResetBacklight = function() {

}

Syscall.prototype.maDrawImage = function(handle, posX, posY) {
	//console.log("maDrawImage("+ handle + ", " + posX + ", " + posY + ")");
	var img = this.loadedResources[handle].data;	
	//console.log(img);
	this.ctx.drawImage(img, posX, posY);
}

Syscall.prototype.maDrawImageRegion = function(handle, srcRect, dstPoint, rotation) {
	var img = this.loadedResources[handle].data;	
	//this.ctx.drawImage(img, mem_ds.readInt32(dstPoint), mem_ds.readInt32(dstPoint+4));	
	var mem_ds = this.core.mem_ds;

	var dstX = mem_ds.readInt32(dstPoint);
	var dstY = mem_ds.readInt32(dstPoint+4);
	var srcX = mem_ds.readInt32(srcRect);
	var srcY = mem_ds.readInt32(srcRect+4);
	var srcW = mem_ds.readInt32(srcRect+8);
	var srcH = mem_ds.readInt32(srcRect+12);
	
	this.ctx.drawImage(img, srcX, srcY, srcW,
	srcH, dstX, dstY, srcW, srcH);
	
}

//int maCreateImageFromData 	( 	MAHandle  	placeholder,
//		MAHandle  	data,
//		int  	offset,
//		int  	size 
//	)

Syscall.prototype.maGetImageData = function(image, dst, srcRect, scanlength) {
	var res = this.loadedResources[image];
	var srcX = this.core.mem_ds.readInt32(srcRect);
	var srcY = this.core.mem_ds.readInt32(srcRect+4);
	var srcW = this.core.mem_ds.readInt32(srcRect+8);
	var srcH = this.core.mem_ds.readInt32(srcRect+12);
	
	var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
	canvas.width = srcW;
	canvas.height = srcH;
   	context.drawImage(res.data, srcX, srcY, srcW,
	srcH, 0, 0, srcW, srcH);
	
	var imageData = context.getImageData(0, 0, srcW, srcH);
	var length = imageData.data.length;
	
	scanlength <<= 2;
	var index = 0;
	for(var y = 0; y < srcH; y++) {
		var dst_scan = dst;
		for(var x = 0; x < srcW; x++) {
			this.core.mem_ds.writeUint8(dst_scan+2, imageData.data[index++]); 			
			this.core.mem_ds.writeUint8(dst_scan+1, imageData.data[index++]); 			
			this.core.mem_ds.writeUint8(dst_scan+0, imageData.data[index++]); 			
			this.core.mem_ds.writeUint8(dst_scan+3, imageData.data[index++]);
			dst_scan+=4;
		}
		dst+=scanlength;
	}
}

Syscall.prototype.maCreateImageRaw = function(placeholder, src, size, alpha) {
	var res = this.loadedResources[placeholder];
	width = size>>>16;
	height = size&0xffff;

	var imageData = this.visibleCanvasContext.createImageData(width, height);

	var index = 0;
	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			imageData.data[index++] = this.core.mem_ds.readUint8(src++);
			imageData.data[index++] = this.core.mem_ds.readUint8(src++);
			imageData.data[index++] = this.core.mem_ds.readUint8(src++);
			imageData.data[index++] = this.core.mem_ds.readUint8(src++);
		}
	}
	
	var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.putImageData(imageData, 0, 0);
    
  	res.type = MoSyncConstants.RT_IMAGE;
	res.data = canvas;
	res.canvasContext = context;	
}

Syscall.prototype.maCreateImageFromData = function(placeholder, data, offset, size) {
	var dstRes = this.loadedResources[placeholder];
	var srcRes = this.loadedResources[data];
	dstRes.type = MoSyncConstants.RT_IMAGE;
	dstRes.data = loadImageFromData(srcRes.data, offset, size);
	
	return 1; // RES_OK
}

Syscall.prototype.maCreateDrawableImage = function(placeholder, width, height) {
	var resource = this.loadedResources[placeholder];
	var img = document.createElement('canvas');
	img.width = width;
	img.height = height;
	var imgContext = img.getContext('2d');

	this.initCanvasContextDefaults(imgContext);
	
	resource.type = MoSyncConstants.RT_IMAGE;
	resource.data = img;
	resource.canvasContext = imgContext;
	
	//this.currentClipRect = [x, y, w, h];
	//this._maSetClipRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		
}

Syscall.prototype.maSetDrawTarget = function(target) {
	if(target == 0) {
		this.ctx = this.backBufferContext2D;
	} else {
		var resource = this.loadedResources[target];
		if(resource.type != MoSyncConstants.RT_IMAGE)
			return;
		this.ctx = resource.canvasContext;
	}
}

Syscall.prototype.maGetImageSize = function(handle) {
	//console.log("maGetImageSize("+ handle + ")");
	var img = this.loadedResources[handle].data;	
	//console.log("Image.dimensions(" + img.width + " "+ img.height);
	return EXTENT(img.width, img.height);
}

Syscall.prototype.maLocalTime = function() {
	var date = new Date();
	
	return (date.getTime()/1000 - date.getTimezoneOffset()*60) & 0xffffffff;
}

Syscall.prototype.maTime = function() {
	var date = new Date();
	
	return (date.getTime()/1000) & 0xffffffff;
}
			
Syscall.prototype.maCheckInterfaceVersion = function(inf) {
	if((inf>>>0) != MoSyncHash)	alert("Interface mismatch!");
	return MoSyncHash;
}

Syscall.prototype.strcmp = function(a, b) {
	var ac, bc;	
	var mem_ds = this.core.mem_ds;
	
	do {
		ac = mem_ds.readUint8(a++);
		bc = mem_ds.readUint8(b++);
	} while(ac && bc && ac!=bc);
	return bc-ac;
}

Syscall.prototype.memset = function(ptr, val, size) {
	var mem_ds = this.core.mem_ds;
	
	ival = (val<<24)|(val<<16)|(val<<8)|val;
	var leadingBytes = (ptr&0x3);
	if(leadingBytes != 0)
		leadingBytes = 4 - leadingBytes;
	var alignedSize = ((size-leadingBytes)&0xfffffffc)>>>2;
	var trailingBytes = (((size-leadingBytes))&0x3);
	
	
	while(leadingBytes != 0) {
		mem_ds.writeUint8(ptr++, val);
		leadingBytes--;
	}
		
	while(alignedSize != 0) {
		mem_ds.writeUint32(ptr, ival);
		ptr += 4;
		alignedSize--;
	}

	
	while(trailingBytes != 0) {
		mem_ds.writeUint8(ptr++, val);	
		trailingBytes--;
	}
	
	return ptr;	
}

Syscall.prototype.memcpy = function(dst, src, size) {
	var mem_ds = this.core.mem_ds;
	
	if((dst&0x3) == (src&0x3)) {
		var leadingBytes = (dst & 0x3);
		if(leadingBytes != 0)
			leadingBytes = 4 - leadingBytes;		
		var alignedSize = ((size-leadingBytes)&0xfffffffc)>>>2;
		var trailingBytes = (((size-leadingBytes))&0x3);
	

		while(leadingBytes != 0) {
			mem_ds.writeUint8(dst++, mem_ds.readUint8(src++));
			leadingBytes--;
		}

		while(alignedSize != 0) {
			mem_ds.writeUint32(dst, mem_ds.readUint32(src));
			dst += 4;
			src += 4;
			alignedSize--;
		}
		
		while(trailingBytes != 0) {
			mem_ds.writeUint8(dst++, mem_ds.readUint8(src++));
			trailingBytes--;
		}		
	} else {
		for(var i = size; i > -1; i--) {
			mem_ds.writeUint8(dst+i, mem_ds.readUint8(src+i));
		}
	}
	
	return dst;	
}

Syscall.prototype.strcpy = function(dst, src) {
	var character = 0;
	var mem_ds = this.core.mem_ds;
	var initialdst = dst;
	do {
		character = mem_ds.readUint8(src++);
		mem_ds.writeUint8(dst++, character);
	} while(character != 0);

	return initialdst;	
}

// make temporary buffers for handling conversion...
function bitsToNumberTypedArray(d1, d2) {
	if(d2 == undefined) {
		floatIntView[0] = d1;
		return float32View[0];
	} else {
		floatIntView[0] = (d1>>>0);
		floatIntView[1] = (d2>>>0);
		return float64View[0];
	}
}


function bitsToNumberDataView(d1, d2) {
	if(d2 == undefined) {
		floatDataView.setUint32(0, d1);
		return floatDataView.getFloat32(0);
	} else {
		floatDataView.setUint32(0, d2);
		floatDataView.setUint32(4, d1);
		return floatDataView.getFloat64(0);
	}
}

// returns arraybuffer
function numberToFloatBitsTypedArray(val) {
	float32View[0] = val;
	return floatIntView[0];
}

function numberToFloatBitsDataView(val) {
	floatDataView.setFloat32(0, val);
	return floatDataView.getUint32(0);
}

function numberToDoubleBitsDataView(val) {
	floatDataView.setFloat64(0, val);
	return {hi:floatDataView.getUint32(4), lo:floatDataView.getUint32(0)};
}

function numberToDoubleBitsTypedArray(val) {
	float64View[0] = val;
	return {hi:floatIntView[0], lo:floatIntView[1]};
}

// these temporary buffers should be global as I've done.
function initFloatSupport() {
	floatArrayBuffer = new ArrayBuffer(8);
	if(window.Float64Array) {
		floatIntView = new Uint32Array(floatArrayBuffer, 0, 2);
		float64View = new Float64Array(floatArrayBuffer, 0, 1);
			
		bitsToNumber = bitsToNumberTypedArray;
		numberToDoubleBits = numberToDoubleBitsTypedArray;
	} else {
		floatDataView = new DataView(floatArrayBuffer);
		bitsToNumber = bitsToNumberDataView;
		numberToDoubleBits = numberToDoubleBitsDataView;
	}
	
	if(window.Float32Array) {
		floatIntView = new Uint32Array(floatArrayBuffer, 0, 2);
		float32View = new Float32Array(floatArrayBuffer, 0, 2);
		numberToFloatBits = numberToFloatBitsTypedArray;
	} else {
		floatDataView = new DataView(floatArrayBuffer);
		numberToFloatBits = numberToFloatBitsDataView;
	}
}

initFloatSupport();

Syscall.prototype.sin = function(d1, d2) {
	var value = bitsToNumber(d1, d2);
	value = Math.sin(value);
	return numberToDoubleBits(value);
}

Syscall.prototype.cos = function(d1, d2) {
	var value = bitsToNumber(d1, d2);
	value = Math.cos(value);
	return numberToDoubleBits(value);
}

Syscall.prototype.tan = function(d1, d2) {
	var value = bitsToNumber(d1, d2);
	value = Math.tan(value);
	return numberToDoubleBits(value);
}

Syscall.prototype.sqrt = function(d1, d2) {
	var value = bitsToNumber(d1, d2);
	value = Math.sqrt(value);
	return numberToDoubleBits(value);
}

Syscall.prototype.dcmp = function(a1, a2, b1, b2) {
	var v1 = bitsToNumber(a1, a2);
	var v2 = bitsToNumber(b1, b2);
	if(v1<v2) return -1;
	else if(v1>v2) return 1;
	else return 0;
}

Syscall.prototype.__muldf3 = function(a1, a2, b1, b2) {
	var v1 = bitsToNumber(a1, a2);
	var v2 = bitsToNumber(b1, b2);	
	return numberToDoubleBits(v1*v2);
}

Syscall.prototype.__divdf3 = function(a1, a2, b1, b2) {
	var v1 = bitsToNumber(a1, a2);
	var v2 = bitsToNumber(b1, b2);
	if(v2 == 0) return numberToDoubleBits(Number.POSITIVE_INFINITY);
	return numberToDoubleBits(v1/v2);
}

Syscall.prototype.__adddf3 = function(a1, a2, b1, b2) {
	var v1 = bitsToNumber(a1, a2);
	var v2 = bitsToNumber(b1, b2);	
	return numberToDoubleBits(v1+v2);
}

Syscall.prototype.__subdf3 = function(a1, a2, b1, b2) {
	var v1 = bitsToNumber(a1, a2);
	var v2 = bitsToNumber(b1, b2);	
	return numberToDoubleBits(v1-v2);
}

Syscall.prototype.__fixdfsi = function(d1, d2) {
	var value = bitsToNumber(d1, d2);
	return ((value&0xffffffff) | 0);
}
//var ret = this.Syscalls.___fixunsdfsi(this.regs[Reg.i0], this.regs[Reg.i1]);
Syscall.prototype.__fixunsdfsi = function(d1, d2) {
	var value = bitsToNumber(d1, d2);
	return (value&0xffffffff) >>> 0;
}

Syscall.prototype.__floatsidf = function(integer) {
	return numberToDoubleBits(integer);	
}

Syscall.prototype.__extendsfdf2 = function(f) {
	return numberToDoubleBits(bitsToNumber(f));
}

Syscall.prototype.fcmp = function(a, b) {
	var v1 = bitsToNumber(a);
	var v2 = bitsToNumber(b);
	if(v1<v2) return -1;
	else if(v1>v2) return 1;
	else return 0;
}

Syscall.prototype.__mulsf3 = function(a, b) {
	var v1 = bitsToNumber(a);
	var v2 = bitsToNumber(b);	
	return numberToFloatBits(v1*v2);
}

Syscall.prototype.__divsf3 = function(a, b) {
	var v1 = bitsToNumber(a);
	var v2 = bitsToNumber(b);
	if(v2 == 0) return numberToFloatBits(Number.POSITIVE_INFINITY);
	return numberToFloatBits(v1/v2);
}

Syscall.prototype.__addsf3 = function(a, b) {
	var v1 = bitsToNumber(a);
	var v2 = bitsToNumber(b);	
	return numberToFloatBits(v1+v2);
}

Syscall.prototype.__subsf3 = function(a, b) {
	var v1 = bitsToNumber(a);
	var v2 = bitsToNumber(b);	
	return numberToFloatBits(v1-v2);
}

Syscall.prototype.__fixsfsi = function(f) {
	return bitsToNumber(f)>>>0;
}

Syscall.prototype.__floatsisf = function(i) {
	return numberToFloatBits(i);
}
	
Syscall.prototype.__truncdfsf2 = function(d1, d2) {
	var value = bitsToNumber(d1, d2);
	return numberToFloatBits(value);
}

Syscall.prototype.maCreatePlaceholder = function() {
	var handle = this.loadedResources.length;
	this.loadedResources.push( {
		type: MoSyncConstants.RT_PLACEHOLDER,
		size: 0,
		data: 0
	});
	return handle;
}

Syscall.prototype.maDestroyObject = function(handle) {
}

Syscall.prototype.maCreateData = function(placeholder, size) {
	var res = this.loadedResources[placeholder];
	res.type = MoSyncConstants.RT_BINARY;
	res.size = size;
	res.data = new Memory(size);
	return 0;
}

Syscall.prototype.maGetDataSize = function(data) {
	var res = this.loadedResources[data];
	return res.size;
}

Syscall.prototype.maWriteData = function(data, src, offset, size) {
	var mem = this.loadedResources[data].data;
	var mem_ds = this.core.mem_ds;
	for(var i = 0; i < size; i++) {
		mem.writeUint8(offset+i, mem_ds.readUint8(src+i));
	}
}
	
Syscall.prototype.maReadData = function(data, dst, offset, size) {
	var mem = this.loadedResources[data].data;
	var mem_ds = this.core.mem_ds;
	
	for(var i = size-1; i > -1; i--) {
		mem_ds.writeUint8(dst+i, mem.readUint8(offset+i));
	}
}

Syscall.prototype.maOpenStore = function(name, flags) {
	return -2;
}

Syscall.prototype.maWriteStore = function(store, data) {
	return -2;
}

Syscall.prototype.maReadStore = function(store, placeholder) {
	return -2;
}

Syscall.prototype.maCloseStore = function(store, remove) {
	
}


Ioctls = {
		maFrameBufferGetInfo: 70,
		maFrameBufferInit: 71,
		maFrameBufferClose: 72,
		maOpenGLInitFullscreen: 125,
		maOpenGLCloseFullscreen: 126		
}

Syscall.prototype.maFrameBufferGetInfo = function(info) {
	var w = this.backBuffer.width;
	var h = this.backBuffer.height;
	var mem_ds = this.core.mem_ds;	
	mem_ds.writeInt32(info, w*h*4); info+=4; //sizeInBytes
	mem_ds.writeInt32(info, 4); info+=4; //bytesPerPixel
	mem_ds.writeInt32(info, 32); info+=4; //bitsPerPixel
	mem_ds.writeUint32(info, 0x000000ff); info+=4; //redMask
	mem_ds.writeUint32(info, 00); info+=4; //redShift
	mem_ds.writeUint32(info, 8); info+=4; //redBits
	mem_ds.writeUint32(info, 0x0000ff00); info+=4; //greenMask
	mem_ds.writeUint32(info, 8); info+=4; //greenShift
	mem_ds.writeUint32(info, 8); info+=4; //greenBits
	mem_ds.writeUint32(info, 0x00ff0000); info+=4; //blueMask
	mem_ds.writeUint32(info, 16); info+=4; //blueShift
	mem_ds.writeUint32(info, 8); info+=4; //blueBits
	mem_ds.writeUint32(info, w); info+=4; //width
	mem_ds.writeUint32(info, h); info+=4; //height
	mem_ds.writeUint32(info, w*4); info+=4; //pitch
	mem_ds.writeUint32(info, 0); info+=4; //supportsGfxSyscalls
	return 1;
}

Syscall.prototype.maFrameBufferInit = function(ptr) {
	this.framebuffer = this.visibleCanvasContext.createImageData(this.backBuffer.width, this.backBuffer.height);
	this.framebufferPointer = new Uint8Array(this.core.mem_ds.mem, ptr, this.framebuffer.data.length);
	for(var i = 3 ; i < this.framebuffer.data.length; i+=4) {
		this.framebuffer.data[i] = 255;
	}
	return 1;
}

Syscall.prototype.maFrameBufferClose = function(info) {
	this.framebuffer = null;
	return 1;
}

httpConnections = [];

Syscall.prototype.maHttpCreate = function( url, method) {
	url = this.core.pointerToString(url);

	var http = new XMLHttpRequest();	
	
	switch(method) {
		case MoSyncConstants.HTTP_GET: 
			method = "GET";
		break;
		case MoSyncConstants.HTTP_POST: 
			method = "POST";
		break;
		case MoSyncConstants.HTTP_HEAD: 
			method = "HEAD";
		break;
		case MoSyncConstants.HTTP_PUT: 
			method = "PUT";
		break;
		case MoSyncConstants.HTTP_DELETE: 
			method = "DELETE";
		break;

	}
	
	http.open(method, url, true);

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			alert(http.responseText);
		}
	}


	httpConnections.push(http);
	return httpConnections.length-1;
}

Syscall.prototype.maHttpSetRequestHeader = function(conn, key, value) {
	var http = httpConnections[conn];
	key = this.core.pointerToString(key);
	value = this.core.pointerToString(value);
	http.setRequestHeader(key, value);
}

Syscall.prototype.maHttpGetResponseHeader = function(conn, key, buffer, bufSize) {
	var http = httpConnections[conn];
	key = this.core.pointerToString(key);
	responseHeader = http.getResponseHeader(key);
	
	if(responseHeader == null)
		return MoSyncConstants.CONNERR_NOHEADER;
	
	var length = responseHeader.length;
	if(length >= bufSize) {
		return length;
	}

	for(var i = 0; i < length; i++) {
		this.core.mem_ds.writeUint8(buffer+i, responseHeader.charCodeAt(i)); 
	}
	
	this.core.mem_ds.writeUint8(buffer+length-1, 0);
	
	return length;
}


Syscall.prototype.maHttpFinish	= function(conn)	{
	var http = httpConnections[conn];
	http.send(null);
}


Syscall.prototype.maPanic = function(code, str) {
	str = this.core.pointerToString(str);
	alert("code " + code + ": " + str);
	this.core.stop();
}

Syscall.prototype.maWriteLog = function(ptr, size) {
	ptr = this.core.pointerToStringWithBounds(ptr, size);
	console.log(ptr);
}

Syscall.prototype.maSoundPlay = function(handle, offset, size) {
	var audioElement = document.createElement('audio');
	var audioRes = this.loadedResources[handle].data;

	var mime = "";
	var mimeLength = 0;
	while (1) {
		var t = String.fromCharCode(audioRes.readInt8(mimeLength));
		if (t == "\0") { break; } else {}
		mime += t;
		mimeLength += 1;
	}

	var base64audio = "data:" + mime + ";base64," + Base64.encode(audioRes, offset+mimeLength, size-mimeLength);				

	audioElement.setAttribute('src', base64audio);
	audioElement.play();
}


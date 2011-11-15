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

/**
 * Creates a webgl context.
 * @param {!Canvas} canvas The canvas tag to get context
 *     from. If one is not passed in one will be created.
 * @return {!WebGLContext} The created context.
 */
create3DContext = function(canvas, opt_attribs) {
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  for (var ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii], opt_attribs);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  return context;
}


Syscall.prototype.maOpenGLInitFullscreen = function(glApi) {
	if(glApi != MoSyncConstants.MA_GL_API_GL2)  {
		return MoSyncConstants.MA_GL_INIT_RES_UNAVAILABLE_API;
	}

	if (!window.WebGLRenderingContext) {
	  // browser supports WebGL
		alert("Browser doesn't support WebGL.");
		return MoSyncConstants.MA_GL_INIT_RES_ERROR;
	}

	try {
		this.createNewEmptyCanvas();

		function throwOnGLError(err, funcName, args) {
		  throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to" + funcName;
		};
		//this.gl = WebGLDebugUtils.makeDebugContext(this.visibleCanvas.getContext("experimental-webgl"), throwOnGLError);

		this.gl = create3DContext(this.visibleCanvas); 
	} catch(e) {
  		console.log(e);
	}
	if (!this.gl) {
    	alert("Could not initialise WebGL, sorry :-(");
		return MoSyncConstants.MA_GL_INIT_RES_ERROR;
	}
	
	this.oldUpdateScreen = this.maUpdateScreen();
	this.maUpdateScreen = function() {
		//this.gl.finish();	
		this.gl.flush();
		//throw {type: "animationFrame", data:0};
		//throw {type: "sleep", data:0};
	}

	this.uniformLocations = [null];
	this.textureHandles = [null];
	this.shaderHandles = [null];
	this.programHandles = [null];
	this.renderbufferHandles = [null];
	this.framebufferHandles = [null];
	this.bufferHandles = [null];
	
	
	this.core.mem_ds.writeUint32(this.core.customEventPointer, MoSyncConstants.MAW_EVENT_GL_VIEW_READY);
	this.events.push([MoSyncConstants.EVENT_TYPE_WIDGET, this.core.customEventPointer]);

	return MoSyncConstants.MA_GL_INIT_RES_OK;
}

Syscall.prototype.maOpenGLCloseFullscreen = function() {
	if(this.oldUpdateScreen == undefined) return;

	document.getElementById("msCanvas").id = oldCanvas;
	this.maUpdateScreen = this.oldUpdateScreen;
	this.oldUpdateScreen = undefined;
}

Syscall.prototype.maOpenGLTexImage2D = function(handle) {

	return MoSyncConstants.MA_GL_TEX_IMAGE_2D_OK;
}

Syscall.prototype.maOpenGLTexSubImage2D = function(handle) {

	return MoSyncConstants.MA_GL_TEX_IMAGE_2D_OK;
}

Syscall.prototype.glActiveTexture = function(/*in GLenum*/ texture) {
	this.gl.activeTexture(texture);
}

Syscall.prototype.glBindBuffer = function(/*in GLenum*/ target, /*in GLuint*/ buffer) {
	this.gl.bindBuffer(target, this.bufferHandles[buffer]);
}

Syscall.prototype.glBindTexture = function(/*in GLenum*/ target, /*in GLuint*/ texture) {
	this.gl.bindTexture(target, this.textureHandles[texture]);
}

Syscall.prototype.glBlendFunc = function(/*in GLenum*/ sfactor, /*in GLenum*/ dfactor) {
	this.gl.blendFunc(sfactor, dfactor);
}

Syscall.prototype.glBufferData = function(/*in GLenum*/ target, /*in GLsizeiptr*/ size, /*in MAAddress*/ data, /*in GLenum*/ usage) {
	this.gl.bufferData(target, new Uint8Array(this.core.mem_ds.mem, data, size), usage);
}

Syscall.prototype.glBufferSubData = function(/*in GLenum*/ target, /*in GLintptr*/ offset, /*in GLsizeiptr*/ size, /*in MAAddress*/ data) {
	this.gl.bufferSubData(target, offset, new Uint8Array(this.core.mem_ds.mem, data, size));
}

Syscall.prototype.glClear = function(/*in GLbitfield*/ mask) {
	this.gl.clear(mask);
}

Syscall.prototype.glClearColor = function(/*in GLclampf*/ red, /*in GLclampf*/ green, /*in GLclampf*/ blue, /*in GLclampf*/ alpha) {
	red = bitsToNumber(red);
	green = bitsToNumber(green);
	blue = bitsToNumber(blue);
	alpha = bitsToNumber(alpha);
	this.gl.clearColor(red, green, blue, alpha);
}

Syscall.prototype.glClearDepthf = function(/*in GLclampf*/ depth) {
	depth = bitsToNumber(depth);
	this.gl.clearDepth(depth);
}

Syscall.prototype.glClearStencil = function(/*in GLint*/ s) {
	this.gl.clearStencil(s);
}

Syscall.prototype.glColorMask = function(/*in GLboolean*/ red, /*in GLboolean*/ green, /*in GLboolean*/ blue, /*in GLboolean*/ alpha) {
	this.gl.colorMask(red==1?true:false, green==1?true:false, blue==1?true:false, alpha==1?true:false);
}

Syscall.prototype.glCompressedTexImage2D = function(/*in GLenum*/ target, /*in GLint*/ level, /*in GLenum*/ internalformat, /*in GLsizei*/ width, /*in GLsizei*/ height, /*in GLint*/ border, /*in GLsizei*/ imageSize, /*in MAAddress*/ data) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glCompressedTexSubImage2D = function(/*in GLenum*/ target, /*in GLint*/ level, /*in GLint*/ xoffset, /*in GLint*/ yoffset, /*in GLsizei*/ width, /*in GLsizei*/ height, /*in GLenum*/ format, /*in GLsizei*/ imageSize, /*in MAAddress*/ data) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glCopyTexImage2D = function(/*in GLenum*/ target, /*in GLint*/ level, /*in GLenum*/ internalformat, /*in GLint*/ x, /*in GLint*/ y, /*in GLsizei*/ width, /*in GLsizei*/ height, /*in GLint*/ border) {
	this.gl.copyTexImage2D(target, level, internalformat, x, y, width, height, border);
}

Syscall.prototype.glCopyTexSubImage2D = function(/*in GLenum*/ target, /*in GLint*/ level, /*in GLint*/ xoffset, /*in GLint*/ yoffset, /*in GLint*/ x, /*in GLint*/ y, /*in GLsizei*/ width, /*in GLsizei*/ height) {
	this.gl.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height);
}

Syscall.prototype.glCullFace = function(/*in GLenum*/ mode) {
	this.gl.cullFace(mode);
}

Syscall.prototype.glDeleteBuffers = function(/*in GLsizei*/ n, /*in GLuint**/ buffers) {
	for(var i = 0; i < n; i++) {
		var id = this.core.mem_ds.readInt32(buffers+i*4);
		this.gl.deleteBuffer(this.bufferHandles[id]);
		this.bufferHandles[id] = null;
	}
}

Syscall.prototype.glDeleteTextures = function(/*in GLsizei*/ n, /*in GLuint**/ textures) {
	for(var i = 0; i < n; i++) {
		var id = this.core.mem_ds.readInt32(textures+i*4);
		this.gl.deleteTexture(this.textureHandles[id]);
		this.textureHandles[id] = null;
	}
}

Syscall.prototype.glDepthFunc = function(/*in GLenum*/ func) {
	this.gl.depthFunc(func);
}

Syscall.prototype.glDepthMask = function(/*in GLboolean*/ flag) {
	this.gl.depthMask(flag);
}

Syscall.prototype.glDepthRangef = function(/*in GLclampf*/ zNear, /*in GLclampf*/ zFar) {
	zNear = bitsToNumber(zNear);
	zFar = bitsToNumber(zFar);
	this.gl.depthRange(zNear, zFar);
}

Syscall.prototype.glDisable = function(/*in GLenum*/ cap) {
	this.gl.disable(cap);
}

Syscall.prototype.glDrawArrays = function(/*in GLenum*/ mode, /*in GLint*/ first, /*in GLsizei*/ count) {
	this.gl.drawArrays(mode, first, count);
}

Syscall.prototype.glDrawElements = function(/*in GLenum*/ mode, /*in GLsizei*/ count, /*in GLenum*/ type, /*in MAAddress*/ indices) {
	this.gl.drawElement(mode, count, type, indices);
}

Syscall.prototype.glEnable = function(/*in GLenum*/ cap) {
	this.gl.enable(cap);
}

Syscall.prototype.glFinish = function() {
	this.gl.finish();
}

Syscall.prototype.glFlush = function() {
	this.gl.flush();
}

Syscall.prototype.glFrontFace = function(/*in GLenum*/ mode) {
	this.gl.frontFace(mode);
}

Syscall.prototype.glGenBuffers = function(/*in GLsizei*/ n, /*out GLuint*/ buffers) {
	for(var i = 0; i < n; i++) {
		var index = this.bufferHandles.length;
		this.bufferHandles.push( this.gl.createBuffer() );
		this.core.mem_ds.writeInt32(buffers+i*4, index);
	}
}

Syscall.prototype.glGenTextures = function(/*in GLsizei*/ n, /*out GLuint*/ textures) {
	for(var i = 0; i < n; i++) {
		var index = this.textureHandles.length;
		this.textureHandles.push( this.gl.createTexture() );
		this.core.mem_ds.writeInt32(textures+i*4, index);
	}
}

Syscall.prototype.glGetBooleanv = function(/*in GLenum*/ pname, /*out GLboolean*/ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glGetBufferParameteriv = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*out GLint*/ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

/*GLenum*/ Syscall.prototype.glGetError = function() {
	return this.gl.getError();
}

Syscall.prototype.glGetFloatv = function(/*in GLenum*/ pname, /*out GLfloat*/ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glGetIntegerv = function(/*in GLenum*/ pname, /*out GLint*/ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

/*MAHandle*/ Syscall.prototype.glGetStringHandle = function(/*in GLenum*/ name) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glGetTexParameterfv = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*out GLfloat*/ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glGetTexParameteriv = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*out GLint*/ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glHint = function(/*in GLenum*/ target, /*in GLenum*/ mode) {
	gl.hint(target, mode);
}

/*GLboolean*/ Syscall.prototype.glIsBuffer = function(/*in GLuint*/ buffer) {
	return (this.gl.isBuffer(this.bufferHandles[buffer])==true)?1:0;
}

/*GLboolean*/ Syscall.prototype.glIsEnabled = function(/*in GLenum*/ cap) {
	return (this.gl.isEnabled(cap)==true)?1:0;
}

/*GLboolean*/ Syscall.prototype.glIsTexture = function(/*in GLuint*/ texture) {
	return (this.gl.isTexture(this.textureHandles[texture])==true)?1:0;
}

Syscall.prototype.glLineWidth = function(/*in GLfloat*/ width) {
	width = bitsToNumber(width);
	this.gl.lineWidth(width);
}

Syscall.prototype.glPixelStorei = function(/*in GLenum*/ pname, /*in GLint*/ param) {
	this.gl.pixelStorei(pname, param);
}

Syscall.prototype.glPolygonOffset = function(/*in GLfloat*/ factor, /*in GLfloat*/ units) {
	factor = bitsToNumber(factor);
	units = bitsToNumber(units);
	this.gl.polygonOffset(factor, units);
}

Syscall.prototype.glReadPixels = function(/*in GLint*/ x, /*in GLint*/ y, /*in GLsizei*/ width, /*in GLsizei*/ height, /*in GLenum*/ format, /*in GLenum*/ type, /*out MAAddress*/ pixels) {
	this.gl.readPixels(x, y, width, height, format, type, new Uint8View(this.core.mem_ds.mem, pixels));
}

Syscall.prototype.glSampleCoverage = function(/*in GLclampf*/ value, /*in GLboolean*/ invert) {
	value = bitsToNumber(value);
	this.gl.sampleCoverage(value, invert==1?true:false);
}

Syscall.prototype.glScissor = function(/*in GLint*/ x, /*in GLint*/ y, /*in GLsizei*/ width, /*in GLsizei*/ height) {
	this.gl.scissor(x, y, width, height);
}

Syscall.prototype.glStencilFunc = function(/*in GLenum*/ func, /*in GLint*/ ref, /*in GLuint*/ mask) {
	this.gl.stencilFunc(func, ref, mask);
}

Syscall.prototype.glStencilMask = function(/*in GLuint*/ mask) {
	this.gl.stencilMask(mask);
}

Syscall.prototype.glStencilOp = function(/*in GLenum*/ fail, /*in GLenum*/ zfail, /*in GLenum*/ zpass) {
	this.gl.stencilOp(fail, zfail, zpass);
}

Syscall.prototype.glTexImage2D = function(/*in GLenum*/ target, /*in GLint*/ level, /*in GLint*/ internalformat, /*in GLsizei*/ width, /*in GLsizei*/ height, /*in GLint*/ border, /*in GLenum*/ format, /*in GLenum*/ type, /*in MAAddress*/ pixels) {
	this.gl.texImage2D(target, level, internalformat, width, height, border, format, type, new Uint8View(this.core.mem_ds.mem, pixels));
}

Syscall.prototype.glTexParameterf = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*in GLfloat*/ param) {
	param = bitsToNumber(param);
	this.gl.texParameterf(target, pname, param);
}

Syscall.prototype.glTexParameterfv = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*in GLfloat* */ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glTexParameteri = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*in GLint*/ param) {
	gl.texParameteri(target, pname, param);
}

Syscall.prototype.glTexParameteriv = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*in GLint* */ params) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glTexSubImage2D = function(/*in GLenum*/ target, /*in GLint*/ level, /*in GLint*/ xoffset, /*in GLint*/ yoffset, /*in GLsizei*/ width, /*in GLsizei*/ height, /*in GLenum*/ format, /*in GLenum*/ type, /*in MAAddress*/ pixels) {
	this.gl.texImage2D(target, level, xoffset, yoffset, width, height, format, type, new Uint8View(this.core.mem_ds.mem, pixels));
}

Syscall.prototype.glViewport = function(/*in GLint*/ x, /*in GLint*/ y, /*in GLsizei*/ width, /*in GLsizei*/ height) {
	this.gl.viewport(x, y, width, height);
}

Syscall.prototype.glAttachShader = function(/*in GLuint*/ program, /*in GLuint*/ shader) {
	this.gl.attachShader(this.programHandles[program], this.shaderHandles[shader]);
}

Syscall.prototype.glBindAttribLocation = function(/*in GLuint*/ program, /*in GLuint*/ index, /*in GLchar**/ name) {
	this.gl.bindAttribLocation(this.programHandles[program], index, this.core.Pointer_stringify(name));
}

Syscall.prototype.glBindFramebuffer = function(/*in GLenum*/ target, /*in GLuint*/ framebuffer) {
	this.bindFramebuffer(target, this.framebufferHandles[framebuffer]);
}

Syscall.prototype.glBindRenderbuffer = function(/*in GLenum*/ target, /*in GLuint*/ renderbuffer) {
	this.bindRenderbuffer(target, this.renderbufferHandles[renderbuffer]);
}

Syscall.prototype.glBlendColor = function(/*in GLclampf*/ red, /*in GLclampf*/ green, /*in GLclampf*/ blue, /*in GLclampf*/ alpha) {
	red = bitsToNumber(red);
	green = bitsToNumber(green);
	blue = bitsToNumber(blue);
	alpha = bitsToNumber(alpha);
	this.gl.blendColor(red, green, blue, alpha);
}

Syscall.prototype.glBlendEquation = function(/*in GLenum*/ mode) {
	this.gl.blendEquation(mode);
}

Syscall.prototype.glBlendEquationSeparate = function(/*in GLenum*/ modeRGB, /*in GLenum*/ modeAlpha) {
	this.gl.blendEquationSeparate(modeRGB, modeAlpha);
}

Syscall.prototype.glBlendFuncSeparate = function(/*in GLenum*/ srcRGB, /*in GLenum*/ dstRGB, /*in GLenum*/ srcAlpha, /*in GLenum*/ dstAlpha) {
	this.gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
}

/*GLenum*/ Syscall.prototype.glCheckFramebufferStatus = function(/*in GLenum*/ target) {
	return this.gl.checkFramebufferStatus(target);
}

Syscall.prototype.glCompileShader = function(/*in GLuint*/ shader) {
	this.gl.compileShader(this.shaderHandles[shader]);
}

/*GLuint*/ Syscall.prototype.glCreateProgram = function() {
	var index = this.programHandles.length;
	this.programHandles.push(this.gl.createProgram());
	return index;
}

/*GLuint*/ Syscall.prototype.glCreateShader = function(/*in GLenum*/ type) {
	var index = this.shaderHandles.length;
	this.shaderHandles.push(this.gl.createShader(type));
	return index;
}

Syscall.prototype.glDeleteFramebuffers = function(/*in GLsizei*/ n, /*in GLuint* */ framebuffers) {
	for(var i = 0; i < n; i++) {
		var index = this.core.mem_ds.readInt32(framebuffers+i*4, index);
		this.gl.deleteFramebuffer(this.framebufferHandles[index]);
		this.framebufferHandles[index] = null;
	}
}

Syscall.prototype.glDeleteProgram = function(/*in GLuint*/ program) {
	this.gl.deleteProgram(this.programHandles[program]);
	this.programHandles[program] = null;
}

Syscall.prototype.glDeleteRenderbuffers = function(/*in GLsizei*/ n, /*in GLuint* */ renderbuffers) {
	for(var i = 0; i < n; i++) {
		var index = this.core.mem_ds.readInt32(renderbuffers+i*4, index);
		this.gl.deleteRenderbuffer(this.renderbufferHandles[index]);
		this.renderbufferHandles[index] = null;
	}
}

Syscall.prototype.glDeleteShader = function(/*in GLuint*/ shader) {
	this.gl.deleteShader(this.shaderHandles[shader]);
	this.shaderHandles[shader] = null;
}

Syscall.prototype.glDetachShader = function(/*in GLuint*/ program, /*in GLuint*/ shader) {
	this.gl.detachShader(this.programHandles[program], this.shaderHandles[shader]);
}

Syscall.prototype.glDisableVertexAttribArray = function(/*in GLuint*/ index) {
	this.gl.disableVertexAttribArray(index);
}

Syscall.prototype.glEnableVertexAttribArray = function(/*in GLuint*/ index) {
	this.gl.enableVertexAttribArray(index);
}

Syscall.prototype.glFramebufferRenderbuffer = function(/*in GLenum*/ target, /*in GLenum*/ attachment, /*in GLenum*/ renderbuffertarget, /*in GLuint*/ renderbuffer) {
	this.gl.frameBufferRenderBuffer(target, attachment, renderbuffertarget, this.renderBufferHandles[renderbuffer]);
}

Syscall.prototype.glFramebufferTexture2D = function(/*in GLenum*/ target, /*in GLenum*/ attachment, /*in GLenum*/ textarget, /*in GLuint*/ texture, /*in GLint*/ level) {
	this.gl.framebufferTexture2D(target, attachment, textarget, this.textureHandles[texture], level);
}

Syscall.prototype.glGenerateMipmap = function(/*in GLenum*/ target) {
	this.gl.generateMipmap(target);
}

Syscall.prototype.glGenFramebuffers = function(/*in GLsizei*/ n, /*out GLuint*/ framebuffers) {
	for(var i = 0; i < n; i++) {
		var index = this.framebufferHandles.length;
		this.framebufferHandles.push( this.gl.createFramebuffer() );
		this.core.mem_ds.writeInt32(framebuffers+i*4, index);
	}
}

Syscall.prototype.glGenRenderbuffers = function(/*in GLsizei*/ n, /*out GLuint*/ renderbuffers) {
	for(var i = 0; i < n; i++) {
		var index = this.renderbufferHandles.length;
		this.renderbufferHandles.push( this.gl.createRenderbuffer() );
		this.core.mem_ds.writeInt32(renderbuffers+i*4, index);
	}
}

Syscall.prototype.glGetActiveAttrib = function(/*in GLuint*/ program, /*in GLuint*/ index, /*in GLsizei*/ bufsize, /*out GLsizei*/ length, /*out GLint*/ size, /*out GLenum*/ type, /*out GLchar*/ name) {
	var activeAttrib = this.gl.getActiveAttrib(this.programHandles[program], index);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}

Syscall.prototype.glGetActiveUniform = function(/*in GLuint*/ program, /*in GLuint*/ index, /*in GLsizei*/ bufsize, /*out GLsizei*/ length, /*out GLint*/ size, /*out GLenum*/ type, /*out GLchar*/ name) {
	var activeUniform = this.gl.getActiveUniform(this.programHandles[program], index);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}


Syscall.prototype.glGetAttachedShaders = function(/*in GLuint*/ program, /*in GLsizei*/ maxcount, /*out GLsizei*/ count, /*out GLuint*/ shaders) {
	var attachedShaders = this.gl.getAttachedShaders(this.programHandles[program]);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE	
}

/*int*/ Syscall.prototype.glGetAttribLocation = function(/*in GLuint*/ program, /*in GLchar**/ name) {
	return this.gl.getAttribLocation(this.programHandles[program], this.core.Pointer_stringify(name));
}

Syscall.prototype.glGetFramebufferAttachmentParameteriv = function(/*in GLenum*/ target, /*in GLenum*/ attachment, /*in GLenum*/ pname, /*out GLint*/ params) {
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE	
}

Syscall.prototype.glGetProgramiv = function(/*in GLuint*/ program, /*in GLenum*/ pname, /*out GLint*/ params) {
	programParam = this.gl.getProgramParameter(this.programHandles[program], pname);
	if(typeof(programParam) == "boolean")
		this.core.mem_ds.writeInt32(params, programParam==true?1:0);
	else if(typeof(programParam) == "number")
		this.core.mem_ds.writeInt32(params, programParam);	
}

Syscall.prototype.glGetProgramInfoLog = function(/*in GLuint*/ program, /*in GLsizei*/ bufsize, /*out GLsizei*/ length, /*out GLchar*/ infolog) {
	var infoLogTmp = this.gl.getProgramInfoLog(this.programHandles[program]);
	var len = infoLogTmp.length;
	if(bufsize<len) len = bufsize;
	for(var i = 0; i < infoLogTmp.length; i++) {
		var c = infoLogTmp.charCodeAt(i);
		this.core.mem_ds.writeUint8(infolog+i, c);
	}
	this.core.mem_ds.writeUint32(length, infoLogTmp.length);
}

Syscall.prototype.glGetRenderbufferParameteriv = function(/*in GLenum*/ target, /*in GLenum*/ pname, /*out GLint*/ params) {
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE	
}

Syscall.prototype.glGetShaderiv = function(/*in GLuint*/ shader, /*in GLenum*/ pname, /*out GLint*/ params) {
	shaderParam = this.gl.getShaderParameter(this.shaderHandles[shader], pname);
	if(typeof(shaderParam) == "boolean")
		this.core.mem_ds.writeInt32(params, shaderParam==true?1:0);
	else if(typeof(shaderParam) == "number")
		this.core.mem_ds.writeInt32(params, shaderParam);
}

Syscall.prototype.glGetShaderInfoLog = function(/*in GLuint*/ shader, /*in GLsizei*/ bufsize, /*out GLsizei*/ length, /*out GLchar*/ infolog) {
	var infoLogTmp = this.gl.getShaderInfoLog(this.shaderHandles[shader]);
	var len = infoLogTmp.length;
	if(bufsize<len) len = bufsize;
	for(var i = 0; i < infoLogTmp.length; i++) {
		var c = infoLogTmp.charCodeAt(i);
		this.core.mem_ds.writeUint8(infolog+i, c);
	}
	this.core.mem_ds.writeUint32(length, infoLogTmp.length);
}

Syscall.prototype.glGetShaderPrecisionFormat = function(/*in GLenum*/ shadertype, /*in GLenum*/ precisiontype, /*out GLint*/ range, /*out GLint*/ precision) {
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}

Syscall.prototype.glGetShaderSource = function(/*in GLuint*/ shader, /*in GLsizei*/ bufsize, /*out GLsizei*/ length, /*out GLchar*/ source) {
	var shaderSource = this.gl.getShaderSource(this.shaderHandles[shader]);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}

Syscall.prototype.glGetUniformfv = function(/*in GLuint*/ program, /*in GLint*/ location, /*out GLfloat*/ params) {
	var uniform = this.gl.getUniform(this.programHandles[program], this.uniformLocations[location]);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}

Syscall.prototype.glGetUniformiv = function(/*in GLuint*/ program, /*in GLint*/ location, /*out GLint*/ params) {
	var uniform = this.gl.getUniform(this.programHandles[program], this.uniformLocations[location]);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}

/*int*/ Syscall.prototype.glGetUniformLocation = function(/*in GLuint*/ program, /*in GLchar**/ name) {
	this.uniformLocations.push(this.gl.getUniformLocation(this.programHandles[program], this.core.Pointer_stringify(name)));
	return this.uniformLocations.length-1;
}

Syscall.prototype.glGetVertexAttribfv = function(/*in GLuint*/ index, /*in GLenum*/ pname, /*out GLfloat*/ params) {
	var vertexAttrib = this.gl.getVertexAttrib(index, pname);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}

Syscall.prototype.glGetVertexAttribiv = function(/*in GLuint*/ index, /*in GLenum*/ pname, /*out GLint*/ params) {
	var vertexAttrib = this.gl.getVertexAttrib(index, pname);
	// TODO FIX MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
}

Syscall.prototype.glGetVertexAttribPointerv = function(/*in GLuint*/ index, /*in GLenum*/ pname, /*out MAAddress*/ pointer) {
	var offset = this.gl.getVertexAttribOffset(index, pname);
	this.core.mem_ds.writeInt32(pointer, offset); // maybe?
}

/*GLboolean*/ Syscall.prototype.glIsFramebuffer = function(/*in GLuint*/ framebuffer) {
	return this.gl.isFramebuffer(this.framebufferHandles[framebuffer])==true?1:0;
}

/*GLboolean*/ Syscall.prototype.glIsProgram = function(/*in GLuint*/ program) {
	return this.gl.isProgram(this.programHandles[program])==true?1:0;
}

/*GLboolean*/ Syscall.prototype.glIsRenderbuffer = function(/*in GLuint*/ renderbuffer) {
	return this.gl.isRenderbuffer(this.renderbufferHandles[renderbuffer])==true?1:0;
}

/*GLboolean*/ Syscall.prototype.glIsShader = function(/*in GLuint*/ shader) {
	return this.gl.isShader(this.shaderHandles[shader])==true?1:0;
}

Syscall.prototype.glLinkProgram = function(/*in GLuint*/ program) {
	this.gl.linkProgram(this.programHandles[program]);
}

Syscall.prototype.glReleaseShaderCompiler = function() {
	// huh ??
}

Syscall.prototype.glRenderbufferStorage = function(/*in GLenum*/ target, /*in GLenum*/ internalformat, /*in GLsizei*/ width, /*in GLsizei*/ height) {
	this.gl.renderbufferStorage(target, internalformat, width, height);
}

Syscall.prototype.glShaderBinary = function(/*in GLsizei*/ n, /*in GLuint* */ shaders, /*in GLenum*/ binaryformat, /*in MAAddress*/ binary, /*in GLsizei*/ length) {
	return MoSyncConstants.IOCTL_UNAVAILABLE;
}

Syscall.prototype.glShaderSource = function(/*in GLuint*/ shader, /*in GLsizei*/ count, /*out MAAddress*/ string, /*in GLint* */ length) {
	var source = "";	
	for(var i = 0; i < count; i++) {
		if(length != 0) {
			var len = this.core.mem_ds.readUint32(length + i*4);
			var str = this.core.mem_ds.readUint32(string + i*4);
			source += this.core.pointerToStringWithBounds(str, len);		
		} else {
			var str = this.core.mem_ds.readUint32(string + i*4);
			source += this.core.pointerToString(str);
		}
	}

	console.log("shader source: " + source);
	this.gl.shaderSource(this.shaderHandles[shader], source);
}

Syscall.prototype.glStencilFuncSeparate = function(/*in GLenum*/ face, /*in GLenum*/ func, /*in GLint*/ ref, /*in GLuint*/ mask) {
	this.gl.stencilFuncSeparate(face, func, ref, mask);
}

Syscall.prototype.glStencilMaskSeparate = function(/*in GLenum*/ face, /*in GLuint*/ mask) {
	this.gl.stencilMaskSeparate(face, mask);
}

Syscall.prototype.glStencilOpSeparate = function(/*in GLenum*/ face, /*in GLenum*/ fail, /*in GLenum*/ zfail, /*in GLenum*/ zpass) {
	this.gl.stencilOpSeparate(face, fail, zfail, zpass);
}

Syscall.prototype.glUniform1f = function(/*in GLint*/ location, /*in GLfloat*/ x) {
	x = bitsToNumber(x);
	this.gl.uniform1f(this.uniformLocations[location], x);
}

Syscall.prototype.glUniform1fv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLfloat* */ v) {
	this.gl.uniform1fv(this.uniformLocations[location], new Float32Array(this.core.mem_ds.mem, v, count*4*1));
}

Syscall.prototype.glUniform1i = function(/*in GLint*/ location, /*in GLint*/ x) {
	this.gl.uniform1i(this.uniformLocations[location], x);
}

Syscall.prototype.glUniform1iv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLint* */ v) {
	this.gl.uniform1iv(this.uniformLocations[location], new Int32Array(this.core.mem_ds.mem, v, count*4*1));
}

Syscall.prototype.glUniform2f = function(/*in GLint*/ location, /*in GLfloat*/ x, /*in GLfloat*/ y) {
	x = bitsToNumber(x);
	y = bitsToNumber(y);
	this.gl.uniform2f(this.uniformLocations[location], x, y);
}

Syscall.prototype.glUniform2fv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLfloat* */ v) {
	this.gl.uniform2fv(this.uniformLocations[location], new Float32Array(this.core.mem_ds.mem, v, count*4*2));
}

Syscall.prototype.glUniform2i = function(/*in GLint*/ location, /*in GLint*/ x, /*in GLint*/ y) {
	this.gl.uniform2i(this.uniformLocations[location], x, y);
}

Syscall.prototype.glUniform2iv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLint* */ v) {
	this.gl.uniform2iv(this.uniformLocations[location], new Int32Array(this.core.mem_ds.mem, v, count*4*2));
}

Syscall.prototype.glUniform3f = function(/*in GLint*/ location, /*in GLfloat*/ x, /*in GLfloat*/ y, /*in GLfloat*/ z) {
	x = bitsToNumber(x);
	y = bitsToNumber(y);
	z = bitsToNumber(z);
	this.gl.uniform3f(this.uniformLocations[location], x, y, z);
}

Syscall.prototype.glUniform3fv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLfloat* */ v) {
	this.gl.uniform3fv(this.uniformLocations[location], new Float32Array(this.core.mem_ds.mem, v, count*4*3));
}

Syscall.prototype.glUniform3i = function(/*in GLint*/ location, /*in GLint*/ x, /*in GLint*/ y, /*in GLint*/ z) {
	this.gl.uniform3i(this.uniformLocations[location], x, y, z);
}

Syscall.prototype.glUniform3iv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLint* */ v) {
	this.gl.uniform3iv(this.uniformLocations[location], new Int32Array(this.core.mem_ds.mem, v, count*4*3));
}

Syscall.prototype.glUniform4f = function(/*in GLint*/ location, /*in GLfloat*/ x, /*in GLfloat*/ y, /*in GLfloat*/ z, /*in GLfloat*/ w) {
	x = bitsToNumber(x);
	y = bitsToNumber(y);
	z = bitsToNumber(z);
	w = bitsToNumber(w);
	this.gl.uniform4f(this.uniformLocations[location], x, y, z, w);
}

Syscall.prototype.glUniform4fv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLfloat* */ v) {
	this.gl.uniform4fv(this.uniformLocations[location], new Float32Array(this.core.mem_ds.mem, v, count*4*4));
}

Syscall.prototype.glUniform4i = function(/*in GLint*/ location, /*in GLint*/ x, /*in GLint*/ y, /*in GLint*/ z, /*in GLint*/ w) {
	this.gl.uniform4i(this.uniformLocations[location], x, y, z, w);
}

Syscall.prototype.glUniform4iv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLint* */ v) {
	this.gl.uniform4iv(this.uniformLocations[location], new Int32Array(this.core.mem_ds.mem, v, count*4*4));
}

Syscall.prototype.glUniformMatrix2fv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLboolean*/ transpose, /*in GLfloat* */ value) {
	this.gl.uniformMatrix2fv(this.uniformLocations[location], transpose==1?true:false, new Float32Array(this.core.mem_ds.mem, v, count*4*2*2));
}

Syscall.prototype.glUniformMatrix3fv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLboolean*/ transpose, /*in GLfloat* */ value) {
	this.gl.uniformMatrix3fv(this.uniformLocations[location], transpose==1?true:false, new Float32Array(this.core.mem_ds.mem, v, count*4*3*3));
}

Syscall.prototype.glUniformMatrix4fv = function(/*in GLint*/ location, /*in GLsizei*/ count, /*in GLboolean*/ transpose, /*in GLfloat* */ value) {
	this.gl.uniformMatrix4fv(this.uniformLocations[location], transpose==1?true:false, new Float32Array(this.core.mem_ds.mem, v, count*4*4*4));
}

Syscall.prototype.glUseProgram = function(/*in GLuint*/ program) {
	this.gl.useProgram(this.programHandles[program]);
}

Syscall.prototype.glValidateProgram = function(/*in GLuint*/ program) {
	this.gl.validateProgram(this.programHandles[program]);
}

Syscall.prototype.glVertexAttrib1f = function(/*in GLuint*/ indx, /*in GLfloat*/ x) {
	x = bitsToNumber(x);
	this.gl.vertexAttrib1f(indx, x);
}

Syscall.prototype.glVertexAttrib1fv = function(/*in GLuint*/ indx, /*in GLfloat* */ values) {
	this.gl.vertexAttrib1fv(indx, new Float32Array(this.core.mem_ds.mem, values));
}

Syscall.prototype.glVertexAttrib2f = function(/*in GLuint*/ indx, /*in GLfloat*/ x, /*in GLfloat*/ y) {
	x = bitsToNumber(x);
	y = bitsToNumber(y);
	this.gl.vertexAttrib2f(indx, x, y);
}

Syscall.prototype.glVertexAttrib2fv = function(/*in GLuint*/ indx, /*in GLfloat* */ values) {
	this.gl.vertexAttrib2fv(indx, new Float32Array(this.core.mem_ds.mem, values));
}

Syscall.prototype.glVertexAttrib3f = function(/*in GLuint*/ indx, /*in GLfloat*/ x, /*in GLfloat*/ y, /*in GLfloat*/ z) {
	x = bitsToNumber(x);
	y = bitsToNumber(y);
	z = bitsToNumber(z);
	this.gl.vertexAttrib3f(indx, x, y, z);
}

Syscall.prototype.glVertexAttrib3fv = function(/*in GLuint*/ indx, /*in GLfloat* */ values) {
	this.gl.vertexAttrib3fv(indx, new Float32Array(this.core.mem_ds.mem, values));
}

Syscall.prototype.glVertexAttrib4f = function(/*in GLuint*/ indx, /*in GLfloat*/ x, /*in GLfloat*/ y, /*in GLfloat*/ z, /*in GLfloat*/ w) {
	x = bitsToNumber(x);
	y = bitsToNumber(y);
	z = bitsToNumber(z);
	w = bitsToNumber(w);
	this.gl.vertexAttrib4f(indx, x, y, z, w);
}

Syscall.prototype.glVertexAttrib4fv = function(/*in GLuint*/ indx, /*in GLfloat* */ values) {
	this.gl.vertexAttrib4fv(indx, new Float32Array(this.core.mem_ds.mem, values));
}

Syscall.prototype.glVertexAttribPointer = function(/*in GLuint*/ indx, /*in GLint*/ size, /*in GLenum*/ type, /*in GLboolean*/ normalized, /*in GLsizei*/ stride, /*in MAAddress*/ ptr) {
	var tmpBuf = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tmpBuf);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.core.mem_ds.mem, ptr), this.gl.STATIC_DRAW);
	this.gl.vertexAttribPointer(indx, size, type, normalized==1?true:false, stride, 0);
}


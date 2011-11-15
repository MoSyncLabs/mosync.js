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

function Core() {		
		this.regs = [];
		this.ip = 0;
		//var mem_cs = [];
		//var mem_ds = [];
		//var mem_cp = [];
		this.CODE_SEGMENT_SIZE = 0;
		this.DATA_SEGMENT_SIZE = 0;
		this.CODE_SEGMENT_MASK = 0;
		this.DATA_SEGMENT_MASK = 0;
		this.vmInterval = undefined;
		this.variableOpCount = 	10000;
		this.invokeSyscall = MoSyncGenerated.invokeSyscall;
}
	
FarOps = {
	CALLI: 4,
	JC_EQ: 38,			
	JC_NE: 39,			
	JC_GE: 40,			
	JC_GEU: 41,			
	JC_GT: 42,			
	JC_GTU: 43,			
	JC_LE: 44,			
	JC_LEU: 45,			
	JC_LT: 46,			
	JC_LTU: 47,			
	JPI: 48,
};
		
Op = {
	NUL: 0,
	PUSH: 1,
	POP: 2,
	CALL: 3,
	CALLI: 4,
	LDB: 5,
	STB: 6,
	LDH: 7,
	STH: 8,
	LDW: 9,
	STW: 10,			
	LDI: 11,
	LDR: 12,
	ADD: 13,
	ADDI: 14,
	MUL: 15,
	MULI: 16,
	SUB: 17,
	SUBI: 18,
	AND: 19,
	ANDI: 20,
	OR: 21,
	ORI: 22,		
	XOR: 23,			
	XORI: 24,			
	DIVU: 25,			
	DIVUI: 26,			
	DIV: 27,			
	DIVI: 28,			
	SLL: 29,			
	SLLI: 30,
	SRA: 31,			
	SRAI: 32,			
	SRL: 33,			
	SRLI: 34,			
	NOT: 35,			
	NEG: 36,			
	RET: 37,			
	JC_EQ: 38,			
	JC_NE: 39,			
	JC_GE: 40,			
	JC_GEU: 41,			
	JC_GT: 42,			
	JC_GTU: 43,			
	JC_LE: 44,			
	JC_LEU: 45,			
	JC_LT: 46,			
	JC_LTU: 47,			
	JPI: 48,			
	JPR: 49,			
	XB: 50,			
	XH: 51,			
	SYSCALL: 52,			
	CASE: 53,			
	FAR: 54
	//END: 55
};
				
				
Reg = {
	zero : 0,
	sp : 1,
	rt : 2,
	fr : 3,
	d0 : 4,
	d1 : 5,
	d2 : 6,
	d3 : 7,
	d4 : 8,
	d5 : 9,
	d6 : 10,
	d7 : 11,
	i0 : 12,
	i1 : 13,
	i2 : 14,
	i3 : 15,

	r0 : 16,
	r1 : 17,
	r2 : 18,
	r3 : 19,
	r4 : 20,
	r5 : 21,
	r6 : 22,
	r7 : 23,
	r8 : 24,
	r9 : 25,
	r10 : 26,
	r11 : 27,
	r12 : 28,
	r13 : 29,
	r14 : 30,
	r15 : 31
}
		
		
function getNameOfOp(index) {
	for (var key in Op) {
		if(Op[key] == index)
			return key;
	}
	return null;
}
		
function Memory(size, arrayBuffer, offset) {
	size = (size+3)&0xfffffffc; // align size to int
	this.size = size;
			
	if(arrayBuffer == undefined) {
		this.mem = new ArrayBuffer(size);
		offset = 0;
	} else {
		this.mem = arrayBuffer;
	}

	this.mem8 = new Int8Array(this.mem, offset, size);
	this.memU8 = new Uint8Array(this.mem, offset, size);
	this.mem16 = new Int16Array(this.mem, offset, size >>> 1);
	this.memU16 = new Uint16Array(this.mem, offset, size >>> 1);
	this.mem32 = new Int32Array(this.mem, offset, size >>> 2);
	this.memU32 = new Uint32Array(this.mem, offset, size >>> 2);
}
  	
Memory.prototype.readInt8 = function(offset) {
	return this.mem8[offset];
}

Memory.prototype.readUint8 = function(offset) {
	return this.memU8[offset];
}

Memory.prototype.readInt16 = function(offset) {
	return this.mem16[offset>>>1];
}

Memory.prototype.readUint16 = function(offset) {
	return this.memU16[offset>>>1];
}

Memory.prototype.readInt32 = function(offset) {
	return this.mem32[offset>>>2];
}

Memory.prototype.readUint32 = function(offset) {
	return this.memU32[offset>>>2];
}
		
Memory.prototype.writeInt8 = function(offset, val) {
	this.mem8[offset] = val;
}

Memory.prototype.writeUint8 = function(offset, val) {
	this.memU8[offset] = val;
}

Memory.prototype.writeInt16 = function(offset, val) {
	this.mem16[offset>>>1] = val;
}

Memory.prototype.writeUint16 = function(offset, val) {
	this.memU16[offset>>>1] = val;
}

Memory.prototype.writeInt32 = function(offset, val) {
	this.mem32[offset>>>2] = val;
}

Memory.prototype.writeUint32 = function(offset, val) {
	this.memU32[offset>>>2] = val;
}		
		
Core.prototype.fetchImm32 = function() {
	var imm32 = this.mem_cs.memU8[this.ip++];
	if(imm32>127) {
		imm32 = ((imm32&127)<<8) | this.mem_cs.memU8[this.ip++];
	}
	return this.mem_cp.mem32[imm32]; // don't use interface here to optimize..
}
		
Core.prototype.fetchImm16 = function() {
	//var imm32 = mem_cs.readUint8(ip++)<<8;
	//imm32 += mem_cs.readUint8(ip++);
	return (this.mem_cs.memU8[this.ip++]<<8) | this.mem_cs.memU8[this.ip++];
}
		
Core.prototype.fetchImm24 = function() {
	var imm32 = this.mem_cs.memU8[this.ip++]<<16;
	imm32 += this.mem_cs.memU8[this.ip++]<<8;
	imm32 += this.mem_cs.memU8[this.ip++];
	return imm32;
}
	
	
OpExecutor = [];
FarOpExecutor = [];
		
OpExecutor[Op.NUL] = function(core) {
};
					
OpExecutor[Op.PUSH] = function(core) {
	var r = core.mem_cs.readUint8(core.ip++);
	var n = core.mem_cs.readUint8(core.ip++);
	if(r < 2 || r+n > 32)
		alert("Hell");
	do {
		core.regs[Reg.sp] -= 4;
		core.mem_ds.writeInt32(core.regs[Reg.sp], core.regs[r]);
		r++;
		n--;
	} while(n != 0);
};
	
OpExecutor[Op.POP] = function(core) {
	var r = core.mem_cs.readUint8(core.ip++);
	var n = core.mem_cs.readUint8(core.ip++);
	if(r > 31 || r-n < 1)
		alert("Hell");
	do {
		core.regs[r] = core.mem_ds.readInt32(core.regs[Reg.sp]);
		core.regs[Reg.sp] += 4;
		r--;
		n--;
	} while(n != 0);	
};
			
OpExecutor[Op.CALL] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	core.regs[Reg.rt] = core.ip;
	core.ip = core.regs[rd];
};
		
OpExecutor[Op.CALLI] = function(core) {
	var callAddr = core.fetchImm16();
	//console.log("calli addr: " + callAddr);
	core.regs[Reg.rt] = core.ip;
	core.ip = callAddr;
};
		
OpExecutor[Op.LDB] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] = core.mem_ds.readUint8((core.regs[rs]+imm32));
};
			
OpExecutor[Op.STB] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.mem_ds.writeUint8((core.regs[rd]+imm32), core.regs[rs]);
};
			
OpExecutor[Op.LDH] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] = core.mem_ds.readUint16((core.regs[rs]+imm32));
};
		
OpExecutor[Op.STH] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.mem_ds.writeUint16((core.regs[rd]+imm32), core.regs[rs]);
};
		
OpExecutor[Op.LDW] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] = core.mem_ds.readInt32((core.regs[rs]+imm32));
};
			
OpExecutor[Op.STW] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.mem_ds.writeInt32((core.regs[rd]+imm32), core.regs[rs]);
};
			
OpExecutor[Op.LDI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();		
	core.regs[rd] = imm32;
};
			
OpExecutor[Op.LDR] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] = core.regs[rs];
};
			
OpExecutor[Op.ADD] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] += core.regs[rs]; // maybe do (core.regs[rd]+core.regs[rs])|0
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.ADDI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	//console.log("addi: reg[rd] += " + imm32);
	core.regs[rd] += imm32;
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.MUL] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] *= core.regs[rs];
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.MULI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] *= imm32;		
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.SUB] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] -= core.regs[rs];
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.SUBI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] -= imm32;
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.AND] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] &= core.regs[rs];
};
			
OpExecutor[Op.ANDI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] &= imm32;
};
			
OpExecutor[Op.OR] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] |= core.regs[rs];
};
			
OpExecutor[Op.ORI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] |= imm32;
};
			
OpExecutor[Op.XOR] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] ^= core.regs[rs];		
};
			
OpExecutor[Op.XORI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] ^= imm32;
};
			
OpExecutor[Op.DIVU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] = ((core.regs[rd]>>>0)/(core.regs[rs]>>>0)) | 0;
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.DIVUI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] = ((core.regs[rd]>>>0)/(imm32>>>0)) | 0;
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.DIV] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] = (core.regs[rd]/core.regs[rs]) | 0;	
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.DIVI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm32();
	core.regs[rd] = (core.regs[rd]/imm32) | 0;
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.SLL] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] <<= core.regs[rs];
	core.regs[rd] &= 0xffffffff;			
};
			
OpExecutor[Op.SLLI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] <<= imm32;	
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.SRA] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] >>= core.regs[rs];					
};
			
OpExecutor[Op.SRAI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] >>= imm32;	
};
			
OpExecutor[Op.SRL] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] >>>= core.regs[rs];	
};
			
OpExecutor[Op.SRLI] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] >>>= imm32;	
};
			
OpExecutor[Op.NOT] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] = ~core.regs[rs];				
	core.regs[rd] &= 0xffffffff;
};
			
OpExecutor[Op.NEG] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] = -core.regs[rs];
	core.regs[rd] &= 0xffffffff;			
};
			
OpExecutor[Op.RET] = function(core) {
	core.ip = core.regs[Reg.rt];
};
			
OpExecutor[Op.JC_EQ] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if((core.regs[rd]>>>0) == (core.regs[rs]>>>0))
		core.ip = addr;
};
			
OpExecutor[Op.JC_NE] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if((core.regs[rd]>>>0) != (core.regs[rs]>>>0))
		core.ip = addr;
};
			
OpExecutor[Op.JC_GE] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if(core.regs[rd] >= core.regs[rs])
		core.ip = addr;
};
			
OpExecutor[Op.JC_GEU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if((core.regs[rd]>>>0) >= (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;		
};
			
OpExecutor[Op.JC_GT] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if(core.regs[rd] > core.regs[rs])
		core.ip = addr;		
};
			
OpExecutor[Op.JC_GTU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if((core.regs[rd]>>>0) > (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;
};
			
OpExecutor[Op.JC_LE] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if(core.regs[rd] <= core.regs[rs])
		core.ip = addr;
};
			
OpExecutor[Op.JC_LEU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if((core.regs[rd]>>>0) <= (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;
};
			
OpExecutor[Op.JC_LT] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if(core.regs[rd] < core.regs[rs])
		core.ip = addr;
};
			
OpExecutor[Op.JC_LTU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm16();
	if((core.regs[rd]>>>0) < (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;
};
			
OpExecutor[Op.JPI] = function(core) {
	var addr = core.fetchImm16();
	core.ip = addr;
};
			
OpExecutor[Op.JPR] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	core.ip = core.regs[rd];
};
		
OpExecutor[Op.XB] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] = ((core.regs[rs]&0x80) == 0) ? (core.regs[rs] & 0xff) : (core.regs[rs] | 0xffffff00);		
};
			
OpExecutor[Op.XH] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	core.regs[rd] = ((core.regs[rs]&0x8000) == 0) ? (core.regs[rs] & 0xffff) : (core.regs[rs] | 0xffff0000);
};
			
OpExecutor[Op.SYSCALL] = function(core) {
	var syscall = core.mem_cs.readUint8(core.ip++);
	//console.log("syscall: " + syscall);
	core.invokeSyscall(syscall);
};

OpExecutor[Op.CASE] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var imm32 = core.fetchImm24();
	imm32 <<= 2;
	var caseStart = core.mem_ds.readUint32(imm32);
	var caseLength = core.mem_ds.readUint32(imm32 + 4);
	var index = ((core.regs[rd]>>>0) - caseStart)>>>0;
	if(index <= caseLength) {
		tableAddr = imm32 + 12; // 3*sizeof(int)
	core.ip = core.mem_ds.readUint32(tableAddr + index*4); // index*sizeof(int)
	} else {
		defaultCaseAddr = core.mem_ds.readUint32(imm32 + 8); // 2*sizeof(int)
		core.ip = defaultCaseAddr;
	}
};
		
FarOpExecutor[Op.CALLI] = function(core) {
	var callAddr = core.fetchImm24();
	core.regs[Reg.rt] = core.ip;
	core.ip = callAddr;			
}
		
FarOpExecutor[Op.JC_EQ] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if(core.regs[rd] == core.regs[rs])
		core.ip = addr;
};
			
FarOpExecutor[Op.JC_NE] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if(core.regs[rd] != core.regs[rs])
		core.ip = addr;
};
			
FarOpExecutor[Op.JC_GE] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if(core.regs[rd] >= core.regs[rs])
		core.ip = addr;
};
			
FarOpExecutor[Op.JC_GEU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if((core.regs[rd]>>>0) >= (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;		
};
			
FarOpExecutor[Op.JC_GT] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if(core.regs[rd] > core.regs[rs])
		core.ip = addr;		
};
			
FarOpExecutor[Op.JC_GTU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if((core.regs[rd]>>>0) > (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;
};
			
FarOpExecutor[Op.JC_LE] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if(core.regs[rd] <= core.regs[rs])
		core.ip = addr;
};
			
FarOpExecutor[Op.JC_LEU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if((core.regs[rd]>>>0) <= (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;
};
			
FarOpExecutor[Op.JC_LT] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if(core.regs[rd] < core.regs[rs])
		core.ip = addr;
};
			
FarOpExecutor[Op.JC_LTU] = function(core) {
	var rd = core.mem_cs.readUint8(core.ip++);
	var rs = core.mem_cs.readUint8(core.ip++);
	var addr = core.fetchImm24();
	if((core.regs[rd]>>>0) < (core.regs[rs]>>>0)) // unsigned fix
		core.ip = addr;
};
			
FarOpExecutor[Op.JPI] = function(core) {
	var addr = core.fetchImm24();
	core.ip = addr;
};
		
OpExecutor[Op.FAR] = function(core) {
	var farOp = core.mem_cs.readUint8(core.ip++);
	FarOpExecutor[farOp](core);
};

function isCompatible() {
 	return (window.Uint8Array && window.Uint16Array && window.Int32Array && window.ArrayBuffer );
}

function load_binary_array(url) {
 	var req, responeString, responseStringLength, responseArray;
	req = new XMLHttpRequest();
    req.open('GET', url, false);

    if ('mozResponseType' in req) {
        req.mozResponseType = 'arraybuffer';
	} else if ('responseType' in req) {
    	req.responseType = 'arraybuffer';
    } else {
    	req.overrideMimeType('text/plain; charset=x-user-defined');
   	}
    req.send(null);
    if (req.status != 200 && req.status != 0) {
        throw "Error while loading " + url;
    }

	var hasByteLength = true; 
	
	if ('mozResponse' in req) {
    	responseString = req.mozResponse;
    } else if (req.mozResponseArrayBuffer) {
    	responseString = req.mozResponseArrayBuffer;
    } else if ('responseType' in req) {
    	responseString = req.response;
    } else {
        responseString = req.responseText;
		hasByteLength = false;
    }

	if(hasByteLength == true) {
	    responseStringLength = responseString.byteLength;
	   	responseArray = new Uint8Array(responseString, 0, responseStringLength);
	    var memory = new Memory(responseStringLength);
	    for(var i = 0; i < responseStringLength; i++) {
	    	memory.writeUint8(i, responseArray[i]);
	    }		
	    return memory;
	} else {
	    responseStringLength = responseString.length;
	    var memory = new Memory(responseStringLength);
	    for(var i = 0; i < responseStringLength; i++) {
	    	memory.writeUint8(i, responseString.charCodeAt(i) & 0xff);
	    }
    		
	    return memory;
	}
};	
				
Core.prototype.GenConstTable = function() {
	for(var p=0; p<32; p++) {
		this.regs[p] = 0;
	}

	for (var n=1;n<17;n++)
	{
		this.regs[p++] = n;
		this.regs[p++] = (-n);
	}

	mask = 0x20;

	for (var n=0;n<32-5;n++)
	{
		this.regs[p++] = (mask-1);
		this.regs[p++] = (mask);
		mask <<= 1;
	}

	mask = 0x10;

	for (var n=0;n<10;n++)
	{
		this.regs[p++] = mask ^ 0xffffffff;
		mask <<= 1;
	}

	/*		
	str = "";
	for(var i = 0; i < 128; i++) {
		str += this.regs[i] + ", ";
	}
	*/
	//console.log("regs: " + str);
}

function nextPowerOf2(minPow, x) {
	i = 1 << minPow;
	while(i < x) {
		i <<= 1;		
	}
	return i;
}

Core.prototype.getStackValue = function(offset) {
	return this.mem_ds.readInt32(core.regs[Reg.sp]+offset);
}
		
Core.prototype.pointerToString = function(ptr, unicode) {
	var ret = "";
	var i = 0;
	var t;
	if(unicode == undefined) {
		while (1) {
			t = String.fromCharCode(this.mem_ds.readInt8(ptr + i));
			if (t == "\0") { break; } else {}
			ret += t;
			i += 1;
		}
	} else {
		while (1) {
			t = String.fromCharCode(this.mem_ds.readUint8(ptr + i));
			if (t == "\0") { break; } else {}
			ret += t;
			i += 2;
		}
	}
			
	return ret;
}

Core.prototype.pointerToStringWithBounds = function(ptr, bounds) {
	var ret = "";
	var i = 0;
	var t;
	while (1) {
		t = String.fromCharCode(this.mem_ds.readInt8(ptr + i));
		if (i == bounds || t == "\0") { break; } else {}
		ret += t;
		i += 1;
	}
	return ret;
}

function getFunctionBodyAsString(func) {
	var funcStr = func.toString();
	return funcStr.substring(funcStr.indexOf("{") + 1, funcStr.lastIndexOf("}"));
}
		
function generateExecuteFast() {
	var code = "try {";
	code += "var core = this;\n";
	code += "var mem_ds = core.mem_ds;\n";
	code += "var mem_cs = core.mem_cs;\n";
	code += "while(opCount) {\n"
	code += "var op = mem_cs.readUint8(core.ip++);\n"
	code += "switch(op) {\n"		
	for (var key in Op) {
		var value = Op[key];
		code += "case " + value + ":\n";
 		if(key == Op.FAR) {
			code += "var op2 = mem_cs.readUint8(core.ip++);\n"
    		code += "switch(op) {\n"	
    		for(var key2 in FarOps) {
    			var value2 = FarOps[key2];
    			code += "case " + value2 + ":\n";
    			code += getFunctionBodyAsString(FarOpExecutor[value2]);
    			code += "break;\n"
    		}
    		code += "}\n";
    	} else {
    		code += getFunctionBodyAsString(OpExecutor[value]);
    	}
    	code += "break;\n"
    }
    code += "}\n";
    code += "opCount--\n";		
    code += "}\n";		    	
    
    code += "} catch(e) {\n";
	code += "if(e.type == 'sleep') {\n";
	code += "this.sleepVm(e.data);\n";
	code += "} else {\n";
	code += "console.log(op + ': ' + e);\n";
	code +=	"}\n";
	code += "}\n";
	
    return new Function("opCount", code);
}	
		
Core.prototype.init = function(url_to_program, url_to_resources)
{		
	this.PROGRAM = load_binary_array(url_to_program);
				
	var offset = 0
	var Magic = this.PROGRAM.readUint32(offset); offset+=4;
	var CodeLen = this.PROGRAM.readInt32(offset); offset+=4;
	var DataLen = this.PROGRAM.readInt32(offset); offset+=4;
	var DataSize = this.PROGRAM.readInt32(offset); offset+=4;
	var StackSize = this.PROGRAM.readInt32(offset); offset+=4;
	var HeapSize = this.PROGRAM.readInt32(offset); offset+=4;
	var AppCode = this.PROGRAM.readInt32(offset); offset+=4;
	var AppID = this.PROGRAM.readInt32(offset); offset+=4;
	var EntryPoint = this.PROGRAM.readInt32(offset); offset+=4;
	var IntLen = this.PROGRAM.readInt32(offset); offset+=4;
	
	this.CodeLen = CodeLen;
	

	//console.log("Magic: " + Magic);
	if(Magic != 0x5844414d) alert("Wrong magic!!");
			
	this.ip = EntryPoint;
	console.log("EntryPoint: " + EntryPoint);
			
	if(CodeLen <= 0) alert("Invalid CodeLen");
	this.CODE_SEGMENT_SIZE = nextPowerOf2(2, CodeLen);
	this.CODE_SEGMENT_MASK = this.CODE_SEGMENT_SIZE-1;
	this.mem_cs = new Memory(this.CODE_SEGMENT_SIZE);
	for(var i=0; i<CodeLen; i++) {
		this.mem_cs.writeUint8(i, this.PROGRAM.readUint8(offset));
		offset++;				
	}
	for(var i=CodeLen;i<this.CODE_SEGMENT_SIZE;i++) {
		this.mem_cs.writeUint8(i, 0);
	}
				
	if(DataLen <= 0) alert("Invalid DataLen");
	this.DATA_SEGMENT_SIZE = nextPowerOf2(2, DataSize);
	this.DATA_SEGMENT_MASK = this.DATA_SEGMENT_SIZE-1;
	this.mem_ds = new Memory(this.DATA_SEGMENT_SIZE);
	for(var i=0; i<DataLen; i++) {
		this.mem_ds.writeUint8(i, this.PROGRAM.readUint8(offset));
		offset++;
	}

	for(var i=DataLen;i<this.DATA_SEGMENT_SIZE;i++) {
		this.mem_ds.writeUint8(i, 0);
	}
			
	if(IntLen <= 0) alert("Invalid IntLen");
	this.mem_cp = new Memory(IntLen*4);
	for(var i=0;i<IntLen;i++) {
		this.mem_cp.writeUint32(i*4, 
			(this.PROGRAM.readUint8(offset+0)<<0) |
			(this.PROGRAM.readUint8(offset+1)<<8) |
			(this.PROGRAM.readUint8(offset+2)<<16) |
			(this.PROGRAM.readUint8(offset+3)<<24)	
		);
		offset+=4;
	}
	this.GenConstTable();
			
	this.regs[Reg.sp] = DataSize-28;
	this.regs[Reg.i0] = DataSize;
	this.regs[Reg.i1] = StackSize;
	this.regs[Reg.i2] = HeapSize;
	this.customEventPointer = DataSize-24;
	
	
	//console.log("EntryPoint: " + EntryPoint);
		
	this.Syscalls = new Syscall(this);
	this.Syscalls.init();
	if(url_to_resources != undefined) {
		var resources = load_binary_array(url_to_resources);
		this.Syscalls.loadResources(resources);
	}
	
	this.executeFast = generateExecuteFast();

	this.recompiledCode = undefined;
}
		
		
//struct StateChange { int ip, instCount, reg, before, after; };	
beforeRegs = null;
function logStateChanges() {
	if(beforeRegs == null) {
		beforeRegs = [];
		for(var v = 0; v < regs.length; v++) {
			beforeRegs[v] = regs[v];
		}
				
		stateChangeInstCount = 0;
		stateChanges = [];
		ipBefore = ip;
	}
	stateChangeInstCount++;
			
	if(stateChangeInstCount>1500) return;
			
	for(var i = regs.length-1; i >= 0; i--) {
		if((regs[i]>>>0) != (beforeRegs[i]>>>0)) {
			stateChanges.push(
				{
					ip: ip,
					ipBefore: ipBefore,
					instCount: stateChangeInstCount,
					reg: i,
					before: beforeRegs[i]>>>0,
					after: regs[i]>>>0
				}
				);
						
				if(stateChanges.length >= 1) {
					for(var j = 0; j < stateChanges.length; j++) {
						stateChange = stateChanges[j];
						//console.log("%s, %d: REG%d: %s != %s",
						var ipString = stateChange.ip.toString(16);
						var instCountString = stateChange.instCount;
						var regString = stateChange.reg;
						var beforeString = stateChange.before.toString(16); 
						var afterString = stateChange.after.toString(16);
								
						opStr = getNameOfOp(mem_cs.readUint8(stateChange.ipBefore));
							
						console.log(// opStr + ": " +
						ipString + ", " + instCountString +
						": REG" + regString + ": " +
						beforeString + " != " + afterString);
					}
							
					stateChanges = [];
				}
						
				beforeRegs[i] = regs[i];
		}
	}
	ipBefore = ip;
}

// Would be nice with an interactive disassembler / debugger.
// returns {length: x, str: y, rd:, rs:, imm32:}
function disassembleInstruction(instructionPointer) {
}

		// idea it should be quite easy to make sort of a "jit"
		// that whenever a call is done checks to see if the function
		// is "recompiled", we can use eval to build these functions..
Core.prototype.executeStd = function(opCount) {
	var op;
	var opExec = OpExecutor;
	var mem_cs = this.mem_cs;
	try {
		while(opCount) {
			//logStateChanges();
			op = mem_cs.readUint8(this.ip++);
				
			// debug stuff
			//if(stateChangeInstCount<1500)
			//	console.log("executing op: " + getNameOfOp(op));
			opExec[op](this);
			opCount--;
		}
	} catch(e) {
		if(e.type == "sleep") {
			this.sleepVm(e.data);
		} else {
			console.log(op + ": " + e);
		}
	}			
}
		
Core.prototype.start = function() {
	if(this.vmInterval != undefined)
		this.stop();
	var core = this;
	var date = new Date();
	this.vmInterval = setInterval(function() {
		//var before = date.getTime();
		//core.executeFast(core.variableOpCount);
		core.executeFast2(core.variableOpCount);
		//core.executeStd(core.variableOpCount);				
		//core.executeFastRecompiled(core.variableOpCount)
		//core.executeFastRecompiled2(core.variableOpCount);
		//var after = date.getTime();
		
		// we only need to sample events 4 times a second.. I believe..
		/*
		if(after-before<250)
			core.variableOpCount+=1000;
		else if(after-before>250)
			core.variableOpCount-=1000;
		*/
	}, 0);
}
		
Core.prototype.stop = function() {
	if(this.vmInterval == undefined) 
		return;
	clearInterval(this.vmInterval);
	this.vmInterval = undefined;
}
		
Core.prototype.wakeVm = function() {
	this.start();
}
		
Core.prototype.sleepVm = function(ms) {
	this.stop();
	var core = this;
	//this.vmInterval = setTimeout(function() {core.wakeVm();}, 0);		
	this.vmInterval = setTimeout(function() {core.wakeVm();}, ms);		
}


Core.prototype.requestAnimationFrame = function() {
	var core = this;
	window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(){
                window.setTimeout(core.wakeVm, 1000 / 60);
              };
    })();

	requestAnimFrame();
}

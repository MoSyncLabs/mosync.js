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

Core.prototype.executeFast2 = function(opCount) {
	var rd;
	var rs;
	var imm32;
	var op;
	var ip = this.ip;
	var mem_cs = this.mem_cs;
	var mem_ds = this.mem_ds;
	var mem_cp = this.mem_cp;
	
	var mem_cp32 = this.mem_cp.mem32;
	var mem_csU8 = this.mem_cs.memU8;
	var mem_dsU8 = this.mem_ds.memU8;
	var mem_dsU16 = this.mem_ds.memU16;
	var mem_ds32 = this.mem_ds.mem32;

	var regs = this.regs;
	
	try {
	
	while(opCount) {
			op = mem_csU8[ip++];
			switch(op) {
				case 0: 
				break;
				
				case 1: // PUSH
				rd = mem_csU8[ip++];
				imm32 = mem_csU8[ip++];
				if(rd < 2 || rd+imm32 > 32)
					alert("Hell");
				do {
					regs[Reg.sp] -= 4;
					//mem_ds.writeInt32(regs[Reg.sp], regs[rd]);
					mem_ds32[regs[Reg.sp]>>>2] = regs[rd];
					rd++;
					imm32--;
				} while(imm32 != 0);				
				break;
				
				case 2: // POP
				rd = mem_csU8[ip++];
				imm32 = mem_csU8[ip++];
				if(rd > 31 || rd-imm32 < 1)
					alert("Hell");
				do {
					//regs[rd] = mem_ds.readInt32(regs[Reg.sp]);
					regs[rd] = mem_ds32[regs[Reg.sp]>>>2];
					regs[Reg.sp] += 4;
					rd--;
					imm32--;
				} while(imm32 != 0);				
				break;

				case 3: // CALL
				rd = mem_csU8[ip++];
				regs[Reg.rt] = ip;
				ip = regs[rd];
				break

				case 4: // CALLI
				imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
				//console.log("calli addr: " + callAddr);
				regs[Reg.rt] = ip;
				ip = imm32 /*& CODE_SEGMENT_MASK*/;
				break;
				
				case 5: // LDB
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] = mem_dsU8[regs[rs]+imm32];
				break;
				
				case 6: // STB
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				mem_dsU8[regs[rd]+imm32] = regs[rs];
				break;
				
				case 7: // LDH
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] = mem_dsU16[(regs[rs]+imm32)>>>1];
				break;
				
				case 8: // STH
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				mem_dsU16[(regs[rd]+imm32)>>>1] = regs[rs];
				break;
				
				case 9: // LDW
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] = mem_ds32[(regs[rs]+imm32)>>>2];
				break;
				
				case 10: // STW
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				mem_ds32[(regs[rd]+imm32)>>>2] = regs[rs];
				break;
				
				case 11: // LDI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];		
				regs[rd] = imm32;
				break;
				
				case 12: // LDR
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] = regs[rs];				
				break;
				
				case 13: // ADD		
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] += regs[rs]; // maybe do (regs[rd]+regs[rs])|0
				regs[rd] &= 0xffffffff;
				break;
				
				case 14: // ADDI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] += imm32;
				//regs[rd] &= 0xffffffff;
				break;
				
				case 15: // MUL
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] *= regs[rs];
				regs[rd] &= 0xffffffff;
				break;
				
				case 16: // MULI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] *= imm32;		
				regs[rd] &= 0xffffffff;
				break;
				
				case 17: // SUB
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] -= regs[rs];				
				regs[rd] &= 0xffffffff;
				break;

				case 18: // SUBI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] -= imm32;
				regs[rd] &= 0xffffffff;
				break;
				
				case 19: // AND
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] &= regs[rs];
				break;
				
				case 20: // ANDI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] &= imm32;
				break;
				
				case 21: // OR
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] |= regs[rs];
				break;
				
				case 22: // ORI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] |= imm32;				
				break;
				
				case 23: // XOR
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] ^= regs[rs];		
				break;
				
				case 24: // XORI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] ^= imm32;
				break;
				
				case 25: // DIVU
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] = ((regs[rd]>>>0)/(regs[rs]>>>0)) | 0;
				regs[rd] &= 0xffffffff;
				break;
				
				case 26: // DIVUI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] = ((regs[rd]>>>0)/(imm32>>>0)) | 0;
				regs[rd] &= 0xffffffff;
				break;
				
				case 27: // DIV
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] = (regs[rd]/regs[rs]) | 0;	
				regs[rd] &= 0xffffffff;				
				break;
		
				case 28: // DIVI
				rd = mem_csU8[ip++];
				imm32 = ((imm32=mem_csU8[ip++])>127)?mem_cp32[(((imm32&127)<<8)|mem_csU8[ip++])]:mem_cp32[imm32];
				regs[rd] = (regs[rd]/imm32) | 0;
				regs[rd] &= 0xffffffff;				
				break;
				
				case 29: // SLL
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] <<= regs[rs];
				regs[rd] &= 0xffffffff;				
				break;
				
				case 30: // SLLI
				rd = mem_csU8[ip++];
				imm32 = mem_csU8[ip++];
				regs[rd] <<= imm32;	
				regs[rd] &= 0xffffffff;				
				break;
				
				case 31: // SRA
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] >>= regs[rs];	
				break;
		
				case 32: // SRAI
				rd = mem_csU8[ip++];
				imm32 = mem_csU8[ip++];
				regs[rd] >>= imm32;	
				break;
				
				case 33: // SRL
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] >>>= regs[rs];					
				break;
				
				case 34: // SRLI
				rd = mem_csU8[ip++];
				imm32 = mem_csU8[ip++];
				regs[rd] >>>= imm32;	
				break;
				
				case 35: // NOT 
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] = ~regs[rs];				
				regs[rd] &= 0xffffffff;
				break;

				case 36: // NEG
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] = -regs[rs];
				regs[rd] &= 0xffffffff;					
				break;
		
				case 37: // RET
				ip = regs[Reg.rt];
				break;
				
				case 38: // JC_EQ
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if((regs[rd]>>>0) == (regs[rs]>>>0)) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
					ip = imm32;
				} else {
					ip += 2;
				}
				break;						
				
				case 39: // JC_NE
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if((regs[rd]>>>0) != (regs[rs]>>>0)) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
					ip = imm32;
				} else {
					ip += 2;
				}		
				break;
				
				case 40: // JC_GE
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if(regs[rd] >= regs[rs]) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);	
					ip = imm32;			
				} else {
					ip += 2;
				}
				break;
				
				case 41: // JC_GEU
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if((regs[rd]>>>0) >= (regs[rs]>>>0)) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
					ip = imm32;
				} else {
					ip += 2;
				}			
				break;
				
				case 42: // JC_GT
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if(regs[rd] > regs[rs]) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);	
					ip = imm32;			
				} else {
					ip += 2;
				}
				break;
				
				case 43: // JC_GTU
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if((regs[rd]>>>0) > (regs[rs]>>>0)) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
					ip = imm32;
				} else {
					ip += 2;
				}	
				break;
				
				case 44: // JC_LE
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if(regs[rd] <= regs[rs]) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);	
					ip = imm32;			
				} else {
					ip += 2;
				}	
				break;						
	
				case 45: // JC_LEU
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if((regs[rd]>>>0) <= (regs[rs]>>>0)) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
					ip = imm32;
				} else {
					ip += 2;
				}		
				break;
				
				case 46: // JC_LT
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if(regs[rd] < regs[rs]) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);	
					ip = imm32;			
				} else {
					ip += 2;
				}		
				break;
				
				case 47: // JC_LTU
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				if((regs[rd]>>>0) < (regs[rs]>>>0)) {
					imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
					ip = imm32;
				} else {
					ip += 2;
				}
				break;
				
				case 48: // JPI
				imm32 =  (mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
				ip = imm32;
				break;
				
				case 49: // JPR
				rd = mem_csU8[ip++];
				ip = regs[rd];				
				break;						
	
				case 50: // XB
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] = ((regs[rs]&0x80) == 0) ? (regs[rs] & 0xff) : (regs[rs] | 0xffffff00);		
				break;
				
				case 51: // XH
				rd = mem_csU8[ip++];
				rs = mem_csU8[ip++];
				regs[rd] = ((regs[rs]&0x8000) == 0) ? (regs[rs] & 0xffff) : (regs[rs] | 0xffff0000);
				break;

				case 52: // SYSCALL
				imm32 = mem_csU8[ip++];
				this.invokeSyscall(imm32);
				break;
				
				case 53: // CASE
				rd = mem_csU8[ip++];
				imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
				imm32 <<= 2;
				var caseStart = mem_ds.readUint32(imm32);
				var caseLength = mem_ds.readUint32(imm32 + 4);
				var index = ((regs[rd]>>>0) - caseStart)>>>0;
				if(index <= caseLength) {
					tableAddr = imm32 + 12; // 3*sizeof(int)
					ip = mem_ds.readUint32(tableAddr + index*4); // index*sizeof(int)
				} else {
					defaultCaseAddr = mem_ds.readUint32(imm32 + 8); // 2*sizeof(int)
					ip = defaultCaseAddr;
				}				
				break;
				
				case 54: // FAR
					op = mem_csU8[ip++];
					switch(op) {
						case 4: // CALLI
						imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
						regs[Reg.rt] = ip;
						ip = imm32 /*& CODE_SEGMENT_MASK*/;		
						break;
						
						case 38: // JC_EQ
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if(regs[rd] == regs[rs]) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;
						
		
						case 39: // JC_NE
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if((regs[rd]>>>0) != (regs[rs]>>>0)) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;
				
						case 40: // JC_GE
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if(regs[rd] >= regs[rs]) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;
				
						case 41: // JC_GEU
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if((regs[rd]>>>0) >= (regs[rs]>>>0)) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}			
						break;
				
						case 42: // JC_GT
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if(regs[rd] > regs[rs]) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;
				
						case 43: // JC_GTU
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if((regs[rd]>>>0) > (regs[rs]>>>0)) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}	
						break;
				
						case 44: // JC_LE
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if(regs[rd] <= regs[rs]) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;						
	
						case 45: // JC_LEU
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if((regs[rd]>>>0) <= (regs[rs]>>>0)) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;
				
						case 46: // JC_LT
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if(regs[rd] < regs[rs]) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;
				
						case 47: // JC_LTU
						rd = mem_csU8[ip++];
						rs = mem_csU8[ip++];
						if((regs[rd]>>>0) < (regs[rs]>>>0)) {
							imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
							ip = imm32;
						} else {
							ip += 3;
						}
						break;
				
						case 48: // JPI
						imm32 =  (mem_csU8[ip++]<<16)|(mem_csU8[ip++]<<8)|(mem_csU8[ip++]);
						ip = imm32;
						break;
					}
				break;
		}
		opCount--;
	}
	
	} catch(e) {
		if(e.type == "sleep") {
			this.sleepVm(e.data);
		} 
		else if(e.type == "animationFrame") {
			this.requestAnimationFrame();
		}
		else {
			opStr = "";
			for(key in Op) {
				if(Op[key] == op) {
					opStr = key;
				}
			}
		
			console.log(e + " " + opStr);
			
		}
	}
	
	this.ip = ip;
}

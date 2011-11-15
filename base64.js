/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input, offset, size) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		//input = Base64._utf8_encode(input, offset, size);
 
		//while (i < input.length) {
		i+=offset;
		while (i < offset+size) {
 
	//		chr1 = input.charCodeAt(i++);
	//		chr2 = input.charCodeAt(i++);
	//		chr3 = input.charCodeAt(i++);
 			chr1 = input.readUint8(i++);
 			chr2 = input.readUint8(i++);
 			chr3 = input.readUint8(i++);
 			
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},

 
	// private method for UTF-8 encoding
	_utf8_encode : function (string, offset, size) {
		//string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < size; n++) {
 
			var c = string.readInt8(offset + n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
}

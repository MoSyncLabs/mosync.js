MoSync HTML5 javascript runtime
=========

About
---------------
This is an framework that introduces the possibility to run applications created for the MoSync SDK in an HTML5 enabled browser. In other words this means that programs written in pure C/C++ can run in a browser.

It needs a program and a resource file built using the MoSync SDK. Programs are interpreted and are therefore able to return to the main loop at regular intervals. This way the javascript runtime isn't blocked by the execution.

The file called maapi.js is tightly associated with a specific MoSync version. A version compatible with the latest stable (2011-Oct-21) version of the MoSync SDK is commited but if you want to use a newer / older version of the MoSync SDK we strongly suggest you to download and build tools/idl2 in the MoSync source (downloadable from www.mosync.com or clonable from www.github.com/MoSync) of the version you want to use it with. When idl2 has been executed a maapi.js file will be placed in the Output folder. In order to use it it is just a matter of copying it from that folder to the folder where you keep maapi.js.

Included as an example is Motris (a simple tetris clone). Just clone the repo and run the index.html (Chrome might complain, saying "Cross origin requests are only supported for HTTP". This security mechanism can however be turned off or solved by browsing to the page over http)

Resource types supported
---------------

Placeholders, binaries, unloaded binaries (implemented as binaries), images.

Native features (syscalls/ioctls) implemented
---------------

	maSetClipRect
	maGetClipRect
	maGetEvent
	maWait
	maGetMilliSecondCount
	maSetColor
	maGetScrSize
	maFillRect
	maUpdateScreen
	maDrawText
	maGetTextSize
	maDrawTextW
	maGetTextSizeW
	maDrawImage
	maDrawImageRegion (no rotations)
	maGetImageData
	maCreateImageRaw
	maCreateImageFromData
	maCreateDrawableImage
	maSetDrawTarget
	maGetImageSize
	maLocalTime
	maTime
	maCheckInterfaceVersion
	maCreatePlaceholder
	maCreateData
	maGetDataSize
	maWriteData
	maReadData
	maFrameBufferGetInfo
	maFrameBufferInit
	maFrameBufferClose
	maPanic
	maWriteLog (outputs to the debug console)

Also super experimental OpenGL|ES 2.0 support.

License
---------------

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

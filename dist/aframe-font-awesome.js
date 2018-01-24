/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	AFRAME.registerSystem('font-awesome', {
	    cache: {},
	    promises: {},

	    loaded: false,
	    promise: null,

	    draw: function(data) {
	        const key = [data.charcode, data.color, data.size].join('-');
	        if(!this.cache[key]) {
	            const size = data.size;

	            const canvas=document.createElement("canvas");
	            canvas.width = size;
	            canvas.height = size;
	            const ctx=canvas.getContext("2d");

	            const fontSize = 800 / (1024 / size);
	            const position = size / 2;

	            ctx.textAlign = 'center';
	            ctx.textBaseline = 'middle';
	            ctx.fillStyle = data.color;
	            ctx.font= fontSize + 'px FontAwesome';
	            ctx.fillText(String.fromCharCode('0x' + data.charcode),position,position);

	            this.cache[key] = canvas.toDataURL();
	        }

	        return this.cache[key];
	    },

	    isStylesheetLoaded: function() {
	        if(this.loaded) {
	            return Promise.resolve();
	        }

	        if(!this.promise) {
	            this.promise = new Promise((resolve) => {
	                const func = (fontFaceSetEvent) => {
	                    if (fontFaceSetEvent.fontfaces.find((fontface) => fontface.family.indexOf('FontAwesome') > -1)) {
	                        document.fonts.removeEventListener('loadingdone', func)
	                        this.onLoaded(resolve);
	                    }
	                };
	                document.fonts.addEventListener('loadingdone', func);
	            });
	        }

	        return this.promise;
	    },

	    onLoaded: function(resolve) {
	        this.el.emit('font-awesome.loaded');
	        this.loaded = true;

	        resolve();

	    },
	});

	AFRAME.registerComponent('font-awesome', {
	    schema: {
	        charcode: { type: 'string' },
	        color: { default: '#000', type: 'string' },
	        size: { default: '1024', type: 'number' },
	        visibleWhenDrawn: { default: 'true', 'type': 'boolean' },
	    },

	    update: function() {
	        if(this.data.visibleWhenDrawn) {
	            this.el.setAttribute('visible', 'false');
	        }

	        this.system.isStylesheetLoaded().then(function() {
	            const result = this.system.draw(this.data);
	            this.el.setAttribute('src', result);
	            this.el.emit('font-awesome.drawn');

	            if(this.data.visibleWhenDrawn) {
	                setTimeout(() => this.el.setAttribute('visible', 'true'));
	            }
	        }.bind(this));
	    }
	});

	AFRAME.registerPrimitive('a-font-awesome', {
	    defaultComponents: {
	        'geometry': { 'primitive': 'plane' },
	        'material': { 'transparent': 'true' },
	    },

	    // Maps HTML attributes to the `ocean` component's properties.
	    mappings: {
	        charcode: 'font-awesome.charcode',
	        color: 'font-awesome.color',
	        size: 'font-awesome.size',
	        src: 'material.src',
	    }
	});

/***/ }
/******/ ]);
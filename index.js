var versions = ['FontAwesome', '"Font Awesome 5 Pro"',
    '"Font Awesome 5 Free"', '"Font Awesome 5 Brands"'];

AFRAME.registerSystem('font-awesome', {
    schema: {
        timeout: { type: 'number', default: 2500 }
    },

    cache: {},
    promises: {},

    loaded: false,
    promise: null,

    init() {
        this.version = 'FontAwesome';
        this.el.emit('font-awesome-system-initialized', {scene: this.sceneEl});
    },

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
            const fontWeight = data.version == '"Font Awesome 5 Brands"' ? 900 : 400;
            ctx.font = fontWeight + ' ' + fontSize + 'px ' + data.version;
            ctx.fillText(String.fromCharCode('0x' + data.charcode),position,position);

            this.cache[key] = canvas.toDataURL();
        }

        return this.cache[key];
    },

    isStylesheetLoaded: function(version='FontAwesome') {
        if(this.loaded) {
            return Promise.resolve();
        }

        if(this.isFontAwesomeAvailable(version)) {
            this.onLoaded();
            return Promise.resolve();
        }

        if(!this.promise) {
            this.promise = new Promise((resolve) => {
                if(this.canCheckDocumentFonts()) {
                    const func = () => {
                        if (this.isFontAwesomeAvailable(version)) {
                            document.fonts.removeEventListener('loadingdone', func)
                            this.onLoaded(resolve);
                        }
                    };
                    document.fonts.addEventListener('loadingdone', func);
                } else {
                    console.warn('aframe-font-awesome: Unable to determine when FontAwesome stylesheet is loaded. Drawing fonts after ' + this.data.timeout + ' seconds');
                    console.warn('aframe-font-awesome: You can change the timeout by adding "font-awesome="timeout: $timeout" to your a-scene')

                    window.setTimeout(() => {
                        this.onLoaded(resolve);
                    }, this.data.timeout);
                }
            });
        }

        return this.promise;
    },

    isFontAwesomeAvailable: function(version='FontAwesome') {
        return this.canCheckDocumentFonts() && document.fonts.check('1px ' + version);
    },

    canCheckDocumentFonts: function() {
        return typeof document.fonts !== 'undefined' && document.fonts.check;
    },

    onLoaded: function(resolve) {
        this.el.emit('font-awesome.loaded');
        this.loaded = true;

        if(resolve) {
            resolve();
        }
    },

    setVersion(version) {
        if (versions.includes(version)) {
                this.version = version;
            }
        else {
            console.warn(version + ' is not an available Font Awesome version.')
        }
    },

    createMesh(iconDataURL, width) {
        var map = THREE.ImageUtils.loadTexture(iconDataURL);
        var geo = new THREE.PlaneBufferGeometry(width, width);
        var mat = new THREE.MeshBasicMaterial({
            map: map,
            side: THREE.DoubleSide,
            transparent: true,
        });
        return new THREE.Mesh(geo, mat);
    }
});

AFRAME.registerComponent('font-awesome', {
    schema: {
        id: { type: 'string', default: '' },
        charcode: { type: 'string' },
        color: { default: '#000', type: 'string' },
        size: { default: '1024', type: 'number' },
        fontSize: { type: 'number', default: 1 },
        fontSizeConstant: { type: 'number', default: 0.02836 },
        visibleWhenDrawn: { default: 'true', 'type': 'boolean' },
        mesh: { type: 'boolean', default: false },
        version: { type: 'string', default: '', onOf: versions},
    },

    multiple: true,

    init: function() {
        if (this.data.version == '') {
            this.data.version = this.system.version;
        }
    },

    update: function() {
        if(this.data.visibleWhenDrawn) {
            this.el.setAttribute('visible', 'false');
        }
        var width = this.data.fontSize * this.data.fontSizeConstant;

        this.system.isStylesheetLoaded(this.data.version).then(function() {
            const iconDataURL = this.el.sceneEl.systems["font-awesome"].draw(this.data);

            if (this.data.mesh) {
                var mesh = this.system.createMesh(iconDataURL, width);
                var meshName = this.data.id != '' ? 'fa-' + this.data.id : 'fa';
                this.el.setObject3D(meshName, mesh);
            }
            else {
                this.el.setAttribute('src', iconDataURL);
                this.el.emit('font-awesome.drawn');
            }
            
            this.el.emit('font-awesome.drawn', {id: this.data.id});

            if(this.data.visibleWhenDrawn) {
                setTimeout(() => this.el.setAttribute('visible', 'true'));
            }
        }.bind(this));
    }
});

AFRAME.registerPrimitive('a-font-awesome', {
    defaultComponents: {
        'geometry': { 'primitive': 'plane' },
        'material': { 'side': 'double', 'transparent': 'true' },
    },

    mappings: {
        charcode: 'font-awesome.charcode',
        color: 'font-awesome.color',
        size: 'font-awesome.size',
        src: 'material.src',
        version: 'font-awesome.version',
    }
});
import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://symfony.com/bundles/StimulusBundle/current/index.html#lazy-stimulus-controllers
*/

/* stimulusFetch: 'lazy' */

export default class extends Controller {
    initialize() {
        this.animate = this.animate.bind(this);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.flash = null;
        this.cloudParticles = [];
        this.rainGeo = null;
        this.rain = null;
        this.rainCount = 1500;
    }

    connect() {
        this.initThree();
        this.animate();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    disconnect() {
        cancelAnimationFrame(this.frameId);
        this.renderer?.dispose();
        window.removeEventListener('resize', this.onWindowResize);
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x11111f, 0.002);

        
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.z = 1;
        this.camera.rotation.x = 1.16;
        this.camera.rotation.y = -0.12;
        this.camera.rotation.z = 0.27;


        const ambient = new THREE.AmbientLight(0x555555);
        this.scene.add(ambient);

        this.flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
        this.flash.position.set(200, 300, 100);
        this.scene.add(this.flash);

        const directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1);
        this.scene.add(directionalLight);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor(this.scene.fog.color);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.element.appendChild(this.renderer.domElement);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor(this.scene.fog.color);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.element.appendChild(this.renderer.domElement);


        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-1';
        this.renderer.domElement.style.pointerEvents = 'none';

        this.rainGeo = new THREE.BufferGeometry();
        const rainVertices = [];
        for (let i = 0; i < this.rainCount; i++) {
            const x = Math.random() * 400 - 200;
            const y = Math.random() * 500 - 250;
            const z = Math.random() * 400 - 200;
            rainVertices.push(x, y, z);
        }
        this.rainGeo.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));
        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.1,
            transparent: true
        });
        this.rain = new THREE.Points(this.rainGeo, rainMaterial);
        this.scene.add(this.rain);

        const loader = new THREE.TextureLoader();
        loader.load('/img/smoke.png', (texture) => {
            const cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
            const cloudMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true
            });

            for (let p = 0; p < 25; p++) {
                const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
                cloud.position.set(
                    Math.random() * 800 - 400,
                    500,
                    Math.random() * 500 - 450
                );
                cloud.rotation.x = 1.16;
                cloud.rotation.y = -0.12;
                cloud.rotation.z = Math.random() * Math.PI * 2;
                cloud.material.opacity = 0.6;
                this.cloudParticles.push(cloud);
                this.scene.add(cloud);
            }
        });
    }

    animate() {
        this.frameId = requestAnimationFrame(this.animate);

        this.cloudParticles.forEach(p => { p.rotation.z -= 0.002; });

        const positions = this.rainGeo.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.1 + Math.random() * 1; 
            if (positions[i] < -200) positions[i] = 200;
        }
        this.rainGeo.attributes.position.needsUpdate = true;

        if (Math.random() > 0.93 || this.flash.power > 100) {
            if (this.flash.power < 100)
                this.flash.position.set(
                    Math.random() * 400,
                    300 + Math.random() * 200,
                    100
                );
            this.flash.power = 50 + Math.random() * 500;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}


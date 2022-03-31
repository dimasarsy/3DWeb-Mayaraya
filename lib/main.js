(function(){

    'use strict';
    var scene, camera, renderer;

    var HEIGHT, WIDTH, fieldOfView, aspectRatio, nearPlane,
        farPlane, fogHex, fogDensity, land,land2,land3, loader,loader2,loader3, bgLoader, 
        background, cameraZ, texture, geometry, i, parameters,
        parameterCount, size, materials = [],
        ambient, pLight, controls;
    
    const clock = new THREE.Clock()
    var particlesMaterial, particlesMesh;

    init();
    animate();

    function init(){

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;

        fieldOfView = 45;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 1000;

        // CAMERA
        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        cameraZ = farPlane / 3;

        camera.position.z += 30;
        camera.position.y += 10;
        

        fogHex = 0x000000; 
        fogDensity = 0.0007;

        // SCENE
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        camera.lookAt(scene.position);
        // WEB GL & SHADOW MAP
        renderer = new THREE.WebGLRenderer({
            antialias:true
        });

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        renderer.setSize(WIDTH, HEIGHT); 
        renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(renderer.domElement);

        // BACKGROUND 360
        bgLoader = new THREE.CubeTextureLoader();
        background = bgLoader.load([
            'skybox/px.png',
            'skybox/nx.png',
            'skybox/py.png',
            'skybox/ny.png',
            'skybox/pz.png',
            'skybox/nz.png',

        ]);
        scene.background = background;

        model();
        // model2();
        // model3();
        audio();

        // CONTROLS
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.autoRotate = true;
        controls.enableRotate = true;
        controls.enableZoom = false;
    }

    function model(){

        /* ======== PARTICLE Systems ========= */

        const particlesCount = 3000
        const particlesGeometry = new THREE.BufferGeometry()
        const posArray = new Float32Array(particlesCount * 3)

        for(let i = 0; i < particlesCount * 3; i++){

          posArray[i] = (Math.random() - 0.5) * (Math.random() * 1000)
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

        const loaders = new THREE.TextureLoader()
        let texture = loaders.load('../../texture/particle.jpg')
        
        // Materials
        particlesMaterial = new THREE.PointsMaterial({
          size: 1,
          map: texture,
          transparent: true,
          depthTest : false,
          alphaTest : 0.1,
          blending: THREE.AdditiveBlending,
        })

        // Mesh
        particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particlesMesh)

        /* ======== end of PARTICLE Systems ========= */

        // MODEL

        loader = new THREE.GLTFLoader().load('model/scene.gltf',
        
        function(result){
            land = result.scene.children[0]; 
            land.castShadow = true;
            scene.add(land);
        });

        //LIGHTS
        ambient = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambient);

        pLight = new THREE.PointLight(0xffffff, 1.7);
        pLight.position.set(1,4,1);
        pLight.castShadow = true;
        scene.add(pLight);
    }

    // function model2(){

    //     // MODEL

    //     loader2 = new THREE.GLTFLoader().load('model/scene.gltf',
        
    //     function(result){
    //         land2 = result.scene.children[0]; 
    //         land2.castShadow = true;
    //         land2.position.set(10,5,-10);
    //         scene.add(land2);
    //     });

    //     //LIGHTS
    //     ambient = new THREE.AmbientLight(0xffffff, 0.4);
    //     scene.add(ambient);

    //     pLight = new THREE.PointLight(0xffffff, 0.7);
    //     pLight.position.set(10,5,-10);
    //     pLight.castShadow = true;
    //     scene.add(pLight);
    // }

    // function model3(){

    //     // MODEL

    //     loader3 = new THREE.GLTFLoader().load('model/scene.gltf',
        
    //     function(result){
    //         land3 = result.scene.children[0]; 
    //         land3.castShadow = true;
    //         land3.position.set(-10,5,-10);
    //         scene.add(land3);
    //     });

    //     //LIGHTS
    //     ambient = new THREE.AmbientLight(0xffffff, 0.4);
    //     scene.add(ambient);

    //     pLight = new THREE.PointLight(0xffffff, 0.7);
    //     pLight.position.set(-10,5,-10);
    //     pLight.castShadow = true;
    //     scene.add(pLight);
    // }
    function audio(){
        let pendengar = new THREE.AudioListener();
        camera.add(pendengar);

        let sound1 = new THREE.Audio(pendengar);
        let loader = new THREE.AudioLoader().load('bensound-slowmotion.mp3',
        (hasil)=>{
            sound1.setBuffer(hasil);
            // sound1.play();
        });
        function mulaiAudio(){
            var play = document.getElementById("play");
            play.addEventListener('click', fplay);
            function fplay(){   
                    
                if(sound1.isPlaying){
                    sound1.pause();
                    // play.style.background="url('texture/play.png')"
                    
                    play.className = "bx-pause-circle";
                    
                }
                else{
                    sound1.play();
                    
                    play.className = "bx-right-arrow";
                }
            }
        } window.addEventListener('load', mulaiAudio);
            
    }

    function animate() {
        
        const elapsedTime = clock.getElapsedTime()

        particlesMesh.rotation.y = -.1 * elapsedTime

        requestAnimationFrame(animate);
        render();

    }

    function render() {
        var timer = Date.now() * 0.0002;

        // camera.position.x = Math.cos(timer) * 10;
        // camera.position.y = Math.sin(timer) * 10;

        // camera.lookAt(scene.position)
        controls.update();
        renderer.render(scene, camera);
    }

})();
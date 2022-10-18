import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


import portalVertexShader from '../shaders/portal/vertex.glsl?raw';
import portalFragmentShader from '../shaders/portal/fragment.glsl?raw';

{

    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene();

    const size = {

        width: window.innerWidth,
        height: window.innerHeight

    }

    const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100);
    camera.position.x = 14;
    camera.position.y = 15;
    camera.position.z = 12;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({

        canvas: canvas,
        antialias: true

    });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(10, 10, 10) },
    };

    const materialShader = new THREE.ShaderMaterial({

        fragmentShader: portalFragmentShader,
        vertexShader: portalVertexShader,
        uniforms,

    });


    //LIGHTS
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 10, 0);
    pointLight.position.set(10, 4, -1);
    scene.add(pointLight);

    // const sphereSize = 0.5;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // scene.add(pointLightHelper);

    const pointLight2 = new THREE.PointLight(0xffffff, 10, 0);
    pointLight2.position.set(-10, 4, -1);
    scene.add(pointLight2);


    const loader2 = new GLTFLoader();

    loader2.load(
        // resource URL
        'assets/scene.glb',
        (gltf) => {
            gltf.scene.traverse(child => {

                if (child.name === "Object_3") {
                    child.material = materialShader;
                }

            })
            scene.add(gltf.scene);
        }
    );

    const clock = new THREE.Clock();

    const draw = () => {

        const elapsedTime = clock.getElapsedTime();
        materialShader.uniforms.iTime.value = elapsedTime;

        renderer.render(scene, camera);
        window.requestAnimationFrame(draw);

    }


    window.addEventListener('resize', () => {

        //Update size

        size.width = window.innerWidth;
        size.height = window.innerHeight;

        //Update camera

        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();

        //Update renderer
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    })

    draw();

}
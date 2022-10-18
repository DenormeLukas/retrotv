import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


import portalVertexShader from '../shaders/portal/vertex.glsl?raw';
import portalFragmentShader from '../shaders/portal/fragment1.glsl?raw';
import portalFragmentShader2 from '../shaders/portal/fragment2.glsl?raw';
import portalFragmentShader3 from '../shaders/portal/fragment3.glsl?raw';


{

    const cursor = document.querySelector('.cursor');


    const moveCursor = (e) => {
        const mouseY = e.clientY;
        const mouseX = e.clientX;

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    }

    window.addEventListener('mousemove', moveCursor);

    let filter = 1;

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


    const materialShader = new THREE.ShaderMaterial({

        fragmentShader: portalFragmentShader,
        vertexShader: portalVertexShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3(10, 10, 0) },
        }

    });

    const materialShader2 = new THREE.ShaderMaterial({

        fragmentShader: portalFragmentShader2,
        vertexShader: portalVertexShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3(2, 2, 0) },
        }

    });

    const materialShader3 = new THREE.ShaderMaterial({

        fragmentShader: portalFragmentShader3,
        vertexShader: portalVertexShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3(25, 25, 0) },
        }

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

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove() {

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        console.log(intersects[0].object.name)


        if (intersects[0].object.name === "Object_16" || intersects[0].object.name === "Object_13") {

            filter = 1;


        } else if (intersects[0].object.name === "Object_8" || intersects[0].object.name === "Object_14") {

            filter = 2;

        } else if (intersects[0].object.name === "Object_2" || intersects[0].object.name === "Object_15") {

            filter = 3;

        }

        scene.traverse(child => {
            if (child.name === "Object_3") {
                switch (filter) {
                    case 1:
                        child.material = materialShader;
                        break;
                    case 2:
                        child.material = materialShader2;
                        break;
                    case 3:
                        child.material = materialShader3;
                        break;
                    default:
                        break;
                }
            }
        });


        console.log(filter);


    }

    const draw = () => {


        const elapsedTime = clock.getElapsedTime();
        materialShader.uniforms.iTime.value = elapsedTime;
        materialShader2.uniforms.iTime.value = elapsedTime;
        materialShader3.uniforms.iTime.value = elapsedTime;

        window.addEventListener('mousedown', onPointerMove);

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
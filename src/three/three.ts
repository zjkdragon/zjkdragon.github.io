import * as THREE from 'three';

const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


export const run = () => {
  if (canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas
    });
    console.log("renderer: ", renderer);
    renderer.setClearColor("#7a7a7a"); // 设置渲染器背景为黑色

    const scene = new THREE.Scene();
    scene.overrideMaterial = null;

    const axesHelper = new THREE.AxesHelper(500)
    scene.add(axesHelper)

    const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0, 5000); //创建照相机;照相机默认坐标为(0,0,0); 默认面向为沿z轴向里观察;
    camera.position.set(0, 20, 50);  //设置照相机的位置
    camera.lookAt(new THREE.Vector3(0, 0, 0)); //设置照相机面向(0,0,0)坐标观察

    // window.addEventListener('resize', () => {
    //   console.log(window.innerWidth, window.innerHeight);
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;
    //
    //   camera.aspect = window.innerWidth / window.innerHeight;
    // })

    const light = new THREE.PointLight(0xffffff, 1, 100);  //创建光源
    light.position.set(1000, 1000, 1000);  //设置光源的位置

    const dirLight = new THREE.DirectionalLight('rgba(253,253,253)', 2);  //创建光源
    dirLight.position.set(1000, 1000, 1000);  //设置光源的位置

    const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 8);  //创建光源

    const geometry = new THREE.BoxGeometry(20, 20, 20); //创建一个立方体几何对象Geometry
    const material = new THREE.MeshBasicMaterial({
      color: 0x705070
    }); //材质对象Material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 10, 0);

    // scene.add(light);  //在场景中添加光源
    scene.add(dirLight);  //在场景中添加光源
    scene.add(hemiLight);  //在场景中添加光源
    // scene.add(mesh); //网格模型添加到场景中


    let mixer: any, walkAction: THREE.AnimationAction;
    window.addEventListener('keydown', (event) => {
      console.log('keydown', event, event.key);
      if (event.code === 'Enter') {
        // walkAction && walkAction.play();
      }
    });

    let robotModel: any;

    const loader = new GLTFLoader();
    // const dracoloader = new DRACOLoader();
    // dracoloader.setDecoderPath('./model/');
    // loader.setDRACOLoader(dracoloader);
    loader.load('/model/mech_drone.glb', glb => {
      console.log("glb: ", glb);
      robotModel = glb.scene;
      robotModel.rotateY(-Math.PI);
      mixer = new THREE.AnimationMixer(robotModel);
      console.log("animations: ", glb.animations);
      walkAction = mixer.clipAction(glb.animations[0]);
      walkAction.play();

      robotModel.scale.set(200, 200, 200);
      robotModel.position.set(0, -50, 0);
      scene.add(robotModel);
    });

    const clock = new THREE.Clock();

    // 动画循环
    function animate() {
      const delta = clock.getDelta();
      mixer && mixer.update(delta);
      // robotModel && robotModel.rotateY(0.01);
      renderer.render(scene, camera); // 渲染
      requestAnimationFrame(animate);
    }
    animate();
  }
}

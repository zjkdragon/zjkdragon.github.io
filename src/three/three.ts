import * as THREE from 'three';

const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


export const run = () => {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas
    });
    console.log("renderer: ", renderer);
    renderer.setClearColor("#7a7a7a"); // 设置渲染器背景为黑色
    // 立即设置渲染器尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);


    // 添加旋转控制变量
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
    let rotationSpeed = 0.5;

    // 添加鼠标事件监听
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    });

    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y
        };

        // 修改为更合理的旋转控制
        camera.position.x -= deltaMove.x * rotationSpeed;
        camera.position.y += deltaMove.y * rotationSpeed;

        // 确保摄像机始终看向原点
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        previousMousePosition = {
          x: e.clientX,
          y: e.clientY
        };
      }
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    // 添加触摸事件监听
    let initialDistance = 0;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const deltaDistance = currentDistance - initialDistance;
        const zoomSpeed = 0.1;
        
        // 计算摄像机与原点之间的向量
        const direction = new THREE.Vector3().subVectors(
          camera.position,
          new THREE.Vector3(0, 0, 0)
        ).normalize();
        
        // 根据手势调整摄像机位置
        camera.position.add(direction.multiplyScalar(deltaDistance * zoomSpeed));
        
        // 确保摄像机始终看向原点
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        initialDistance = currentDistance;
      }
    });

    canvas.addEventListener('touchend', () => {
      initialDistance = 0;
    });

     // 替换为新的双指触摸事件监听
     let initialY = 0;
     canvas.addEventListener('touchstart', (e) => {
       if (e.touches.length === 2) {
         e.preventDefault(); // 阻止默认行为
         initialY = (e.touches[0].clientY + e.touches[1].clientY) / 2; // 计算两指中点Y坐标
       }
     });
 
     canvas.addEventListener('touchmove', (e) => {
       if (e.touches.length === 2) {
         e.preventDefault(); // 阻止默认行为
         const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
         const deltaY = currentY - initialY;
         const zoomSpeed = 0.5;
         
         // 计算摄像机与原点之间的向量
         const direction = new THREE.Vector3().subVectors(
           camera.position,
           new THREE.Vector3(0, 0, 0)
         ).normalize();
         
         // 根据上下方向调整摄像机位置
         camera.position.add(direction.multiplyScalar(-deltaY * zoomSpeed));
         
         // 确保摄像机始终看向原点
         camera.lookAt(new THREE.Vector3(0, 0, 0));
         
         initialY = currentY;
       }
     });
 
     canvas.addEventListener('touchend', () => {
       initialY = 0;
     });

    const scene = new THREE.Scene();
    scene.overrideMaterial = null;

    const axesHelper = new THREE.AxesHelper(500)
    scene.add(axesHelper)

    const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0, 5000); //创建照相机;照相机默认坐标为(0,0,0); 默认面向为沿z轴向里观察;
    camera.position.set(0, 20, 100);  //设置照相机的位置
    camera.lookAt(new THREE.Vector3(0, 0, 0)); //设置照相机面向(0,0,0)坐标观察
    // 更新正交相机参数（这部分也需要在初始化时执行）
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -100 * aspect;
    camera.right = 100 * aspect;
    camera.top = 100;
    camera.bottom = -100;
    camera.updateProjectionMatrix();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      renderer.setSize(window.innerWidth, window.innerHeight);

      // 更新正交相机参数
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -100 * aspect;
      camera.right = 100 * aspect;
      camera.top = 100;
      camera.bottom = -100;
      camera.updateProjectionMatrix();
    })

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
    loader.load('/model/RobotExpressive.glb', glb => {
      console.log("glb: ", glb);
      robotModel = glb.scene;
      robotModel.rotateY(-Math.PI);
      mixer = new THREE.AnimationMixer(robotModel);
      console.log("animations: ", glb.animations);
      walkAction = mixer.clipAction(glb.animations[4]);
      walkAction.play();

      robotModel.scale.set(20, 20, 20);
      robotModel.position.set(0, -20, 0);
      robotModel.rotateY(Math.PI);
      scene.add(robotModel);
    });

    const clock = new THREE.Clock();

    // 动画循环
    function animate() {
      const delta = clock.getDelta();
      mixer && mixer.update(delta);
      // 确保摄像机始终看向原点
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      renderer.render(scene, camera); // 渲染
      requestAnimationFrame(animate);
    }
    animate();
  }
}

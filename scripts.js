import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";


/* =========================================================
   STANFORD — CINEMATIC 3D CAMPUS
   ========================================================= */

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x91a8ad);

scene.fog = new THREE.FogExp2(
  0x91a8ad,
  0.006
);


/* CAMERA */

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1500
);

camera.position.set(
  0,
  8,
  75
);


/* RENDERER */

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.7)
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;


/* CONTROLS */

const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = .06;

controls.enablePan = false;

controls.minDistance = 3;

controls.maxDistance = 90;

controls.maxPolarAngle = Math.PI / 2.05;


/* LIGHT */

const hemi = new THREE.HemisphereLight(
  0xddeaff,
  0x5b4b3b,
  2
);

scene.add(hemi);


const sun = new THREE.DirectionalLight(
  0xffe2b4,
  4
);

sun.position.set(
  -100,
  160,
  100
);

sun.castShadow = true;

sun.shadow.mapSize.set(
  2048,
  2048
);

scene.add(sun);


const warmLight = new THREE.PointLight(
  0xffb35c,
  10,
  100
);

warmLight.position.set(
  0,
  12,
  20
);

scene.add(warmLight);


/* WORLD */

const world = new THREE.Group();

scene.add(world);


/* =========================================================
   MATERIALS
   ========================================================= */

const sandstone = new THREE.MeshStandardMaterial({
  color: 0xa98c70,
  roughness: .82
});

const sandstoneDark = new THREE.MeshStandardMaterial({
  color: 0x806a56,
  roughness: .9
});

const roofMaterial = new THREE.MeshStandardMaterial({
  color: 0x6e3f32,
  roughness: .75
});

const darkWood = new THREE.MeshStandardMaterial({
  color: 0x241b16,
  roughness: .65
});

const glass = new THREE.MeshPhysicalMaterial({
  color: 0x42636d,
  roughness: .15,
  metalness: .05,
  transmission: .2,
  transparent: true,
  opacity: .7
});

const grassMaterial = new THREE.MeshStandardMaterial({
  color: 0x42583d,
  roughness: 1
});


/* =========================================================
   GROUND
   ========================================================= */

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(
    1000,
    1000
  ),
  grassMaterial
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

world.add(ground);


/* =========================================================
   PATH
   ========================================================= */

function path(
  x,
  z,
  width,
  depth
) {

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      .08,
      depth
    ),
    new THREE.MeshStandardMaterial({
      color: 0xb8a78d,
      roughness: 1
    })
  );

  mesh.position.set(
    x,
    .04,
    z
  );

  mesh.receiveShadow = true;

  world.add(mesh);
}


path(
  0,
  0,
  18,
  230
);

path(
  0,
  -70,
  90,
  15
);

path(
  -65,
  -25,
  15,
  110
);


/* =========================================================
   TREES
   ========================================================= */

function tree(x, z, scale = 1) {

  const group = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(
      .35,
      .55,
      7,
      8
    ),
    new THREE.MeshStandardMaterial({
      color: 0x604938
    })
  );

  trunk.position.y = 3.5;

  trunk.castShadow = true;

  group.add(trunk);


  for (let i = 0; i < 5; i++) {

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(
        3.2,
        10,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x304c37
      })
    );

    leaves.position.set(
      Math.sin(i) * 2,
      7 + Math.cos(i) * 1.2,
      Math.cos(i) * 2
    );

    leaves.scale.y = .7;

    leaves.castShadow = true;

    group.add(leaves);
  }

  group.position.set(
    x,
    0,
    z
  );

  group.scale.setScalar(scale);

  world.add(group);
}


/* Palm Drive */

for (
  let z = -130;
  z <= 80;
  z += 18
) {

  tree(
    -14,
    z,
    1.1
  );

  tree(
    14,
    z,
    1.1
  );
}


/* background trees */

for (
  let i = 0;
  i < 80;
  i++
) {

  const x =
    (Math.random() - .5) * 350;

  const z =
    -120 - Math.random() * 180;

  tree(
    x,
    z,
    .6 + Math.random() * .7
  );
}


/* =========================================================
   MAIN QUAD
   ========================================================= */

function createArcade(
  x,
  z,
  width,
  depth
) {

  const group = new THREE.Group();


  const building = new THREE.Mesh(
    new THREE.BoxGeometry(
      width,
      18,
      depth
    ),
    sandstone
  );

  building.position.y = 9;

  building.castShadow = true;

  building.receiveShadow = true;

  group.add(building);


  /* roof */

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(
      width + 1,
      2.2,
      depth + 1
    ),
    roofMaterial
  );

  roof.position.y = 19;

  roof.castShadow = true;

  group.add(roof);


  /* arches / columns */

  const columns =
    Math.floor(width / 6);

  for (
    let i = 0;
    i < columns;
    i++
  ) {

    const px =
      -width / 2 +
      3 +
      i * 6;

    const column =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          .45,
          .55,
          10,
          12
        ),
        sandstoneDark
      );

    column.position.set(
      px,
      5,
      depth / 2 + .7
    );

    column.castShadow = true;

    group.add(column);


    const arch =
      new THREE.Mesh(
        new THREE.TorusGeometry(
          2.4,
          .45,
          8,
          18,
          Math.PI
        ),
        sandstoneDark
      );

    arch.rotation.z = Math.PI;

    arch.position.set(
      px + 2.7,
      9,
      depth / 2 + .7
    );

    group.add(arch);
  }


  group.position.set(
    x,
    0,
    z
  );

  world.add(group);

  return group;
}


/* Quad wings */

createArcade(
  -32,
  -35,
  70,
  20
);

createArcade(
  32,
  -35,
  70,
  20
);

createArcade(
  -32,
  -80,
  70,
  20
);

createArcade(
  32,
  -80,
  70,
  20
);


/* =========================================================
   MEMORIAL CHURCH
   ========================================================= */

function createMemorialChurch() {

  const group = new THREE.Group();


  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        34,
        18,
        28
      ),
      sandstone
    );

  body.position.y = 9;

  body.castShadow = true;

  group.add(body);


  /* red roof */

  const roof =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        25,
        12,
        4
      ),
      roofMaterial
    );

  roof.rotation.y =
    Math.PI / 4;

  roof.position.y = 22;

  roof.scale.z = .75;

  group.add(roof);


  /* tower */

  const tower =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        8,
        30,
        8
      ),
      sandstone
    );

  tower.position.set(
    0,
    15,
    -13
  );

  tower.castShadow = true;

  group.add(tower);


  /* tower roof */

  const towerRoof =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        6,
        9,
        4
      ),
      roofMaterial
    );

  towerRoof.rotation.y =
    Math.PI / 4;

  towerRoof.position.set(
    0,
    34,
    -13
  );

  group.add(towerRoof);


  /* mosaic facade */

  const mosaic =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        20,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x806d4e,
        roughness: .6
      })
    );

  mosaic.position.set(
    0,
    10,
    14.1
  );

  group.add(mosaic);


  /* entrance */

  createDoor(
    group,
    0,
    0,
    14.7,
    "Memorial Church"
  );


  group.position.set(
    0,
    0,
    -110
  );

  world.add(group);

  return group;
}


/* =========================================================
   DOOR
   ========================================================= */

function createDoor(
  parent,
  x,
  y,
  z,
  name
) {

  const frame =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        6,
        9,
        .7
      ),
      sandstoneDark
    );

  frame.position.set(
    x,
    4.5,
    z
  );

  parent.add(frame);


  const door =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        4.3,
        7.8,
        .35
      ),
      darkWood
    );

  door.position.set(
    x,
    4,
    z + .45
  );

  door.userData.destination =
    name;

  door.userData.isDoor =
    true;

  parent.add(door);


  const handle =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        .12,
        8,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0xc6a25b,
        metalness: .8
      })
    );

  handle.position.set(
    x + 1.4,
    4,
    z + .7
  );

  parent.add(handle);
}


/* =========================================================
   HOOVER TOWER
   ========================================================= */

function createHooverTower() {

  const group =
    new THREE.Group();


  const tower =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        13,
        87,
        13
      ),
      new THREE.MeshStandardMaterial({
        color: 0x817b72,
        roughness: .75
      })
    );

  tower.position.y = 43.5;

  tower.castShadow = true;

  group.add(tower);


  const top =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        10,
        10,
        11,
        8
      ),
      sandstoneDark
    );

  top.position.y = 92;

  group.add(top);


  const roof =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        11,
        14,
        8
      ),
      roofMaterial
    );

  roof.position.y = 104;

  group.add(roof);


  /* windows */

  for (
    let y = 8;
    y < 82;
    y += 7
  ) {

    for (
      let x = -3.5;
      x <= 3.5;
      x += 3.5
    ) {

      const window =
        new THREE.Mesh(
          new THREE.BoxGeometry(
            1.2,
            2.4,
            .2
          ),
          glass
        );

      window.position.set(
        x,
        y,
        6.7
      );

      group.add(window);
    }
  }


  createDoor(
    group,
    0,
    0,
    6.8,
    "Hoover Tower"
  );


  group.position.set(
    65,
    0,
    -75
  );

  world.add(group);

  return group;
}


/* =========================================================
   OTHER DESTINATIONS
   ========================================================= */

function createBuilding(
  x,
  z,
  width,
  depth,
  height,
  name
) {

  const group =
    new THREE.Group();


  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        width,
        height,
        depth
      ),
      sandstone
    );

  body.position.y =
    height / 2;

  body.castShadow = true;

  body.receiveShadow = true;

  group.add(body);


  const roof =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        width + 1,
        2,
        depth + 1
      ),
      roofMaterial
    );

  roof.position.y =
    height + 1;

  group.add(roof);


  /* windows */

  for (
    let i = 0;
    i < Math.floor(width / 4);
    i++
  ) {

    const window =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          1.7,
          2.4,
          .2
        ),
        glass
      );

    window.position.set(
      -width / 2 + 3 + i * 4,
      height * .6,
      depth / 2 + .15
    );

    group.add(window);
  }


  createDoor(
    group,
    0,
    0,
    depth / 2 + .3,
    name
  );


  group.position.set(
    x,
    0,
    z
  );

  world.add(group);

  return group;
}


createBuilding(
  -72,
  20,
  35,
  24,
  16,
  "Admissions"
);


createBuilding(
  70,
  20,
  38,
  25,
  15,
  "Residence"
);


createBuilding(
  -65,
  -105,
  40,
  25,
  17,
  "Library"
);


/* Create the major landmarks */

createMemorialChurch();

createHooverTower();


/* =========================================================
   DISTANT HILLS
   ========================================================= */

const hills =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      500,
      120,
      30,
      10
    ),
    new THREE.MeshStandardMaterial({
      color: 0x6b7967,
      roughness: 1
    })
  );

hills.rotation.x =
  -Math.PI / 2;

hills.position.set(
  0,
  12,
  -260
);

world.add(hills);


/* =========================================================
   CHAPTERS
   ========================================================= */

const chapters = [

  {
    number: "01",
    location: "MEMORIAL COURT",
    title: "CAMPUS &<br>STUDENT LIFE",

    description:
      "What is it actually like to live and study at Stanford? Explore the campus atmosphere, student activities and daily university life.",

    cards: [
      "Main Quad",
      "Student organizations",
      "Sports & activities",
      "Silicon Valley"
    ],

    camera: {
      position: [0, 6, -72],
      target: [0, 8, -110]
    }
  },


  {
    number: "02",
    location: "MAIN QUAD",
    title: "MAJORS &<br>COURSES",

    description:
      "Stanford offers undergraduate study across many fields, from humanities and social sciences to engineering, computer science and economics.",

    cards: [
      "Engineering",
      "Computer Science",
      "Economics",
      "Humanities"
    ],

    camera: {
      position: [-15, 6, -35],
      target: [0, 8, -55]
    }
  },


  {
    number: "03",
    location: "ADMISSIONS OFFICE",
    title: "UNDERGRADUATE<br>ADMISSION",

    description:
      "For a French student, applying means understanding Stanford's international application requirements, academic expectations and English-language documentation.",

    cards: [
      "International applicant",
      "Academic record",
      "English proficiency",
      "Holistic review"
    ],

    camera: {
      position: [-72, 5, 38],
      target: [-72, 7, 20]
    }
  },


  {
    number: "04",
    location: "HOOVER TOWER",
    title: "TUITION &<br>FINANCIAL AID",

    description:
      "Stanford is a private university with a high published cost of attendance, but financial aid can significantly change what a student actually pays.",

    cards: [
      "Tuition",
      "Housing",
      "Financial aid",
      "Scholarships"
    ],

    camera: {
      position: [65, 10, -35],
      target: [65, 25, -75]
    }
  },


  {
    number: "05",
    location: "STUDENT RESIDENCE",
    title: "ACCOMMODATION &<br>LIVING EXPENSES",

    description:
      "Most undergraduate students live on campus. Housing, food, transportation and personal expenses are part of the overall cost of attendance.",

    cards: [
      "Campus housing",
      "Dining",
      "Daily expenses",
      "California"
    ],

    camera: {
      position: [70, 5, 45],
      target: [70, 7, 20]
    }
  },


  {
    number: "06",
    location: "GREEN LIBRARY",
    title: "THE STUDENT<br>EXPERIENCE",

    description:
      "Beyond classes, Stanford provides libraries, research opportunities, clubs, sports, entrepreneurship and a strong connection to the surrounding technology ecosystem.",

    cards: [
      "Research",
      "Entrepreneurship",
      "Clubs",
      "Libraries"
    ],

    camera: {
      position: [-65, 6, -75],
      target: [-65, 8, -105]
    }
  },


  {
    number: "07",
    location: "THE OVAL",
    title: "WOULD I<br>ACTUALLY APPLY?",

    description:
      "My final question is personal: considering Stanford's academic environment, admission selectivity, cost and international application process, would I actually apply?",

    cards: [
      "Academic ambition",
      "International profile",
      "Cost",
      "Personal motivation"
    ],

    camera: {
      position: [0, 7, 60],
      target: [0, 9, 0]
    }
  }

];


/* =========================================================
   UI
   ========================================================= */

const intro =
  document.getElementById("intro");

const enterButton =
  document.getElementById("enterButton");

const questionPanel =
  document.getElementById("questionPanel");

const panelNumber =
  document.getElementById("panelNumber");

const panelLocation =
  document.getElementById("panelLocation");

const panelTitle =
  document.getElementById("panelTitle");

const panelDescription =
  document.getElementById("panelDescription");

const infoCards =
  document.getElementById("infoCards");

const chapterNumber =
  document.getElementById("chapterNumber");

const locationText =
  document.getElementById("locationText");

const nextButton =
  document.getElementById("nextButton");

const menu =
  document.getElementById("menu");

const menuButton =
  document.getElementById("menuButton");

const closeMenu =
  document.getElementById("closeMenu");

const menuItems =
  document.getElementById("menuItems");

const transition =
  document.getElementById("transition");


let currentChapter = 0;

let started = false;


/* =========================================================
   SHOW CHAPTER
   ========================================================= */

function showChapter(index) {

  currentChapter =
    (index + chapters.length) %
    chapters.length;

  const data =
    chapters[currentChapter];


  panelNumber.textContent =
    data.number;

  chapterNumber.textContent =
    data.number;

  panelLocation.textContent =
    data.location;

  locationText.textContent =
    data.location;

  panelTitle.innerHTML =
    data.title;

  panelDescription.textContent =
    data.description;


  infoCards.innerHTML = "";

  data.cards.forEach(card => {

    const element =
      document.createElement("div");

    element.className =
      "info-card";

    element.textContent =
      card;

    infoCards.appendChild(element);

  });


  questionPanel.classList.add(
    "visible"
  );


  flyCamera(
    data.camera.position,
    data.camera.target
  );
}


/* =========================================================
   CINEMATIC CAMERA
   ========================================================= */

let cameraAnimation = null;


function flyCamera(
  destination,
  target
) {

  const startPosition =
    camera.position.clone();

  const startTarget =
    controls.target.clone();

  const endPosition =
    new THREE.Vector3(
      ...destination
    );

  const endTarget =
    new THREE.Vector3(
      ...target
    );


  const startTime =
    performance.now();

  const duration =
    2400;


  function animateCamera(time) {

    const progress =
      Math.min(
        (time - startTime) /
        duration,
        1
      );


    /* cinematic easing */

    const eased =
      1 -
      Math.pow(
        1 - progress,
        4
      );


    camera.position.lerpVectors(
      startPosition,
      endPosition,
      eased
    );


    controls.target.lerpVectors(
      startTarget,
      endTarget,
      eased
    );


    if (
      progress < 1
    ) {

      cameraAnimation =
        requestAnimationFrame(
          animateCamera
        );

    }

  }


  cancelAnimationFrame(
    cameraAnimation
  );

  cameraAnimation =
    requestAnimationFrame(
      animateCamera
    );
}


/* =========================================================
   DOOR TRANSITION
   ========================================================= */

function enterDestination(index) {

  transition.style.opacity =
    "1";


  setTimeout(() => {

    showChapter(index);

    transition.style.opacity =
      "0";

  }, 500);

}


/* =========================================================
   ENTER CAMPUS
   ========================================================= */

enterButton.addEventListener(
  "click",
  () => {

    started = true;

    intro.style.opacity = "0";

    intro.style.transform =
      "translateY(-30px)";

    setTimeout(() => {

      intro.style.display =
        "none";

      showChapter(0);

    }, 900);

  }
);


/* =========================================================
   NEXT
   ========================================================= */

nextButton.addEventListener(
  "click",
  () => {

    enterDestination(
      currentChapter + 1
    );

  }
);


/* =========================================================
   KEYBOARD
   ========================================================= */

window.addEventListener(
  "keydown",
  event => {

    if (!started)
      return;


    if (
      event.key === "ArrowRight"
    ) {

      enterDestination(
        currentChapter + 1
      );

    }


    if (
      event.key === "ArrowLeft"
    ) {

      enterDestination(
        currentChapter - 1
      );

    }


    if (
      event.key === "Escape"
    ) {

      menu.classList.remove(
        "open"
      );

    }

  }
);


/* =========================================================
   MENU
   ========================================================= */

menuButton.addEventListener(
  "click",
  () => {

    menu.classList.add(
      "open"
    );

  }
);


closeMenu.addEventListener(
  "click",
  () => {

    menu.classList.remove(
      "open"
    );

  }
);


chapters.forEach(
  (chapter, index) => {

    const item =
      document.createElement("div");

    item.className =
      "menu-item";

    item.innerHTML = `
      <div class="menu-item-number">
        ${chapter.number}
      </div>

      <div class="menu-item-title">
        ${chapter.location}
      </div>
    `;


    item.addEventListener(
      "click",
      () => {

        menu.classList.remove(
          "open"
        );

        enterDestination(
          index
        );

      }
    );


    menuItems.appendChild(
      item
    );

  }
);


/* =========================================================
   CLICK WORLD
   ========================================================= */

const raycaster =
  new THREE.Raycaster();

const mouse =
  new THREE.Vector2();


window.addEventListener(
  "click",
  event => {

    mouse.x =
      (event.clientX /
        window.innerWidth) *
        2 - 1;

    mouse.y =
      -(event.clientY /
        window.innerHeight) *
        2 + 1;


    raycaster.setFromCamera(
      mouse,
      camera
    );


    const intersections =
      raycaster.intersectObjects(
        world.children,
        true
      );


    if (
      intersections.length
    ) {

      const object =
        intersections[0].object;


      if (
        object.userData &&
        object.userData.isDoor
      ) {

        let index =
          chapters.findIndex(
            chapter =>
              chapter.location
                .toLowerCase()
                .includes(
                  object.userData.destination
                    .toLowerCase()
                )
          );


        if (index < 0)
          index = currentChapter + 1;


        enterDestination(index);

      }

    }

  }
);


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


/* =========================================================
   ANIMATION
   ========================================================= */

function animate() {

  requestAnimationFrame(
    animate
  );

  controls.update();

  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   LOADING
   ========================================================= */

setTimeout(
  () => {

    const loading =
      document.getElementById(
        "loading"
      );

    loading.style.opacity =
      "0";


    setTimeout(
      () => {

        loading.style.display =
          "none";

      },
      1200
    );

  },
  2500
);

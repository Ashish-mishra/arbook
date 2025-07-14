const sceneHandlerComponent = {
  init() {
    this.activeSceneName = null;
    this.activeSceneEntity = null;
    let found = false;

    // Keep track of which scenes have had their assets loaded already
    this.loadedAssets = {};

    // Keep track of object positions
    this.rabbitInitialPosition = null;
    this.turtleInitialPosition = null;

    const sceneHandlers = {
      // Each handler now checks if assets are loaded before showing them.
      coverpage: (detail) => {
        console.log("Inside handler for coverpage");
        const entity = document.getElementById("coverpage-scene");
        const audio = document.getElementById("coverpage-audio");
        audio.play().catch((error) => {
          console.error("Error trying to play audio:", error);
        });

        // Check if this scene's assets have been loaded yet
        if (!this.loadedAssets.coverpage) {
          this.loadedAssets.coverpage = true; // Mark as loaded
        }

        return entity;
      },

      intro_scene: (detail) => {
        console.log("Full detail object - ", JSON.stringify(detail, null, 4));

        const audio = document.getElementById("intro-audio");
        const rabbitModel = document.getElementById("hare-intro");
        const turtleModel = document.getElementById("tortoise-intro");

        rabbitModel.setAttribute("animation-mixer", {
          clip: "*",
          loop: "repeat",
          crossFadeDuration: 0.4,
        });
        rabbitModel.setAttribute("scale", ".002 .002 .002");
        turtleModel.setAttribute("animation-mixer", {
          clip: "*",
          loop: "repeat",
          crossFadeDuration: 0.4,
        });
        turtleModel.setAttribute("scale", ".002 .002 .002");

        audio.play().catch((error) => {
          console.error("Error trying to play audio:", error);
        });

        if (!this.loadedAssets.intro_scene) {
          rabbitModel.setAttribute("position", "-0.2 -0.3 0");
          turtleModel.setAttribute("position", "0.2 -0.3 0");
          this.loadedAssets.intro_scene = true;
        }

        // Show the models
        rabbitModel.setAttribute("visible", "true");
        turtleModel.setAttribute("visible", "false");
        // show after 9 secs
        setTimeout(() => {
          turtleModel.setAttribute("visible", "true");
        }, 9000);

        // no op
        return turtleModel;
      },

      racing_track: (detail) => {
        const scene = this.el.sceneEl;

        // Play the audio
        const audio = document.getElementById("race-audio");
        audio.play().catch((error) => {
          console.error("Error trying to play audio:", error);
        });
        const audio2 = document.getElementById("race-pistol-shot");
        audio2.play().catch((error) => {
          console.error("Error trying to play audio:", error);
        });

        this.currentRabbitStep = 0;
        this.currentTurtleStep = 0;

        this.race_pathPoints = [
          { x: -0.4, y: -0.3, z: 0 },
          { x: -0.2, y: -0.3, z: 0 },
          { x: 0, y: -0.3, z: 0 },
          { x: 0.2, y: -0.2, z: 0 },
          { x: 0.4, y: -0.1, z: 0 },
          { x: 0.5, y: 0, z: 0 },
          { x: 0.45, y: 0.1, z: 0 },
          { x: 0.4, y: 0.15, z: 0 },
        ];

        this.scalePoints = [
          ".002 .002 .002",
          ".002 .002 .002",
          ".002 .002 .002",
          ".002 .002 .002",
          ".002 .002 .002",
          ".001 .001 .001",
          ".001 .001 .001",
          ".001 .001 .001",
        ];

        const rabbitModel = document.getElementById("rabbit-model");
        rabbitModel.setAttribute(
          "gltf-model",
          require("./assets/3d-models/rabbit_running.glb")
        );
        rabbitModel.classList.add("cantap");
        rabbitModel.setAttribute("shadow", { receive: false, cast: false });
        rabbitModel.addEventListener("model-loaded", () => {
          rabbitModel.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          rabbitModel.setAttribute("scale", ".002 .002 .002");
          rabbitModel.setAttribute("xrextras-pinch-scale", "");
          rabbitModel.setAttribute("xrextras-two-finger-rotate", "");
          rabbitModel.setAttribute("visible", "true");
          rabbitModel.setAttribute("position", "-0.4 -0.3 0");
          rabbitModel.setAttribute("rotation", "0 129 0");
          // Start the Rabbit animation
          this.moveRabbitToNextPoint(this.race_pathPoints);
        });

        const turtleModel = document.getElementById("turtle-model");
        turtleModel.setAttribute(
          "gltf-model",
          require("./assets/3d-models/turtle_crawl.glb")
        );
        turtleModel.classList.add("cantap");
        turtleModel.setAttribute("shadow", { receive: false, cast: false });
        turtleModel.addEventListener("model-loaded", () => {
          turtleModel.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          turtleModel.setAttribute("scale", ".001 .001 .001");
          turtleModel.setAttribute("xrextras-pinch-scale", "");
          turtleModel.setAttribute("xrextras-two-finger-rotate", "");
          turtleModel.setAttribute("visible", "true");
          turtleModel.setAttribute("position", "-0.4 -0.3 0");
          turtleModel.setAttribute("rotation", "0 129 0");
          // Start the turtle animation
          this.moveTurtleToNextPoint(
            this.race_pathPoints,
            8000,
            "turtle-model"
          );
        });

        // Prevent next time asset creations
        if (!this.loadedAssets.racing_track) {
          this.loadedAssets.racing_track = true;
        }
        // no op
        return rabbitModel;
      },

      sleeping_tree: () => {
        this.currentTurtleStep = 0;
        // Start the Turtle animation
        this.treePathPoints = [
          { x: 0.4, y: -0.3, z: 0 },
          { x: 0.2, y: -0.4, z: 0 },
          { x: 0, y: -0.4, z: 0 },
          { x: -0.2, y: -0.6, z: 0 },
          { x: -0.4, y: -0.6, z: 0 },
        ];
        // Play the audio
        const audio = document.getElementById("sleep-audio");
        audio.play().catch((error) => {
          console.error("Error trying to play audio:", error);
        });

        const rabbitModel = document.getElementById("hare-passing");
        rabbitModel.setAttribute(
          "gltf-model",
          require("./assets/3d-models/rabbit_running_looking_back.glb")
        );
        rabbitModel.classList.add("cantap");
        rabbitModel.setAttribute("shadow", { receive: false, cast: false });
        rabbitModel.setAttribute("visible", "true");
        rabbitModel.addEventListener("model-loaded", () => {
          rabbitModel.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          rabbitModel.setAttribute("scale", ".25 .25 .25");
          rabbitModel.setAttribute("xrextras-pinch-scale", "");
          rabbitModel.setAttribute("xrextras-two-finger-rotate", "");
          rabbitModel.setAttribute("position", "0.3 -0.3 0");
        });

        // Show the sleeping hare and hide the running hare
        setTimeout(() => {
          const rabbitModel2 = document.getElementById("hare-sleeping");
          rabbitModel.setAttribute("visible", "false");
          rabbitModel2.setAttribute(
            "gltf-model",
            require("./assets/3d-models/rabbit_falling_sleep.glb")
          );
          rabbitModel2.addEventListener("model-loaded", () => {
            rabbitModel2.setAttribute("animation-mixer", {
              clip: "*",
              loop: "repeat",
              crossFadeDuration: 0.4,
            });
            rabbitModel2.setAttribute("scale", ".002 .002 .002");
            rabbitModel2.setAttribute("xrextras-pinch-scale", "");
            rabbitModel2.setAttribute("xrextras-two-finger-rotate", "");
            rabbitModel2.setAttribute("position", "-0.1 -0.2 0");
            rabbitModel2.setAttribute("rotation", "0 -45 0");
            rabbitModel2.setAttribute("visible", "true");
          });

          const turtleModel = document.getElementById("turtle-passing");
          turtleModel.classList.add("cantap");
          turtleModel.setAttribute("shadow", { receive: false, cast: false });
          turtleModel.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          turtleModel.setAttribute("scale", ".001 .001 .001");
          turtleModel.setAttribute("position", "0.4 -0.3 0");
          turtleModel.setAttribute("rotation", "0 -30 0");
          turtleModel.setAttribute("visible", "true");
          this.moveTurtleToNextPoint(
            this.treePathPoints,
            5000,
            "turtle-passing"
          );

          turtleModel.addEventListener("model-loaded", () => {
            turtleModel.setAttribute("xrextras-pinch-scale", "");
            turtleModel.setAttribute("xrextras-two-finger-rotate", "");
          });
        }, 15000);

        if (!this.loadedAssets.sleeping_tree) {
          this.loadedAssets.sleeping_tree = true;
        }
        return rabbitModel;
      },

      finish_line: () => {
        this.currentTurtleStep = 0;
        // Start the Turtle animation
        this.finishPathPoints = [
          { x: 0, y: -0.1, z: 0 },
          { x: 0, y: -0.2, z: 0 },
          { x: 0, y: -0.3, z: 0 },
        ];
        const turtleModel = document.getElementById("turtle-crawl");

        const audio1 = document.getElementById("crowd-cheer");
        audio1.play().catch((error) => {
          console.error("Error trying to play audio:", error);
        });
        setTimeout(() => {
          const audio2 = document.getElementById("tortoise-approaching");
          audio2.play().catch((error) => {
            console.error("Error trying to play audio:", error);
          });
          turtleModel.classList.add("cantap");
          turtleModel.setAttribute("shadow", { receive: false, cast: false });
          turtleModel.setAttribute("visible", "true");
          turtleModel.setAttribute("scale", ".001 .001 .001");
          turtleModel.setAttribute("position", "0 0 0");
          turtleModel.setAttribute("rotation", "0 -15 0");
          turtleModel.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          turtleModel.addEventListener("model-loaded", () => {
            turtleModel.setAttribute("xrextras-pinch-scale", "");
            turtleModel.setAttribute("xrextras-two-finger-rotate", "");

            // turtleModel.setAttribute('visible', 'false')
          });
          this.moveTurtleToNextPoint(
            this.finishPathPoints,
            8000,
            "turtle-crawl"
          );
        }, 3000);

        setTimeout(() => {
          turtleModel.setAttribute("visible", "false");

          const turtleDanceModel = document.getElementById("turtle-dancing");
          turtleDanceModel.classList.add("cantap");
          turtleDanceModel.setAttribute("shadow", {
            receive: false,
            cast: false,
          });
          turtleDanceModel.setAttribute("position", "-0.1 -0.3 0");
          turtleDanceModel.setAttribute("rotation", "0 -30 0");
          turtleDanceModel.setAttribute("visible", "true");
          turtleDanceModel.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          turtleDanceModel.setAttribute("scale", ".0015 .0015 .0015");

          const audio3 = document.getElementById("fireworks");
          audio3.play().catch((error) => {
            console.error("Error trying to play audio:", error);
          });
          const audio4 = document.getElementById("victory");
          audio4.play().catch((error) => {
            console.error("Error trying to play audio:", error);
          });
          turtleDanceModel.addEventListener("model-loaded", () => {
            turtleDanceModel.setAttribute("xrextras-pinch-scale", "");
            turtleDanceModel.setAttribute("xrextras-two-finger-rotate", "");
          });
          const rabbitModel = document.getElementById("hare-sad");
          rabbitModel.setAttribute(
            "gltf-model",
            require("./assets/3d-models/rabbit_sad.glb")
          );
          rabbitModel.classList.add("cantap");
          rabbitModel.setAttribute("shadow", { receive: false, cast: false });
          rabbitModel.addEventListener("model-loaded", () => {
            rabbitModel.setAttribute("animation-mixer", {
              clip: "*",
              loop: "repeat",
              crossFadeDuration: 0.4,
            });
            rabbitModel.setAttribute("scale", ".002 .002 .002");
            rabbitModel.setAttribute("xrextras-pinch-scale", "");
            rabbitModel.setAttribute("xrextras-two-finger-rotate", "");
            rabbitModel.setAttribute("visible", "true");
            rabbitModel.setAttribute("position", "0.1 -0.2 0");
          });

          // Jungle animals dancing
          const bear = document.getElementById("bear-dancing");
          bear.classList.add("cantap");
          bear.setAttribute("shadow", { receive: false, cast: false });
          bear.setAttribute("position", "-0.15 0.1 0");
          bear.setAttribute("rotation", "0 0 0");
          bear.setAttribute("visible", "true");
          bear.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          bear.setAttribute("scale", ".0005 .0005 .0005");

          const panda = document.getElementById("panda-dancing");
          panda.classList.add("cantap");
          panda.setAttribute("shadow", { receive: false, cast: false });
          panda.setAttribute("position", "-0.3 0.1 0");
          panda.setAttribute("rotation", "0 0 0");
          panda.setAttribute("visible", "true");
          panda.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          panda.setAttribute("scale", ".0005 .0005 .0005");

          const piglet = document.getElementById("piglet-dancing");
          piglet.classList.add("cantap");
          piglet.setAttribute("shadow", { receive: false, cast: false });
          piglet.setAttribute("position", "0.3 0.1 0");
          piglet.setAttribute("rotation", "0 0 0");
          piglet.setAttribute("visible", "true");
          piglet.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          piglet.setAttribute("scale", ".0005 .0005 .0005");

          const tiger = document.getElementById("tiger-dancing");
          tiger.classList.add("cantap");
          tiger.setAttribute("shadow", { receive: false, cast: false });
          tiger.setAttribute("position", "0.2 0.1 0");
          tiger.setAttribute("rotation", "0 0 0");
          tiger.setAttribute("visible", "true");
          tiger.setAttribute("animation-mixer", {
            clip: "*",
            loop: "repeat",
            crossFadeDuration: 0.4,
          });
          tiger.setAttribute("scale", ".0005 .0005 .0005");
        }, 15000);

        if (!this.loadedAssets.finish_line) {
          this.loadedAssets.finish_line = true;
        }

        return turtleModel;
      },
    };

    // --- Helper function and Event Listeners remain the same as before ---
    const hideAllScenes = () => {
      document.querySelectorAll(".scene-entity").forEach((entity) => {
        entity.setAttribute("visible", "false");
      });
      document.querySelectorAll(".scene-audio").forEach((audio) => {
        audio.pause();
      });
    };

    const onImageFound = ({ detail }) => {
      console.log("Got inside onImage Found with ", detail.name);
      if (!found) {
        // const logContainer = document.getElementById('logContainer')
        // logContainer.textContent = detail.name
        found = true;
      }

      if (this.activeSceneName === detail.name) return;
      hideAllScenes();

      const handler = sceneHandlers[detail.name];
      if (handler) {
        this.activeSceneName = detail.name;
        this.activeSceneEntity = handler(detail);
      }
    };
    const onImageLost = ({ detail }) => {
      console.log("On Image lost ");
      if (this.activeSceneName === detail.name) {
        hideAllScenes();
        this.activeSceneName = null;
        this.activeSceneEntity = null;
      }
    };
    const onImageUpdated = ({ detail }) => {};

    // Add the image tracking event listeners
    this.el.sceneEl.addEventListener("xrimagefound", onImageFound);
    this.el.sceneEl.addEventListener("xrimagelost", onImageLost);
    this.el.sceneEl.addEventListener("xrimageupdated", onImageUpdated);
  },

  moveRabbitToNextPoint(pathPoints) {
    const model = document.getElementById("rabbit-model");
    console.log("currentRabbitStep is ", this.currentRabbitStep);
    const startPoint = pathPoints[this.currentRabbitStep];
    const startScale = this.scalePoints[this.currentRabbitStep];

    this.currentRabbitStep = (this.currentRabbitStep + 1) % pathPoints.length; // Loop to the next point
    const endPoint = pathPoints[this.currentRabbitStep];
    const endScale = this.scalePoints[this.currentRabbitStep];

    // Instantly set the starting position to prevent jumps between animations
    model.setAttribute("position", startPoint);
    if (this.currentRabbitStep > 5) {
      model.setAttribute("rotation", "0 173 0");
    }
    // Update the single animation component with the new 'to' value
    model.setAttribute("animation", {
      property: "position",
      to: endPoint,
      dur: 4000, // Animation takes 1 second
      easing: "linear",
    });
    model.setAttribute("animation__scale", {
      property: "scale",
      to: endScale,
      dur: 4000,
      easing: "linear",
    });

    // Use a timeout to trigger the next step after 2 seconds
    setTimeout(this.moveRabbitToNextPoint.bind(this, pathPoints), 4000);
  },
  moveTurtleToNextPoint(pathPoints, duration, modelId) {
    const model = document.getElementById(modelId);
    console.log("currentTurtleStep is ", this.currentTurtleStep);
    const startPoint = pathPoints[this.currentTurtleStep];
    // const startScale = this.scalePoints[this.currentTurtleStep]

    this.currentTurtleStep = (this.currentTurtleStep + 1) % pathPoints.length; // Loop to the next point

    const endPoint = pathPoints[this.currentTurtleStep];

    // Instantly set the starting position to prevent jumps between animations
    model.setAttribute("position", startPoint);
    // model.setAttribute('scale', startScale)
    console.log("Moving to ", endPoint);
    // Update the single animation component with the new 'to' value
    model.setAttribute("animation__position", {
      property: "position",
      to: endPoint,
      dur: duration, // Animation takes 1 second
      easing: "linear",
    });

    // Use a timeout to trigger the next step after 2 seconds
    setTimeout(
      this.moveTurtleToNextPoint.bind(this, pathPoints, duration, modelId),
      duration
    );
  },
};
export { sceneHandlerComponent };

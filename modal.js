document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.image-modal-close');

    // Mobile menu functionality
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Add click event to all gallery images
    document.querySelectorAll('.artifact-gallery img').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImage.src = this.src;
            modalImage.alt = this.alt;
        });
    });

    // Close modal when clicking close button or outside the image
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('is-active');
        navMenu.classList.toggle('is-active');
    });

    function closeModal() {
        modal.style.display = 'none';
    }

});


document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.image-modal-close');

    // Mobile menu functionality
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Add click event to all gallery images
    document.querySelectorAll('.artifact-gallery img').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImage.src = this.src;
            modalImage.alt = this.alt;
        });
    });

    // Close modal when clicking close button or outside the image
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('is-active');
        navMenu.classList.toggle('is-active');
    });

    function closeModal() {
        modal.style.display = 'none';
    }

    // Set up 3D model viewer
    setupModelViewer();
});

async function setupModelViewer() {
    try {
        const container = document.getElementById('artifact1-model');
        if (!container) return;

        // Set container style
        container.style.width = '100%';
        container.style.height = '400px';
        container.style.position = 'relative';

        // Initialize Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Setup camera
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Setup renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Add OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Load the model
        const loader = new GLTFLoader();
        try {
            const gltf = await loader.loadAsync('3DModels/Gathering.glb');
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            gltf.scene.position.sub(center);
            
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            gltf.scene.scale.multiplyScalar(scale);
            
            scene.add(gltf.scene);
        } catch (error) {
            console.error('Error loading model:', error);
            container.innerHTML = '<p style="text-align: center; padding: 20px;">Error loading 3D model</p>';
        }

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        animate();
    } catch (error) {
        console.error('Error setting up 3D viewer:', error);
    }
}



/* DELETE THIS AFTER TESTING */

// Add this to your existing modal.js file
document.addEventListener('DOMContentLoaded', function() {
    // Create coordinate display box
    const coordinateDisplay = document.createElement('div');
    coordinateDisplay.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        z-index: 1000;
    `;
    document.body.appendChild(coordinateDisplay);

    // Add coordinate tracking to all model-viewers
    document.querySelectorAll('model-viewer').forEach(modelViewer => {
        // Show coordinates on mouse move
        modelViewer.addEventListener('mousemove', (event) => {
            const hit = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);
            if (hit) {
                const {x, y, z} = hit.position;
                coordinateDisplay.textContent = `
                    X: ${x.toFixed(3)}
                    Y: ${y.toFixed(3)}
                    Z: ${z.toFixed(3)}
                `;
            }
        });

        // Copy coordinates on click
        modelViewer.addEventListener('click', (event) => {
            const hit = modelViewer.positionAndNormalFromPoint(event.clientX, event.clientY);
            if (hit) {
                const {x, y, z} = hit.position;
                const {x: nx, y: ny, z: nz} = hit.normal;
                
                // Create hotspot HTML
                const hotspotHtml = `<button slot="hotspot-1" class="hotspot" 
                    data-position="${x.toFixed(3)} ${y.toFixed(3)} ${z.toFixed(3)}" 
                    data-normal="${nx.toFixed(3)} ${ny.toFixed(3)} ${nz.toFixed(3)}">
                    <div class="hotspot-label">Point Description</div>
                </button>`;
                
                console.log('Hotspot HTML:');
                console.log(hotspotHtml);
                
                // Copy coordinates to clipboard
                navigator.clipboard.writeText(
                    `data-position="${x.toFixed(3)} ${y.toFixed(3)} ${z.toFixed(3)}" data-normal="${nx.toFixed(3)} ${ny.toFixed(3)} ${nz.toFixed(3)}"`
                ).then(() => {
                    alert('Coordinates copied to clipboard!');
                });
            }
        });
    });
});

import * as THREE from 'three';

class ThreeBackground {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points;
  private galaxies: THREE.Group;
  private canvasContainer: HTMLElement;
  private animationFrameId: number | null = null;
  private mousePosition = new THREE.Vector2(0, 0);
  private raycaster = new THREE.Raycaster();

  constructor(containerId: string) {
    this.canvasContainer = document.getElementById(containerId) as HTMLElement;
    if (!this.canvasContainer) {
      throw new Error(`Container element with id "${containerId}" not found.`);
    }

    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 30;
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0c0c14, 1);
    this.canvasContainer.appendChild(this.renderer.domElement);
    
    // Create particle system and galaxies
    this.particles = this.createParticles();
    this.galaxies = new THREE.Group();
    this.createGalaxies();
    
    // Add to scene
    this.scene.add(this.particles);
    this.scene.add(this.galaxies);
    
    // Add post-processing glow
    this.addGlow();
    
    // Setup event listeners
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  private createParticles(): THREE.Points {
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    // Create particles that are more concentrated toward the center
    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a sphere
      const radius = Math.pow(Math.random(), 3) * 40; // Use exponential for more concentration in center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Size variation
      sizes[i] = Math.random() * 2 + 0.5;
      
      // Color - blue to purple gradient based on distance from center
      const distance = Math.sqrt(x * x + y * y + z * z);
      const maxDist = 40;
      const ratio = distance / maxDist;
      
      // Start with blue (closer to center) and fade to purple (further out)
      colors[i * 3] = 0.5 + ratio * 0.5; // Red (higher for outer particles)
      colors[i * 3 + 1] = 0.2 + ratio * 0.1; // Green (mostly low)
      colors[i * 3 + 2] = 0.8; // Blue (always high)
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Custom shader material for particles with glow effect
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Calculate new position with subtle movement
          vec3 pos = position;
          float noise = sin(time * 0.05 + position.x * 0.1) * 0.5 + 
                       cos(time * 0.07 + position.y * 0.1) * 0.5 +
                       sin(time * 0.09 + position.z * 0.1) * 0.5;
          pos += pos * 0.02 * noise;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (30.0 / -mvPosition.z) * pixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Calculate a circular gradient for each particle
          float distance = length(gl_PointCoord - vec2(0.5, 0.5));
          if (distance > 0.5) discard;
          
          // Soft edge glow effect
          float alpha = 1.0 - smoothstep(0.4, 0.5, distance);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    return new THREE.Points(particleGeometry, particleMaterial);
  }

  private createGalaxies() {
    // Create several small spiraling galaxy clusters
    for (let i = 0; i < 3; i++) {
      const galaxyCenter = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
      
      const galaxySize = 5 + Math.random() * 10;
      const galaxyParticleCount = 300;
      const galaxyGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(galaxyParticleCount * 3);
      const colors = new Float32Array(galaxyParticleCount * 3);
      
      // Color theme for this galaxy
      const colorThemes = [
        { inner: [0.6, 0.2, 1.0], outer: [0.2, 0.2, 0.8] }, // Purple to blue
        { inner: [0.1, 0.5, 1.0], outer: [0.4, 0.2, 0.8] }, // Cyan to purple
        { inner: [0.8, 0.2, 0.8], outer: [0.3, 0.1, 0.6] }  // Pink to purple
      ];
      
      const theme = colorThemes[i % colorThemes.length];
      
      // Create spiral galaxy
      for (let j = 0; j < galaxyParticleCount; j++) {
        // Spiral pattern
        const angle = (j / galaxyParticleCount) * Math.PI * 20;
        const radius = Math.pow(Math.random(), 0.5) * galaxySize;
        const spiralFactor = 0.6; // How tight the spiral is
        
        const x = radius * Math.cos(angle * spiralFactor);
        const y = radius * Math.sin(angle * spiralFactor);
        const z = (Math.random() - 0.5) * galaxySize * 0.2; // Thin disk
        
        // Apply galaxy position offset
        positions[j * 3] = x + galaxyCenter.x;
        positions[j * 3 + 1] = y + galaxyCenter.y;
        positions[j * 3 + 2] = z + galaxyCenter.z;
        
        // Color gradient from center to edge
        const distRatio = radius / galaxySize;
        colors[j * 3] = theme.inner[0] * (1 - distRatio) + theme.outer[0] * distRatio;
        colors[j * 3 + 1] = theme.inner[1] * (1 - distRatio) + theme.outer[1] * distRatio;
        colors[j * 3 + 2] = theme.inner[2] * (1 - distRatio) + theme.outer[2] * distRatio;
      }
      
      galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      
      const galaxyMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
      // Store initial position for animation
      galaxy.userData = {
        center: galaxyCenter.clone(),
        rotationSpeed: 0.0003 + Math.random() * 0.0003,
        tiltAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      };
      
      this.galaxies.add(galaxy);
    }
  }

  private addGlow() {
    // Add a bloom pass or your preferred post-processing effects here
    // For simplicity, we'll add a simple ambient light to enhance the glow
    const ambientLight = new THREE.AmbientLight(0x6030a0, 0.3);
    this.scene.add(ambientLight);
    
    // Add point lights near each galaxy
    this.galaxies.children.forEach((galaxy) => {
      const center = (galaxy as THREE.Points).userData.center;
      const light = new THREE.PointLight(0x8040ff, 1, 20);
      light.position.copy(center);
      this.scene.add(light);
    });
  }

  private animate = (timestamp: number): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Update particle shader time uniform
    if (this.particles.material instanceof THREE.ShaderMaterial) {
      this.particles.material.uniforms.time.value = timestamp * 0.001;
    }
    
    // Rotate the entire particle system slowly
    this.particles.rotation.y += 0.0001;
    this.particles.rotation.x += 0.00005;
    
    // Rotate each galaxy around its own axis and center
    this.galaxies.children.forEach((galaxy) => {
      const { center, rotationSpeed, tiltAxis } = galaxy.userData;
      
      // Rotate the galaxy around its own center
      galaxy.rotateOnAxis(tiltAxis, rotationSpeed);
      
      // Optional: Make galaxies react to mouse position
      if (this.mousePosition.x !== 0 || this.mousePosition.y !== 0) {
        // Subtle attraction/repulsion effect
        const attraction = new THREE.Vector3(
          this.mousePosition.x * 0.0001,
          -this.mousePosition.y * 0.0001,
          0
        );
        galaxy.position.add(attraction);
        
        // Gradually return to original position
        const originalPos = center.clone();
        const currentPos = new THREE.Vector3().copy(galaxy.position);
        const direction = originalPos.sub(currentPos);
        galaxy.position.add(direction.multiplyScalar(0.01));
      }
    });
    
    // Camera follows mouse slightly
    this.camera.position.x += (this.mousePosition.x * 0.02 - this.camera.position.x) * 0.01;
    this.camera.position.y += (-this.mousePosition.y * 0.02 - this.camera.position.y) * 0.01;
    this.camera.lookAt(0, 0, 0);
    
    this.renderer.render(this.scene, this.camera);
  };

  private handleResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update pixel ratio in shader if it exists
    if (this.particles.material instanceof THREE.ShaderMaterial) {
      this.particles.material.uniforms.pixelRatio.value = window.devicePixelRatio;
    }
  };

  private handleMouseMove = (event: MouseEvent): void => {
    // Calculate normalized mouse position (-1 to 1)
    this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = (event.clientY / window.innerHeight) * 2 - 1;
  };

  public start(): void {
    if (!this.animationFrameId) {
      this.animate(0);
    }
  }

  public stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    
    // Dispose of geometries and materials
    if (this.particles instanceof THREE.Points) {
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
    
    this.galaxies.children.forEach(galaxy => {
      if (galaxy instanceof THREE.Points) {
        galaxy.geometry.dispose();
        (galaxy.material as THREE.Material).dispose();
      }
    });
    
    // Remove renderer
    if (this.renderer && this.canvasContainer.contains(this.renderer.domElement)) {
      this.canvasContainer.removeChild(this.renderer.domElement);
    }
  }
}

export default ThreeBackground;
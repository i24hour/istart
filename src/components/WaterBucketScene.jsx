import { useEffect, useRef } from 'react';
import { getWaterColor } from '../utils/helpers';

function WaterBucketScene({ percentage, status, shouldAnimate }) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const waterRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const tapRef = useRef(null);

    useEffect(() => {
        if (typeof window.THREE === 'undefined') {
            console.error('Three.js not loaded');
            return;
        }

        const THREE = window.THREE;
        const container = containerRef.current;
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, 12);
        camera.lookAt(0, 2, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        // Glass Bucket (Cylinder)
        const bucketGeometry = new THREE.CylinderGeometry(2, 2, 6, 32, 1, true);
        const bucketMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xddeeff,
            transparent: true,
            opacity: 0.2,
            roughness: 0.1,
            metalness: 0.0,
            side: THREE.DoubleSide,
        });
        const bucket = new THREE.Mesh(bucketGeometry, bucketMaterial);
        bucket.position.y = 3;
        scene.add(bucket);

        // Bucket rim (solid ring at top)
        const rimGeometry = new THREE.TorusGeometry(2, 0.1, 16, 32);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0x99ccff,
            roughness: 0.3,
            metalness: 0.5,
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.y = 6;
        rim.rotation.x = 0;
        scene.add(rim);

        // Water inside bucket
        const colors = getWaterColor(status);
        const waterGeometry = new THREE.CylinderGeometry(1.9, 1.9, 6, 32);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.2,
            metalness: 0.1,
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.y = 0; // Start at bottom
        scene.add(water);
        waterRef.current = water;

        // Tap/Faucet above bucket
        const tapBody = new THREE.Group();

        // Vertical pipe
        const pipeGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
        const tapMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            roughness: 0.4,
            metalness: 0.8,
        });
        const pipe = new THREE.Mesh(pipeGeometry, tapMaterial);
        pipe.position.y = 0.75;
        tapBody.add(pipe);

        // Horizontal spout
        const spoutGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1, 16);
        const spout = new THREE.Mesh(spoutGeometry, tapMaterial);
        spout.rotation.z = Math.PI / 2;
        spout.position.set(0.5, 0.2, 0);
        tapBody.add(spout);

        // Tap handle
        const handleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const handle = new THREE.Mesh(handleGeometry, tapMaterial);
        handle.position.set(0.3, 0.8, 0);
        tapBody.add(handle);

        tapBody.position.y = 7.5;
        scene.add(tapBody);
        tapRef.current = tapBody;

        // Create water droplet particles
        const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const particleMaterial = new THREE.MeshStandardMaterial({
            color: colors.primary,
            roughness: 0.1,
            metalness: 0.2,
        });

        for (let i = 0; i < 8; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
            particle.position.set(0, 7, 0);
            particle.visible = false;
            particle.userData = {
                velocity: 0,
                resetY: 7,
                active: false,
            };
            scene.add(particle);
            particlesRef.current.push(particle);
        }

        // Animation loop
        let targetWaterHeight = 0;
        let currentWaterHeight = 0;
        let isAnimating = false;
        let animationTime = 0;

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            if (isAnimating) {
                animationTime += 0.016; // ~60fps

                // Animate particles falling
                particlesRef.current.forEach((particle, i) => {
                    if (particle.userData.active) {
                        particle.visible = true;
                        particle.userData.velocity += 0.015; // Gravity
                        particle.position.y -= particle.userData.velocity;

                        // Reset when hitting water surface or bottom
                        if (particle.position.y <= currentWaterHeight + 0.5) {
                            particle.position.y = particle.userData.resetY + Math.random() * 0.5;
                            particle.userData.velocity = 0;
                        }
                    }
                });

                // Smooth water level interpolation
                if (currentWaterHeight < targetWaterHeight) {
                    currentWaterHeight += (targetWaterHeight - currentWaterHeight) * 0.03;

                    if (waterRef.current) {
                        waterRef.current.position.y = currentWaterHeight;
                    }
                } else {
                    // Animation complete
                    if (animationTime > 3) {
                        isAnimating = false;
                        particlesRef.current.forEach(p => {
                            p.visible = false;
                            p.userData.active = false;
                        });
                        if (tapRef.current) {
                            tapRef.current.rotation.z = 0;
                        }
                    }
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Trigger animation function
        window.triggerWaterFill = (newPercentage) => {
            if (!waterRef.current) return;

            // Calculate target height based on percentage
            // Bucket goes from y=0 (bottom) to y=6 (top)
            targetWaterHeight = (newPercentage / 100) * 6;

            // Start animation
            isAnimating = true;
            animationTime = 0;

            // Activate particles
            particlesRef.current.forEach((p, i) => {
                p.userData.active = true;
                p.position.y = 7 + Math.random() * 0.5;
                p.userData.velocity = 0;
            });

            // Rotate tap slightly (opening)
            if (tapRef.current) {
                tapRef.current.rotation.z = 0.2;
            }
        };

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            delete window.triggerWaterFill;
        };
    }, []);

    // Update water color when status changes
    useEffect(() => {
        if (waterRef.current && typeof window.THREE !== 'undefined') {
            const colors = getWaterColor(status);
            waterRef.current.material.color.setHex(colors.primary);

            // Update particle colors
            particlesRef.current.forEach(p => {
                p.material.color.setHex(colors.primary);
            });
        }
    }, [status]);

    // Trigger animation when percentage changes
    useEffect(() => {
        if (shouldAnimate && window.triggerWaterFill) {
            setTimeout(() => {
                window.triggerWaterFill(percentage);
            }, 300);
        } else if (waterRef.current) {
            // Set immediately without animation
            const targetHeight = (percentage / 100) * 6;
            waterRef.current.position.y = targetHeight;
        }
    }, [percentage, shouldAnimate]);

    return (
        <div
            ref={containerRef}
            className="w-full h-96 rounded-xl bg-gradient-to-b from-sky-50 to-white shadow-inner"
            style={{ minHeight: '400px' }}
        />
    );
}

export default WaterBucketScene;

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface PieceProps {
  type: 'X' | 'O';
  scale?: number;
}

const Piece: React.FC<PieceProps> = React.memo(({ type, scale = 1 }) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const xUrl = 'models/x.glb';
  const oUrl = 'models/o.glb';
  const url = type === 'X' ? xUrl : oUrl;

  useEffect(() => {
    let gltfLoader: GLTFLoader | null = new GLTFLoader();
    let isMounted = true;

    const loadModel = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!gltfLoader) {
          gltfLoader = new GLTFLoader();
        }
        const gltf = await gltfLoader.loadAsync(url);

        if (isMounted) {
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                color: type === 'X' ? '#61dafb' : '#98c379',
                roughness: 0.4,
                metalness: 0.7,
              });
            }
          });
          gltf.scene.scale.set(scale, scale, scale);
          setModel(gltf.scene);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
          console.error(`Failed to load model for ${type}:`, err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
      gltfLoader = null;
    };
  }, [type, scale, url]);

  if (isLoading) {
    return <mesh>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>;
  }

  if (error) {
    console.error("error is", error);
    return <mesh>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshBasicMaterial color="red" />
    </mesh>;
  }

  return model ? <primitive object={model} dispose={null} /> : null;
});

export default Piece;
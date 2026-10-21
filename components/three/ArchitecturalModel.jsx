'use client';

import { useEffect, useMemo } from 'react';
import ModelParts from './ModelParts';
import { getModelParts } from './models';
import { useMaterialSet } from './materials';
import { disposeSharedGeometries } from './modelBuilder';

// One model = a memoised part list + one shared material set (disposed on change/unmount).
export default function ArchitecturalModel({ model, material, lighting, wireframe = false, exploded = false }) {
  const parts = useMemo(() => getModelParts(model), [model]);
  const materials = useMaterialSet({ primary: material, lighting, wireframe });

  // Release the shared box/cylinder GPU buffers when the whole scene goes away.
  useEffect(() => () => disposeSharedGeometries(), []);

  return <ModelParts parts={parts} materials={materials} exploded={exploded} />;
}

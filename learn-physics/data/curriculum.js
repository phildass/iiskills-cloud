/**
 * Physics Curriculum Structure
 * 
 * Organized in 3 levels (Beginner, Intermediate, Advanced)
 * Each level has 7-10 modules
 * Each module has 5 lessons
 * Each module has a test
 */

export const physicsCurriculum = {
  levels: [
    {
      id: 'beginner',
      name: 'Beginner Level',
      description: 'Foundation concepts in physics',
      color: 'green',
      modules: [
        {
          id: 'm1-1',
          name: 'Introduction to Physics',
          description: 'Understanding the fundamentals of physics and scientific method',
          lessons: [
            { id: 'l1', title: 'What is Physics?', duration: '15 min' },
            { id: 'l2', title: 'Scientific Method and Measurement', duration: '20 min' },
            { id: 'l3', title: 'Units and Dimensions', duration: '20 min' },
            { id: 'l4', title: 'Significant Figures and Accuracy', duration: '15 min' },
            { id: 'l5', title: 'Vectors and Scalars', duration: '20 min' }
          ],
          testId: 't1-1'
        },
        {
          id: 'm1-2',
          name: 'Kinematics',
          description: 'Motion in one and two dimensions',
          lessons: [
            { id: 'l1', title: 'Position, Velocity, and Acceleration', duration: '20 min' },
            { id: 'l2', title: 'Motion with Constant Acceleration', duration: '25 min' },
            { id: 'l3', title: 'Free Fall and Gravity', duration: '20 min' },
            { id: 'l4', title: 'Projectile Motion', duration: '25 min' },
            { id: 'l5', title: 'Circular Motion', duration: '20 min' }
          ],
          testId: 't1-2'
        },
        {
          id: 'm1-3',
          name: 'Forces and Newton\'s Laws',
          description: 'Understanding forces and their effects',
          lessons: [
            { id: 'l1', title: 'Newton\'s First Law - Inertia', duration: '15 min' },
            { id: 'l2', title: 'Newton\'s Second Law - F=ma', duration: '20 min' },
            { id: 'l3', title: 'Newton\'s Third Law - Action-Reaction', duration: '20 min' },
            { id: 'l4', title: 'Friction and Normal Forces', duration: '20 min' },
            { id: 'l5', title: 'Applications of Newton\'s Laws', duration: '25 min' }
          ],
          testId: 't1-3'
        },
        {
          id: 'm1-4',
          name: 'Work and Energy',
          description: 'Energy conservation and transformations',
          lessons: [
            { id: 'l1', title: 'Work and Power', duration: '20 min' },
            { id: 'l2', title: 'Kinetic Energy', duration: '15 min' },
            { id: 'l3', title: 'Potential Energy', duration: '20 min' },
            { id: 'l4', title: 'Conservation of Energy', duration: '25 min' },
            { id: 'l5', title: 'Energy in Systems', duration: '20 min' }
          ],
          testId: 't1-4'
        },
        {
          id: 'm1-5',
          name: 'Momentum and Collisions',
          description: 'Understanding momentum and its conservation',
          lessons: [
            { id: 'l1', title: 'Linear Momentum', duration: '15 min' },
            { id: 'l2', title: 'Impulse and Momentum Change', duration: '20 min' },
            { id: 'l3', title: 'Conservation of Momentum', duration: '20 min' },
            { id: 'l4', title: 'Elastic Collisions', duration: '25 min' },
            { id: 'l5', title: 'Inelastic Collisions', duration: '20 min' }
          ],
          testId: 't1-5'
        },
        {
          id: 'm1-6',
          name: 'Rotational Motion',
          description: 'Rotation and angular motion',
          lessons: [
            { id: 'l1', title: 'Angular Position and Velocity', duration: '20 min' },
            { id: 'l2', title: 'Angular Acceleration', duration: '20 min' },
            { id: 'l3', title: 'Torque and Rotational Inertia', duration: '25 min' },
            { id: 'l4', title: 'Angular Momentum', duration: '20 min' },
            { id: 'l5', title: 'Rolling Motion', duration: '20 min' }
          ],
          testId: 't1-6'
        },
        {
          id: 'm1-7',
          name: 'Gravity and Orbits',
          description: 'Universal gravitation and planetary motion',
          lessons: [
            { id: 'l1', title: 'Newton\'s Law of Gravitation', duration: '20 min' },
            { id: 'l2', title: 'Gravitational Potential Energy', duration: '20 min' },
            { id: 'l3', title: 'Orbital Motion', duration: '25 min' },
            { id: 'l4', title: 'Kepler\'s Laws', duration: '20 min' },
            { id: 'l5', title: 'Satellites and Space Travel', duration: '20 min' }
          ],
          testId: 't1-7'
        }
      ]
    },
    {
      id: 'intermediate',
      name: 'Intermediate Level',
      description: 'Advanced mechanics and thermodynamics',
      color: 'blue',
      modules: [
        {
          id: 'm2-1',
          name: 'Oscillations and Waves',
          description: 'Simple harmonic motion and wave phenomena',
          lessons: [
            { id: 'l1', title: 'Simple Harmonic Motion', duration: '20 min' },
            { id: 'l2', title: 'Mass-Spring Systems', duration: '25 min' },
            { id: 'l3', title: 'Pendulums', duration: '20 min' },
            { id: 'l4', title: 'Wave Properties', duration: '20 min' },
            { id: 'l5', title: 'Standing Waves and Resonance', duration: '25 min' }
          ],
          testId: 't2-1'
        },
        {
          id: 'm2-2',
          name: 'Fluid Mechanics',
          description: 'Properties and behavior of fluids',
          lessons: [
            { id: 'l1', title: 'Density and Pressure', duration: '20 min' },
            { id: 'l2', title: 'Pascal\'s Principle', duration: '20 min' },
            { id: 'l3', title: 'Archimedes\' Principle and Buoyancy', duration: '25 min' },
            { id: 'l4', title: 'Fluid Flow and Continuity', duration: '20 min' },
            { id: 'l5', title: 'Bernoulli\'s Equation', duration: '25 min' }
          ],
          testId: 't2-2'
        },
        {
          id: 'm2-3',
          name: 'Thermodynamics I',
          description: 'Temperature, heat, and energy transfer',
          lessons: [
            { id: 'l1', title: 'Temperature and Thermal Equilibrium', duration: '15 min' },
            { id: 'l2', title: 'Heat and Specific Heat', duration: '20 min' },
            { id: 'l3', title: 'Phase Changes and Latent Heat', duration: '20 min' },
            { id: 'l4', title: 'Heat Transfer Mechanisms', duration: '25 min' },
            { id: 'l5', title: 'Thermal Expansion', duration: '20 min' }
          ],
          testId: 't2-3'
        },
        {
          id: 'm2-4',
          name: 'Thermodynamics II',
          description: 'Laws of thermodynamics and heat engines',
          lessons: [
            { id: 'l1', title: 'First Law of Thermodynamics', duration: '25 min' },
            { id: 'l2', title: 'Thermodynamic Processes', duration: '20 min' },
            { id: 'l3', title: 'Second Law of Thermodynamics', duration: '25 min' },
            { id: 'l4', title: 'Heat Engines and Efficiency', duration: '25 min' },
            { id: 'l5', title: 'Entropy', duration: '20 min' }
          ],
          testId: 't2-4'
        },
        {
          id: 'm2-5',
          name: 'Electric Fields and Forces',
          description: 'Introduction to electrostatics',
          lessons: [
            { id: 'l1', title: 'Electric Charge', duration: '15 min' },
            { id: 'l2', title: 'Coulomb\'s Law', duration: '20 min' },
            { id: 'l3', title: 'Electric Fields', duration: '25 min' },
            { id: 'l4', title: 'Electric Potential Energy', duration: '20 min' },
            { id: 'l5', title: 'Electric Potential', duration: '25 min' }
          ],
          testId: 't2-5'
        },
        {
          id: 'm2-6',
          name: 'Electric Circuits',
          description: 'Current, resistance, and circuit analysis',
          lessons: [
            { id: 'l1', title: 'Electric Current', duration: '15 min' },
            { id: 'l2', title: 'Resistance and Ohm\'s Law', duration: '20 min' },
            { id: 'l3', title: 'Series and Parallel Circuits', duration: '25 min' },
            { id: 'l4', title: 'Kirchhoff\'s Rules', duration: '25 min' },
            { id: 'l5', title: 'RC Circuits', duration: '20 min' }
          ],
          testId: 't2-6'
        },
        {
          id: 'm2-7',
          name: 'Magnetism',
          description: 'Magnetic fields and forces',
          lessons: [
            { id: 'l1', title: 'Magnetic Fields', duration: '20 min' },
            { id: 'l2', title: 'Magnetic Force on Moving Charges', duration: '25 min' },
            { id: 'l3', title: 'Magnetic Force on Current-Carrying Wires', duration: '20 min' },
            { id: 'l4', title: 'Sources of Magnetic Fields', duration: '25 min' },
            { id: 'l5', title: 'Ampere\'s Law', duration: '20 min' }
          ],
          testId: 't2-7'
        },
        {
          id: 'm2-8',
          name: 'Electromagnetic Induction',
          description: 'Faraday\'s law and applications',
          lessons: [
            { id: 'l1', title: 'Magnetic Flux', duration: '15 min' },
            { id: 'l2', title: 'Faraday\'s Law of Induction', duration: '25 min' },
            { id: 'l3', title: 'Lenz\'s Law', duration: '20 min' },
            { id: 'l4', title: 'Induced EMF and Electric Fields', duration: '25 min' },
            { id: 'l5', title: 'Generators and Transformers', duration: '20 min' }
          ],
          testId: 't2-8'
        }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced Level',
      description: 'Modern physics and quantum mechanics',
      color: 'purple',
      modules: [
        {
          id: 'm3-1',
          name: 'Electromagnetic Waves',
          description: 'Maxwell\'s equations and light',
          lessons: [
            { id: 'l1', title: 'Maxwell\'s Equations', duration: '25 min' },
            { id: 'l2', title: 'Electromagnetic Wave Propagation', duration: '25 min' },
            { id: 'l3', title: 'Energy in EM Waves', duration: '20 min' },
            { id: 'l4', title: 'The Electromagnetic Spectrum', duration: '20 min' },
            { id: 'l5', title: 'Polarization', duration: '20 min' }
          ],
          testId: 't3-1'
        },
        {
          id: 'm3-2',
          name: 'Geometric Optics',
          description: 'Light rays and optical instruments',
          lessons: [
            { id: 'l1', title: 'Reflection and Mirrors', duration: '20 min' },
            { id: 'l2', title: 'Refraction and Snell\'s Law', duration: '25 min' },
            { id: 'l3', title: 'Thin Lenses', duration: '25 min' },
            { id: 'l4', title: 'Lens Combinations', duration: '20 min' },
            { id: 'l5', title: 'Optical Instruments', duration: '20 min' }
          ],
          testId: 't3-2'
        },
        {
          id: 'm3-3',
          name: 'Wave Optics',
          description: 'Interference and diffraction',
          lessons: [
            { id: 'l1', title: 'Huygens\' Principle', duration: '20 min' },
            { id: 'l2', title: 'Young\'s Double-Slit Experiment', duration: '25 min' },
            { id: 'l3', title: 'Interference in Thin Films', duration: '20 min' },
            { id: 'l4', title: 'Single-Slit Diffraction', duration: '25 min' },
            { id: 'l5', title: 'Diffraction Gratings', duration: '20 min' }
          ],
          testId: 't3-3'
        },
        {
          id: 'm3-4',
          name: 'Special Relativity',
          description: 'Einstein\'s theory of relativity',
          lessons: [
            { id: 'l1', title: 'Postulates of Special Relativity', duration: '20 min' },
            { id: 'l2', title: 'Time Dilation', duration: '25 min' },
            { id: 'l3', title: 'Length Contraction', duration: '20 min' },
            { id: 'l4', title: 'Relativistic Momentum and Energy', duration: '25 min' },
            { id: 'l5', title: 'E = mc²', duration: '20 min' }
          ],
          testId: 't3-4'
        },
        {
          id: 'm3-5',
          name: 'Quantum Physics I',
          description: 'Introduction to quantum mechanics',
          lessons: [
            { id: 'l1', title: 'Blackbody Radiation and Planck\'s Constant', duration: '25 min' },
            { id: 'l2', title: 'Photoelectric Effect', duration: '20 min' },
            { id: 'l3', title: 'Compton Scattering', duration: '20 min' },
            { id: 'l4', title: 'Wave-Particle Duality', duration: '25 min' },
            { id: 'l5', title: 'De Broglie Wavelength', duration: '20 min' }
          ],
          testId: 't3-5'
        },
        {
          id: 'm3-6',
          name: 'Quantum Physics II',
          description: 'Atomic structure and quantum states',
          lessons: [
            { id: 'l1', title: 'Bohr Model of the Atom', duration: '25 min' },
            { id: 'l2', title: 'Quantum Numbers', duration: '20 min' },
            { id: 'l3', title: 'The Uncertainty Principle', duration: '25 min' },
            { id: 'l4', title: 'Schrödinger Equation', duration: '25 min' },
            { id: 'l5', title: 'Quantum Tunneling', duration: '20 min' }
          ],
          testId: 't3-6'
        },
        {
          id: 'm3-7',
          name: 'Nuclear Physics',
          description: 'Atomic nuclei and radioactivity',
          lessons: [
            { id: 'l1', title: 'Nuclear Structure', duration: '20 min' },
            { id: 'l2', title: 'Radioactive Decay', duration: '25 min' },
            { id: 'l3', title: 'Half-Life and Decay Rates', duration: '20 min' },
            { id: 'l4', title: 'Nuclear Fission', duration: '25 min' },
            { id: 'l5', title: 'Nuclear Fusion', duration: '20 min' }
          ],
          testId: 't3-7'
        },
        {
          id: 'm3-8',
          name: 'Particle Physics',
          description: 'Elementary particles and forces',
          lessons: [
            { id: 'l1', title: 'The Standard Model', duration: '25 min' },
            { id: 'l2', title: 'Quarks and Leptons', duration: '20 min' },
            { id: 'l3', title: 'Fundamental Forces', duration: '25 min' },
            { id: 'l4', title: 'Particle Interactions', duration: '20 min' },
            { id: 'l5', title: 'Beyond the Standard Model', duration: '25 min' }
          ],
          testId: 't3-8'
        },
        {
          id: 'm3-9',
          name: 'Astrophysics',
          description: 'Physics of stars and the universe',
          lessons: [
            { id: 'l1', title: 'Stellar Structure and Evolution', duration: '25 min' },
            { id: 'l2', title: 'The Hertzsprung-Russell Diagram', duration: '20 min' },
            { id: 'l3', title: 'Black Holes', duration: '25 min' },
            { id: 'l4', title: 'Cosmology and the Big Bang', duration: '25 min' },
            { id: 'l5', title: 'Dark Matter and Dark Energy', duration: '20 min' }
          ],
          testId: 't3-9'
        }
      ]
    }
  ]
}

/**
 * Helper function to get a specific level
 */
export function getLevel(levelId) {
  return physicsCurriculum.levels.find(level => level.id === levelId)
}

/**
 * Helper function to get a specific module
 */
export function getModule(moduleId) {
  for (const level of physicsCurriculum.levels) {
    const module = level.modules.find(m => m.id === moduleId)
    if (module) return module
  }
  return null
}

/**
 * Helper function to get all modules across all levels
 */
export function getAllModules() {
  return physicsCurriculum.levels.flatMap(level => level.modules)
}

/**
 * Calculate total progress for a user
 */
export function calculateProgress(completedLessons = [], completedTests = []) {
  const totalLessons = getAllModules().reduce((sum, module) => sum + module.lessons.length, 0)
  const totalTests = getAllModules().length
  
  const lessonProgress = (completedLessons.length / totalLessons) * 70 // Lessons are 70% of progress
  const testProgress = (completedTests.length / totalTests) * 30 // Tests are 30% of progress
  
  return Math.round(lessonProgress + testProgress)
}

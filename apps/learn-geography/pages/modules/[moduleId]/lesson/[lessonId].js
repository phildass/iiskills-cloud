"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import { getCurrentUser } from '../../../../lib/supabaseClient';
import { LessonContent } from '@iiskills/ui/content';

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId && lessonId) {
      fetchLesson();
    }
  }, [moduleId, lessonId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser && process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true') {
      router.push('/register');
      return;
    }
    setUser(currentUser);
  };

  const fetchLesson = async () => {
    try {
      setLesson({
        id: lessonId,
        module_id: moduleId,
        title: `Lesson ${lessonId}`,
        content: generateLessonContent(moduleId, lessonId),
        quiz: generateQuiz()
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLessonContent = (modId, lessId) => {
    return `
      <h2>Module ${modId}, Lesson ${lessId}: Foundations of Geography</h2>

      <h3>Introduction</h3>
      <p>Geography is the study of places and the relationships between people and their environments. It asks two fundamental questions: "Where?" and "Why there?" By answering these questions systematically, geography illuminates the spatial patterns that structure human life — why cities grow where they do, why some regions are wealthy and others impoverished, why climate varies across the globe, and how human activity is reshaping the very planetary systems on which all life depends.</p>
      <p>Geography bridges the natural and social sciences. Physical geography studies the Earth's natural systems — landforms, climate, soils, rivers, and ecosystems. Human geography studies the patterns of human activity — settlement, economy, culture, politics, and their spatial organisation. Environmental geography examines the dynamic interactions between human societies and natural systems, a domain of urgent importance as climate change, biodiversity loss, and resource depletion accelerate.</p>
      <p>This lesson introduces five foundational domains: physical geography and landform processes; climate systems; human settlement and urbanisation; geopolitics and territorial organisation; and environmental challenges. Mastering these foundations equips you to understand and analyse any geographical question — from local land use conflicts to global climate negotiations.</p>

      <h3>Key Concepts</h3>
      <h4>1. Physical Geography: Landforms and Earth Processes</h4>
      <p>Earth's surface is shaped by the dynamic interplay of internal forces (tectonic, volcanic, and seismic) and external forces (weathering, erosion, and deposition by water, wind, and ice). Plate tectonics — the scientific framework explaining the movement of lithospheric plates — accounts for the distribution of continents, ocean basins, mountain ranges, volcanoes, and earthquakes. The collision of the Indian and Eurasian plates produced the Himalayas; the divergence of plates along mid-ocean ridges continuously creates new seafloor.</p>
      <p>Fluvial processes (related to rivers) shape much of Earth's inhabited land. Rivers erode rock and soil upstream, transport sediment, and deposit it in floodplains and deltas downstream. The Nile Delta, the Mississippi-Missouri system, and the Gangetic Plain are among the world's most densely populated regions precisely because millennia of sediment deposition created some of the most fertile agricultural land on Earth. Understanding river systems is essential for flood management, irrigation planning, and environmental conservation.</p>

      <h4>2. Climate Systems: Patterns and Drivers</h4>
      <p>Climate is the long-term pattern of weather in a region, determined by latitude (angle of sun's rays), altitude, proximity to oceans, ocean currents, topography, and prevailing wind patterns. The Köppen Climate Classification system divides the world into five major climate zones (tropical, dry, temperate, continental, and polar) and multiple subtypes, providing a framework for comparing agricultural potential, biodiversity, and human adaptation strategies across regions.</p>
      <p>The global circulation of the atmosphere — driven by differential solar heating between equator and poles — creates the major wind belts (Trade Winds, Westerlies, Polar Easterlies) and the Intertropical Convergence Zone (ITCZ), where rising warm air produces the world's highest rainfall. Ocean currents redistribute heat globally: the Gulf Stream moderates Western Europe's climate, making it far warmer than comparable latitudes in North America. El Niño and La Niña (ENSO cycles) disrupt normal Pacific circulation patterns, causing droughts, floods, and crop failures across multiple continents simultaneously.</p>

      <h4>3. Human Settlement and Urbanisation</h4>
      <p>More than 56% of the world's population now lives in cities, and the proportion is projected to reach 68% by 2050. The patterns of human settlement reflect both physical constraints (river access, defensible terrain, fertile land) and economic forces (trade routes, industrial agglomeration, transport infrastructure). World cities — metropolises like Tokyo, New York, London, and Shanghai — function as nodes in a global network, concentrating financial capital, corporate headquarters, cultural institutions, and international governance.</p>
      <p>Urbanisation brings both opportunities (higher productivity, better services, cultural innovation) and challenges (housing affordability, traffic congestion, pollution, social inequality, and the urban heat island effect). Understanding urban geography is essential for sustainable city planning, public health policy, and infrastructure investment. Informal settlements (slums, favelas, bustees) house an estimated one billion people globally — a fact that demands both compassionate policy and rigorous geographical analysis.</p>

      <h4>4. Geopolitics and Territorial Organisation</h4>
      <p>The world is politically organised into approximately 195 sovereign states, each exercising authority over a defined territory. This political geography reflects centuries of conquest, colonialism, independence movements, and international negotiation. Many of today's conflicts trace directly to colonial-era border drawing that ignored ethnic, linguistic, and tribal realities — artificial boundaries in Africa and the Middle East are the legacy of European powers carving territories for administrative convenience, not for the welfare of those who lived there.</p>
      <p>Geopolitics studies how geography shapes power and how power shapes geography. Control of strategic chokepoints (the Strait of Hormuz, the South China Sea, the Suez Canal) influences global trade and military posture. Resource geography — the spatial distribution of oil, gas, water, rare earth minerals, and arable land — drives foreign policy and international conflict. Understanding these spatial power dynamics is indispensable for international relations, business strategy, and risk analysis.</p>

      <h4>5. Environmental Geography: Human-Environment Interactions</h4>
      <p>Human geography and physical geography converge in environmental geography, which studies how societies transform natural systems and how those transformed systems feed back to affect human welfare. Deforestation in the Amazon alters regional hydrology and global carbon cycles. Groundwater extraction in the Central Valley of California and the North China Plain is depleting aquifers that took millennia to fill — a slow-motion environmental crisis with major food security implications. Urban sprawl converts farmland and wetlands into impermeable surfaces, increasing flood risk and reducing biodiversity.</p>
      <p>Climate change is the defining environmental geography challenge of our era. Rising greenhouse gas concentrations (CO₂, methane, nitrous oxide) are warming the planet, shifting precipitation patterns, accelerating sea level rise, and increasing the frequency and intensity of extreme weather events. The geographic dimensions of climate change are profoundly unequal: low-lying coastal nations and sub-Saharan Africa face the most severe impacts despite contributing least to the problem — a fundamental question of global environmental justice.</p>

      <h3>Practical Applications</h3>
      <p><strong>Urban and Regional Planning:</strong> Geographers contribute to decisions about where to build transport infrastructure, how to zone land use, and how to design cities for resilience against flooding, heat waves, and population growth. GIS (Geographic Information Systems) — software that captures, analyses, and visualises spatial data — is now central to planning, from routing ambulances to identifying food deserts.</p>
      <p><strong>Climate Adaptation Policy:</strong> Governments and international organisations use geographical analysis to identify climate-vulnerable populations, plan managed retreats from flood-prone or drought-affected areas, and design adaptation strategies. Understanding the physical geography of coasts, rivers, and agricultural zones is essential for credible climate policy.</p>
      <p><strong>International Business and Supply Chain:</strong> Companies use geographical analysis to select manufacturing locations (labour costs, infrastructure, regulatory environment, proximity to markets), assess geopolitical risks (conflict zones, trade disputes, sanctions), and optimise global supply chains. The 2021 Suez Canal blockage by a single container ship demonstrated how geographic chokepoints can disrupt global trade within hours.</p>
      <p><strong>Conservation and Biodiversity:</strong> Biogeography — the geographical distribution of species — guides conservation planning. Identifying biodiversity hotspots (regions with exceptional concentrations of endemic species under severe threat) allows conservation organisations to prioritise limited resources. Understanding habitat fragmentation, wildlife corridors, and the impacts of land use change requires both ecological and geographical knowledge.</p>

      <h3>Summary</h3>
      <p>Geography provides an indispensable lens for understanding the world in its full complexity — physical, human, and environmental. In this lesson you have covered: landform processes shaped by tectonic and erosional forces; global climate systems and their drivers; patterns of human settlement and urbanisation; geopolitical organisation and its historical roots; and the interactions between human societies and natural environments.</p>
      <p>Geographical literacy is a civic and professional essential. Whether you are analysing supply chain risks, understanding a geopolitical crisis, planning a resilient city, or designing a conservation strategy, the spatial thinking and systems perspective that geography provides will give you a decisive analytical advantage. As you progress through this course, you will develop these capabilities through detailed study of specific regions, environmental systems, and human geographical processes — building towards a genuinely global perspective.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is the largest continent by area?",
        options: [
          "Africa",
          "North America",
          "Asia",
          "Europe"
        ],
        correct_answer: 2
      },
      {
        question: "What is the difference between weather and climate?",
        options: [
          "They are the same thing",
          "Weather refers to short-term atmospheric conditions; climate refers to long-term patterns",
          "Climate is measured daily; weather is measured annually",
          "Weather only occurs in cold regions"
        ],
        correct_answer: 1
      },
      {
        question: "What is a tectonic plate?",
        options: [
          "A type of rock formation",
          "A large segment of Earth's lithosphere that moves over geological time",
          "A mountain range",
          "An ocean current pattern"
        ],
        correct_answer: 1
      },
      {
        question: "What is the equator?",
        options: [
          "The line separating the northern and southern hemispheres at 0° latitude",
          "The line at 45° north latitude",
          "The boundary between continents",
          "The prime meridian"
        ],
        correct_answer: 0
      },
      {
        question: "What is urbanization?",
        options: [
          "The process of converting farmland to forest",
          "The movement of populations from rural to urban areas",
          "Building highways between cities",
          "The study of city architecture"
        ],
        correct_answer: 1
      }
    ];
  };

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    
    if (passed) {
      try {
        await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: lessonId,
            module_id: moduleId,
            score: score
          })
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    if (nextLessonId <= 10) {
      router.push(`/modules/${moduleId}/lesson/${nextLessonId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 10) {
        router.push(`/modules/${moduleId}/final-test`);
      } else {
        router.push('/curriculum');
      }
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{lesson?.title} - Learn Geography</title>
        <meta name="description" content={`Learn Geography - Module ${moduleId}, Lesson ${lessonId}`} />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.push('/curriculum')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Curriculum
            </button>
          </div>

          <div className="card mb-8">
            <div className="mb-6">
              <span className="text-sm text-gray-500">Module {moduleId}</span>
              <h1 className="text-3xl font-bold mt-2">{lesson?.title}</h1>
            </div>

            <LessonContent html={lesson?.content} />
          </div>

          {lesson?.quiz && (
            <QuizComponent 
              questions={lesson.quiz}
              onComplete={handleQuizComplete}
            />
          )}

          {quizCompleted && (
            <div className="card bg-green-50 border-2 border-green-500">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Quiz Passed!
              </h3>
              <p className="text-gray-700 mb-4">
                Congratulations! You've successfully completed this lesson.
              </p>
              <button
                onClick={goToNextLesson}
                className="btn-primary"
              >
                Continue to Next Lesson
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

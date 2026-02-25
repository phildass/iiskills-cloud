"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import QuizComponent from '../../../../components/QuizComponent';
import { getCurrentUser } from '../../../../lib/supabaseClient';
import { LessonContent } from '@iiskills/ui/content';
import { getLessonMedia } from '../../../../data/geographyMedia';

/**
 * Renders a lesson media image inline within the lesson body.
 */
function InlineMediaFigure({ photo }) {
  if (!photo) return null;
  return (
    <figure
      style={{
        margin: '1.75rem 0',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #c8e6c9',
        background: '#f1f8f1',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={photo.alt}
        loading="lazy"
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px 10px 0 0' }}
      />
      {photo.caption && (
        <figcaption
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.8125rem',
            color: '#4a6741',
            fontStyle: 'italic',
          }}
        >
          📷 {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Splits lesson HTML at major section boundaries (<h3>) and inserts
 * lesson-specific images between sections so they appear inline within
 * the body copy rather than as a top panel.
 */
function LessonContentWithInlineMedia({ html, moduleId, lessonId }) {
  if (!html) return null;

  const media = getLessonMedia(moduleId, lessonId);
  const photos = media?.photos || [];

  // Split at <h3> section headings to get major content blocks
  const parts = html.split(/(?=<h3)/);

  // Map image: part[0] = intro → image 0 after it
  //            part[1] = first h3 → image 1 after it
  //            part[2] = second h3 → image 2 after it
  return (
    <>
      {parts.map((part, i) => (
        <div key={i}>
          <LessonContent html={part} />
          {photos[i] && <InlineMediaFigure photo={photos[i]} />}
        </div>
      ))}
      {/* Map image (always shown) */}
      {media?.mapUrl && (
        <figure
          style={{
            margin: '1.75rem 0',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '1px solid #c8e6c9',
            background: '#f1f8f1',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.mapUrl}
            alt={media.mapAlt}
            loading="lazy"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px 10px 0 0' }}
          />
          <figcaption
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.8125rem',
              color: '#4a6741',
              fontStyle: 'italic',
            }}
          >
            🗺️ {media.mapAlt}
          </figcaption>
        </figure>
      )}
    </>
  );
}

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
      // Reset quiz completion whenever the lesson changes (prevents SPA state bleed
      // when Next.js reuses the same page component without full unmount)
      setQuizCompleted(false);
      fetchLesson();
    }
  }, [moduleId, lessonId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const fetchLesson = async () => {
    try {
      setLesson({
        id: lessonId,
        module_id: moduleId,
        title: `Lesson ${lessonId}`,
        content: generateLessonContent(moduleId, lessonId),
        quiz: generateQuiz(moduleId, lessonId)
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

  const generateQuiz = (modId, lessId) => {
    // Quiz banks keyed by `${modId}_${lessId}`. Ensures every lesson has distinct questions.
    const quizBanks = {
      '1_1': [
        {
          question: "What are the two fundamental questions that geography asks?",
          options: [
            "'When?' and 'How?'",
            "'Where?' and 'Why there?'",
            "'Who?' and 'What?'",
            "'How many?' and 'How far?'"
          ],
          correct_answer: 1
        },
        {
          question: "Which of the following best describes physical geography?",
          options: [
            "The study of human settlement patterns",
            "The study of economic trade routes",
            "The study of Earth's natural systems such as landforms, climate, and ecosystems",
            "The study of political boundaries"
          ],
          correct_answer: 2
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
          question: "What is GIS?",
          options: [
            "A type of rock formation",
            "A global trade agreement",
            "Geographic Information Systems — software for capturing and analysing spatial data",
            "A method of measuring rainfall"
          ],
          correct_answer: 2
        }
      ],
      '1_2': [
        {
          question: "What process is responsible for the formation of the Himalayas?",
          options: [
            "Erosion by glaciers",
            "Collision of the Indian and Eurasian tectonic plates",
            "Volcanic eruption along a rift zone",
            "Deposition of river sediment"
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
          question: "What are fluvial processes related to?",
          options: [
            "Volcanic activity",
            "Wind erosion",
            "Rivers and water flow",
            "Glacier movement"
          ],
          correct_answer: 2
        },
        {
          question: "Why are river deltas among the world's most densely populated regions?",
          options: [
            "They have abundant mineral resources",
            "They have cool climates suitable for farming",
            "Sediment deposition creates highly fertile agricultural land",
            "They are far from earthquake zones"
          ],
          correct_answer: 2
        },
        {
          question: "What external forces shape Earth's surface?",
          options: [
            "Only tectonic forces",
            "Only volcanic forces",
            "Weathering, erosion and deposition by water, wind, and ice",
            "Gravitational pull of the moon"
          ],
          correct_answer: 2
        }
      ],
      '1_3': [
        {
          question: "What does the Köppen Climate Classification system divide the world into?",
          options: [
            "3 climate zones",
            "5 major climate zones with multiple subtypes",
            "7 continental zones",
            "10 temperature bands"
          ],
          correct_answer: 1
        },
        {
          question: "What is the Intertropical Convergence Zone (ITCZ)?",
          options: [
            "A cold ocean current near the poles",
            "A high-pressure belt in temperate regions",
            "A zone near the equator where rising warm air produces the world's highest rainfall",
            "The boundary between the Atlantic and Pacific Oceans"
          ],
          correct_answer: 2
        },
        {
          question: "How does the Gulf Stream affect Western Europe's climate?",
          options: [
            "It makes Western Europe drier than comparable latitudes",
            "It moderates the climate, making it warmer than comparable latitudes in North America",
            "It causes frequent hurricanes along the European coast",
            "It has no significant effect"
          ],
          correct_answer: 1
        },
        {
          question: "What is ENSO?",
          options: [
            "A type of soil found in tropical regions",
            "El Niño-Southern Oscillation — Pacific circulation patterns that cause global weather disruption",
            "A mountain weather measurement system",
            "An international climate agreement"
          ],
          correct_answer: 1
        },
        {
          question: "What primarily drives global atmospheric circulation?",
          options: [
            "Earth's magnetic field",
            "Differential solar heating between the equator and the poles",
            "Ocean tides",
            "Volcanic activity"
          ],
          correct_answer: 1
        }
      ],
      '1_4': [
        {
          question: "What percentage of the world's population currently lives in cities?",
          options: [
            "More than 30%",
            "More than 56%",
            "More than 75%",
            "More than 90%"
          ],
          correct_answer: 1
        },
        {
          question: "What is urbanisation?",
          options: [
            "The process of converting farmland to forest",
            "The movement of populations from rural to urban areas",
            "Building highways between cities",
            "The study of city architecture"
          ],
          correct_answer: 1
        },
        {
          question: "How many people globally are estimated to live in informal settlements?",
          options: [
            "About 100 million",
            "About 500 million",
            "About one billion",
            "About 2 billion"
          ],
          correct_answer: 2
        },
        {
          question: "What is the urban heat island effect?",
          options: [
            "Increased rainfall in coastal cities",
            "Urban areas being significantly warmer than surrounding rural areas due to human activities",
            "The cooling effect of parks in cities",
            "Heat generated by underground transport systems"
          ],
          correct_answer: 1
        },
        {
          question: "What is the projected share of the global population living in cities by 2050?",
          options: [
            "About 50%",
            "About 60%",
            "About 68%",
            "About 85%"
          ],
          correct_answer: 2
        }
      ],
    };

    const key = `${modId}_${lessId}`;
    if (quizBanks[key]) return quizBanks[key];

    // Fallback for lessons without a dedicated bank — rotate questions by lessonId
    const fallback = [
      {
        question: "What is the largest continent by area?",
        options: ["Africa", "North America", "Asia", "Europe"],
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
    // Rotate the fallback set slightly per lesson so repeated visits feel different
    const offset = (parseInt(lessId, 10) - 1) % fallback.length;
    return [...fallback.slice(offset), ...fallback.slice(0, offset)];
  };

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    
    if (passed) {
      try {
        await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            app_id: 'learn-geography',
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
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

            {/* Render lesson body with images interspersed between sections */}
            <LessonContentWithInlineMedia
              html={lesson?.content}
              moduleId={moduleId}
              lessonId={lessonId}
            />
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
    </>
  );
}

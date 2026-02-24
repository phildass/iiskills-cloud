import { useState } from 'react';
import Head from 'next/head';

/**
 * Admin Test Newsletter Generator
 * 
 * Test newsletter generation with sample course data
 */

export default function TestNewsletterGenerator() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleCourse = {
    title: "Master Python for Data Science",
    short_description: "Learn Python programming, data analysis, and machine learning in this comprehensive course",
    highlights: [
      "Python fundamentals and advanced concepts",
      "Data manipulation with Pandas and NumPy",
      "Data visualization with Matplotlib",
      "Machine learning basics with Scikit-learn",
      "Real-world projects and case studies"
    ],
    duration: "8 weeks",
    category: "Data Science",
    target_audience: "Beginners to intermediate learners",
    topics_skills: [
      "Python Programming",
      "Data Analysis",
      "Machine Learning",
      "Data Visualization",
      "Statistics"
    ]
  };

  async function testGeneration() {
    setGenerating(true);
    setResult(null);
    setError(null);

    try {
      // Import the generator dynamically
      const { generateNewsletterContent, generateEmailHTML } = await import('../../lib/ai-newsletter-generator');
      
      // Generate content
      const content = await generateNewsletterContent(sampleCourse, 99);
      
      // Generate HTML
      const html = generateEmailHTML(content, sampleCourse);
      
      setResult({
        content,
        html
      });
      
    } catch (err) {
      setError(err.message);
    }
    
    setGenerating(false);
  }

  return (
    <>
      <Head>
        <title>Test Newsletter Generator - Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              🧪 Test Newsletter Generator
            </h1>
            <p className="text-gray-600 mb-6">
              Test the AI newsletter generation with sample course data
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Sample Course:</h3>
              <p className="text-sm text-gray-700">
                <strong>Title:</strong> {sampleCourse.title}<br />
                <strong>Category:</strong> {sampleCourse.category}<br />
                <strong>Duration:</strong> {sampleCourse.duration}<br />
                <strong>Highlights:</strong> {sampleCourse.highlights.length} items
              </p>
            </div>

            <button
              onClick={testGeneration}
              disabled={generating}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? '⏳ Generating...' : '🚀 Generate Newsletter'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-red-800 font-bold mb-2">❌ Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <>
              {/* Content Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Generated Content
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Title:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {result.content.title}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Subject Line:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {result.content.subject_line}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Intro:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {result.content.intro_text}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Course Summary:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {result.content.course_summary}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Highlights:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border whitespace-pre-line">
                      {result.content.highlights_section}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Fun Fact:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {result.content.fun_fact}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      CTA:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border">
                      {result.content.cta_text}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Emoji Block:
                    </label>
                    <div className="bg-gray-50 p-3 rounded border text-3xl">
                      {result.content.emoji_block}
                    </div>
                  </div>

                  {result.content.ai_metadata && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        AI Metadata:
                      </label>
                      <div className="bg-gray-50 p-3 rounded border text-xs font-mono">
                        <pre>{JSON.stringify(result.content.ai_metadata, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* HTML Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  HTML Email Preview
                </h2>
                
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={result.html}
                    className="w-full h-[600px] border-0"
                    title="Email Preview"
                  />
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      const blob = new Blob([result.html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'newsletter.html';
                      a.click();
                    }}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    📥 Download HTML
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

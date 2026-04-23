import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const blogs = {
    1: {
      title: 'The Science Behind Personalized Nutrition',
      content: `
        <p>Personalized nutrition represents a revolutionary approach to health and wellness, moving beyond the one-size-fits-all dietary recommendations that have dominated the field for decades. This emerging science recognizes that each individual's genetic makeup, lifestyle, and health status create unique nutritional needs.</p>
        <h3>Understanding Your Genetic Blueprint</h3>
        <p>Your DNA contains valuable information about how your body processes different nutrients. For example, variations in the MTHFR gene can affect how efficiently you convert folate into its active form, potentially requiring higher doses of this essential B vitamin. Similarly, genetic variants in the VDR gene influence how well your body utilizes vitamin D.</p>
        <h3>The Role of Lifestyle Factors</h3>
        <p>Beyond genetics, your daily habits significantly impact your nutritional requirements. Athletes may need higher levels of protein and certain minerals, while individuals with high stress levels might benefit from increased B-complex vitamins and adaptogens. Sleep patterns, exercise routines, and even geographic location all play crucial roles in determining optimal nutrient intake.</p>
        <h3>Biomarker Testing and Analysis</h3>
        <p>Advanced biomarker testing allows us to identify specific deficiencies and imbalances in real-time. By analyzing blood levels of key nutrients, inflammatory markers, and metabolic indicators, we can create a precise supplementation strategy tailored to your body's current needs.</p>
        <h3>The Future of Nutrition</h3>
        <p>As technology continues to advance, we're moving toward even more sophisticated approaches to personalized nutrition, including microbiome analysis and continuous health monitoring. This data-driven approach ensures that your nutritional strategy evolves with your changing health needs.</p>
      `,
      date: 'March 15, 2024',
      author: 'Dr. Sarah Johnson',
      readTime: '8 min read',
      image: '/placeholder.svg'
    },
    2: {
      title: '5 Signs You Might Need Vitamin D',
      content: `
        <p>Vitamin D deficiency is surprisingly common, affecting nearly 1 billion people worldwide. Often called the sunshine vitamin, vitamin D plays crucial roles in bone health, immune function, and overall well-being. Here are five key signs that you might not be getting enough.</p>
        <h3>1. Frequent Illness or Infections</h3>
        <p>One of vitamin D's most important roles is supporting immune system function. If you find yourself getting sick more often than usual, or taking longer to recover from illnesses, it could be a sign of vitamin D deficiency. Studies have shown that adequate vitamin D levels help reduce the risk of respiratory infections.</p>
        <h3>2. Fatigue and Tiredness</h3>
        <p>Feeling tired can have many causes, but vitamin D deficiency is often overlooked. Research has found strong correlations between low vitamin D levels and fatigue. In one study, women with vitamin D levels below 20 ng/ml were more likely to report fatigue as a symptom.</p>
        <h3>3. Bone and Back Pain</h3>
        <p>Vitamin D helps maintain bone health by improving calcium absorption. Low levels can lead to bone pain and lower back pain. If you're experiencing unexplained aches and pains, especially in your bones and joints, vitamin D deficiency could be a contributing factor.</p>
        <h3>4. Depression or Mood Changes</h3>
        <p>Several studies have linked vitamin D deficiency to depression and mood disorders. The vitamin appears to play a role in regulating mood and supporting brain health. Seasonal Affective Disorder (SAD) is particularly associated with low vitamin D levels during winter months.</p>
        <h3>5. Impaired Wound Healing</h3>
        <p>Slow wound healing after surgery or injury may be a sign that your vitamin D levels are too low. Vitamin D plays a role in controlling inflammation and fighting infection, both crucial for proper wound healing.</p>
        <h3>Getting Tested and Taking Action</h3>
        <p>If you recognize these signs, consider getting your vitamin D levels tested. The optimal range is generally considered to be 30-50 ng/ml (75-125 nmol/L). Depending on your levels, your healthcare provider may recommend supplements, increased sun exposure, or dietary changes.</p>
      `,
      date: 'March 10, 2024',
      author: 'Dr. Michael Chen',
      readTime: '6 min read',
      image: '/placeholder.svg'
    },
    3: {
      title: 'Optimizing Recovery with Magnesium',
      content: `
        <p>Magnesium is often called the master mineral for good reason. This essential nutrient is involved in over 300 enzymatic reactions in the body, making it crucial for everything from energy production to muscle function. For active individuals, adequate magnesium intake is particularly important for optimal recovery.</p>
        <h3>Magnesium's Role in Muscle Function</h3>
        <p>Magnesium plays a critical role in muscle contraction and relaxation. During exercise, magnesium helps regulate calcium flow in and out of muscle cells, which is essential for proper muscle function. Without adequate magnesium, muscles may cramp, feel tense, or recover more slowly from workouts.</p>
        <h3>Energy Production and ATP Synthesis</h3>
        <p>Every cell in your body requires energy in the form of ATP (adenosine triphosphate). Magnesium is essential for ATP synthesis, meaning that without sufficient levels, your cells can't produce energy efficiently. This can lead to fatigue, poor workout performance, and delayed recovery.</p>
        <h3>Sleep Quality and Recovery</h3>
        <p>Quality sleep is when most muscle recovery occurs, and magnesium plays a vital role in sleep regulation. It helps activate the parasympathetic nervous system, which is responsible for helping you feel calm and relaxed. Magnesium also regulates melatonin, the hormone that guides your sleep-wake cycles.</p>
        <h3>Reducing Inflammation</h3>
        <p>Intense exercise naturally creates inflammation in the body as part of the adaptation process. While some inflammation is beneficial, excessive inflammation can impair recovery. Magnesium has anti-inflammatory properties that can help keep post-exercise inflammation in check.</p>
        <h3>Types of Magnesium Supplements</h3>
        <p>Not all magnesium supplements are created equal. Magnesium glycinate is often preferred for its high bioavailability and gentle effect on the digestive system. Magnesium citrate is another well-absorbed form, though it may have a mild laxative effect. For topical application, magnesium chloride (Epsom salts) can be used in baths for muscle relaxation.</p>
        <h3>Optimizing Your Magnesium Intake</h3>
        <p>The recommended daily allowance for magnesium is 400-420mg for men and 310-320mg for women, but active individuals may need more. Dark leafy greens, nuts, seeds, and whole grains are excellent food sources. However, due to soil depletion and processing, many people benefit from supplementation to meet their optimal levels.</p>
      `,
      date: 'March 5, 2024',
      author: 'Dr. Emma Davis',
      readTime: '7 min read',
      image: '/placeholder.svg'
    }
  };

  const blog = blogs[Number(id) as keyof typeof blogs];

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-28">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-emerald-600 hover:text-emerald-700">
            Back to article list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to article list
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 sm:h-80 object-cover"
          />

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{blog.readTime}</span>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{ lineHeight: '1.8' }}
            />

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <Link
                  to="/blog"
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to article list
                </Link>

                <div className="text-sm text-gray-500">
                  Published on {blog.date}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPage;

import { CheckCircle } from 'lucide-react';
import aboutBanner from '@/images/about-banner.png';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      {/* Hero Section */}
      <section className="relative min-h-[520px] overflow-hidden px-4 py-24 text-white sm:px-6 lg:px-8">
        <img
          src={aboutBanner}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-slate-950/25"></div>
        <div className="relative mx-auto flex min-h-[360px] max-w-6xl items-center">
          <div className="max-w-3xl animate-fade-in">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
              About HLS
            </p>
            <h1 className="mb-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Personalized healthcare for all
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">
              Pioneering the future of personalized health through cutting-edge science, 
              innovative technology, and deep understanding of African health needs.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                <span>Science-Backed Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                <span>50,000+ Lives Transformed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                <span>Pan-African Reach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Our Story</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Built to make nutrient-based care easier to trust</h2>
          </div>
          <div className="mx-auto mb-14 max-w-4xl">
            <p className="text-base leading-8 text-slate-700 sm:text-lg">
              Founded in 2021 by a team of healthcare professionals and entrepreneurs, HLS began its 
              journey to revolutionize nutrient-based healthcare in Nigeria. We've grown from a small
               startup to a leading provider of personalized health solutions, serving thousands of clients
                and partnering with numerous healthcare professionals. Today, we're committed to reshaping Nigerians' 
                perceptions of healthcare by highlighting the benefits of nutrient-based approaches that work as supplements
                 in harmony with daily diets, not just treating diseases. Our goal is to empower every individual to find their 
                 right supplement, regardless of budget or brand preferences, by providing research-driven alternatives that enhance
                  health and lifestyle. To achieve this, we've curated a comprehensive market store featuring authentic, traceable,
                   and available supplements in Nigeria, ensuring that everyone can access the nutrients they need to thrive.
            </p>
          </div>
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-xl font-semibold text-slate-950">Our Vision</h3>
                <p className="text-base leading-7 text-slate-700">
                Empower 1 million Nigerians to embrace affordable, nutrient-based 
                healthcare by 2027, while establishing a leading earning platform 
                for healthcare professionals.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold text-slate-950">Our Mission</h3>
                <p className="text-base leading-7 text-slate-700">
                Unlocking the hidden power of nutrient-based healthcare for Nigerians,
                 by shedding light on the lesser-known benefits of age defiance, brain
                  health for economic productivity and creativity, quick recovery, and 
                  longevity, in addition to the commonly known benefits of vitality and 
                  immunity, through education, research, and personalized solutions.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold text-slate-950">Objectives</h3>
                <ol className="list-decimal list-inside space-y-2 text-base leading-7 text-slate-700">
                  <li>Promoting the benefits of good healthcare beyond disease prevention.</li>
                  <li>Arousing curiosity about nutrient types.</li>
                  <li>Educating through entertaining strategies.</li>
                  <li>Conducting free evidence-based research.</li>
                  <li>Suggesting affordable nutrient supplements.</li>
                  <li>Providing authentic nutrient information.</li>
                  <li>Encouraging healthcare professionals.</li>
                </ol>
              </div>
            </div>
            <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="mb-5 text-xl font-semibold text-slate-950">Six Pillars of HLS</h3>
              <ul className="space-y-4 text-base leading-7 text-slate-700">
                <li><span className="font-semibold text-slate-950">Advancement:</span> We prioritize preventive healthcare, innovating solutions that promote optimal wellness.</li>
                <li><span className="font-semibold text-slate-950">Accessibility:</span> We make nutrient-based healthcare accessible to everyone, regardless of background or budget.</li>
                <li><span className="font-semibold text-slate-950">Availability:</span> We ensure our services and products are readily available to support individuals' health journeys.</li>
                <li><span className="font-semibold text-slate-950">Authenticity:</span> We stand behind the authenticity and quality of our recommended supplements, guaranteeing traceability.</li>
                <li><span className="font-semibold text-slate-950">Accountability:</span> We take responsibility for our clients' progress, tracking outcomes and incorporating feedback for continuous improvement.</li>
                <li><span className="font-semibold text-slate-950">Affordability:</span> We strive to make high-quality healthcare solutions affordable for all, without compromising on effectiveness.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-5 text-3xl font-semibold tracking-tight sm:text-4xl">Ready to Transform Your Health?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Join thousands of others who have already started their personalized health journey with HLS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="rounded-md bg-emerald-600 px-8 py-4 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700">
              Start Your Assessment
            </button>
            <button className="rounded-md border border-white/70 px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-slate-950">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

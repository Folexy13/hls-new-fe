
import React from 'react';
import { CheckCircle, Users, Award, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: CheckCircle,
      title: "Science-Based",
      description: "All our recommendations are backed by peer-reviewed research and clinical studies."
    },
    {
      icon: Users,
      title: "Personalized",
      description: "Every recommendation is tailored to your unique lifestyle, goals, and health needs."
    },
    {
      icon: Award,
      title: "Quality First",
      description: "We partner only with premium manufacturers who meet our strict quality standards."
    },
    {
      icon: TrendingUp,
      title: "Results Driven",
      description: "Our platform helps you track progress and optimize your health journey over time."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Scientific Officer",
      bio: "PhD in Nutritional Biochemistry with 15+ years in personalized medicine research.",
      image: "/placeholder.svg"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      bio: "Former tech executive passionate about making health technology accessible to everyone.",
      image: "/placeholder.svg"
    },
    {
      name: "Dr. Jennifer Chen",
      role: "Clinical Nutritionist",
      bio: "Registered Dietitian specializing in sports nutrition and metabolic health optimization.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-emerald-600">HLS</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to revolutionize personalized health through science-backed 
            nutrition and supplement recommendations.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="mb-6">
                HLS was founded on the belief that health is not one-size-fits-all. After seeing countless 
                people struggle with generic health advice that didn't work for their unique circumstances, 
                our team of scientists, nutritionists, and health experts came together to create a better solution.
              </p>
              <p className="mb-6">
                Using cutting-edge research in nutrigenomics, metabolomics, and personalized medicine, 
                we developed a comprehensive assessment system that takes into account your genetics, 
                lifestyle, goals, and health history to provide truly personalized recommendations.
              </p>
              <p>
                Today, we're proud to serve over 50,000 customers worldwide, helping them optimize 
                their health with precision and confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <value.icon className="h-12 w-12 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Experts dedicated to your health journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-emerald-600 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl mb-8 opacity-90">
            To empower individuals with personalized, science-backed health insights that 
            enable them to make informed decisions about their nutrition and wellness journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="opacity-90">Lives Improved</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="opacity-90">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="opacity-90">Years of Research</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

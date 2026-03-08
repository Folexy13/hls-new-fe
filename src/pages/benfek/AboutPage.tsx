import { CheckCircle, Users, Award, TrendingUp, ArrowRight, Quote, Star, Heart, Shield, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: "Science-Based",
      description: "All our recommendations are backed by peer-reviewed research and clinical studies.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Personalized",
      description: "Every recommendation is tailored to your unique lifestyle, goals, and health needs.",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Award,
      title: "Quality First",
      description: "We partner only with premium manufacturers who meet our strict quality standards.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Results Driven",
      description: "Our platform helps you track progress and optimize your health journey over time.",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const stakeholders = [
    {
      name: "Dr. Adebayo Olumide",
      role: "Chief Executive Officer & Founder",
      bio: "MD with 20+ years in personalized medicine. Former head of Nutritional Genomics at Lagos University Teaching Hospital. Pioneer in African health tech innovation.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      specialization: "Medical Leadership",
      achievements: ["50+ Published Papers", "Healthcare Innovation Award 2023", "WHO Advisory Board Member"]
    },
    {
      name: "Dr. Funmi Adebisi",
      role: "Chief Scientific Officer",
      bio: "PhD in Nutritional Biochemistry from Oxford University. 15+ years in personalized nutrition research with focus on African genetic variants.",
      image: "https://images.unsplash.com/photo-1594824883330-30a5e0b4d2d9?w=400&h=400&fit=crop&crop=face",
      specialization: "Nutritional Science",
      achievements: ["100+ Research Publications", "Global Nutrition Excellence Award", "Patent Holder - Nutrigenomics"]
    },
    {
      name: "Eng. Chinedu Okafor",
      role: "Chief Technology Officer",
      bio: "Former Principal Engineer at Google. MIT graduate specializing in AI-driven health platforms. Expert in machine learning for personalized recommendations.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      specialization: "Health Technology",
      achievements: ["AI Innovation Leader", "10+ Healthcare Patents", "TechCrunch Disruptor Award"]
    },
    {
      name: "Dr. Kemi Ogundipe",
      role: "Head of Clinical Operations",
      bio: "Registered Dietitian and Clinical Nutritionist. Specializes in metabolic health optimization and sports nutrition for African populations.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      specialization: "Clinical Nutrition",
      achievements: ["Clinical Excellence Award", "500+ Patient Success Stories", "Nutrition Protocol Developer"]
    }
  ];

  const testimonials = [
    {
      text: "HLS transformed my approach to health. The personalized recommendations were spot-on and easy to follow. I've never felt better in my life!",
      author: "Sarah Johnson",
      role: "Health Enthusiast",
      rating: 5,
      location: "Lagos, Nigeria"
    },
    {
      text: "Finally, a platform that understands African genetics and nutrition needs. The insights I received were incredibly accurate and tailored to my heritage.",
      author: "Dr. Michael Adeyemi",
      role: "Physician",
      rating: 5,
      location: "Accra, Ghana"
    },
    {
      text: "The team at HLS goes above and beyond. Their scientific approach combined with personalized care is unmatched in the industry.",
      author: "Amina Hassan",
      role: "Nutritionist",
      rating: 5,
      location: "Cairo, Egypt"
    },
    {
      text: "I've tried many health platforms, but HLS is different. The recommendations actually work because they're based on real science and my unique profile.",
      author: "David Okonkwo",
      role: "Fitness Coach",
      rating: 5,
      location: "Nairobi, Kenya"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
              About <span className="text-yellow-300">HLS</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-4xl mx-auto opacity-95 leading-relaxed">
              Pioneering the future of personalized health through cutting-edge science, 
              innovative technology, and deep understanding of African health needs.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span>Science-Backed Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span>50,000+ Lives Transformed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span>Pan-African Reach</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-4 h-4 bg-yellow-300 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse delay-1000">
          <div className="w-6 h-6 bg-emerald-300 rounded-full opacity-60"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto mb-8"></div>
          </div>
          <div className="prose prose-lg text-gray-700 mx-auto mb-12">
            <p className='text-lg font-semibold'>
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
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-2">Our Vision</h3>
                <p className="text-gray-800 text-lg">
                Empower 1 million Nigerians to embrace affordable, nutrient-based 
                healthcare by 2027, while establishing a leading earning platform 
                for healthcare professionals.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-2">Our Mission</h3>
                <p className="text-gray-800 text-lg">
                Unlocking the hidden power of nutrient-based healthcare for Nigerians,
                 by shedding light on the lesser-known benefits of age defiance, brain
                  health for economic productivity and creativity, quick recovery, and 
                  longevity, in addition to the commonly known benefits of vitality and 
                  immunity, through education, research, and personalized solutions.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-2">Objectives</h3>
                <ol className="list-decimal list-inside text-gray-800 space-y-1 text-lg">
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
            <div className="bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl p-8 flex flex-col h-full shadow-md">
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Six Pillars of HLS</h3>
              <ul className="list-disc list-inside text-gray-800 space-y-3 text-lg">
                <li><span className="font-semibold text-emerald-800">Advancement:</span> We prioritize preventive healthcare, innovating solutions that promote optimal wellness.</li>
                <li><span className="font-semibold text-emerald-800">Accessibility:</span> We make nutrient-based healthcare accessible to everyone, regardless of background or budget.</li>
                <li><span className="font-semibold text-emerald-800">Availability:</span> We ensure our services and products are readily available to support individuals' health journeys.</li>
                <li><span className="font-semibold text-emerald-800">Authenticity:</span> We stand behind the authenticity and quality of our recommended supplements, guaranteeing traceability.</li>
                <li><span className="font-semibold text-emerald-800">Accountability:</span> We take responsibility for our clients' progress, tracking outcomes and incorporating feedback for continuous improvement.</li>
                <li><span className="font-semibold text-emerald-800">Affordability:</span> We strive to make high-quality healthcare solutions affordable for all, without compromising on effectiveness.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The fundamental principles that guide every decision we make and every solution we create
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${value.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Meet Our Leadership</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visionary leaders combining decades of expertise in medicine, science, and technology
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto mt-8"></div>
          </div>
          
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-0">
                {stakeholders.map((stakeholder, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white h-full">
                      <CardContent className="p-0 h-full">
                        <div className="flex flex-col h-full">
                          <div className="relative overflow-hidden h-64">
                            <img
                              src={stakeholder.image}
                              alt={stakeholder.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stakeholder.name}</h3>
                              <p className="text-emerald-600 font-semibold text-base md:text-lg mb-1">{stakeholder.role}</p>
                              <p className="text-sm text-gray-500 font-medium">{stakeholder.specialization}</p>
                            </div>
                            
                            <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base flex-1">{stakeholder.bio}</p>
                            
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Key Achievements</h4>
                              <div className="space-y-2">
                                {stakeholder.achievements.map((achievement, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
            
            {/* Mobile scroll indicator */}
            <div className="flex justify-center mt-6 md:hidden">
              <p className="text-sm text-gray-500">← Swipe to see more leaders →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-700 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">What Our Community Says</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Real stories from real people who have transformed their health with HLS
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-300 to-white mx-auto mt-8"></div>
          </div>
          
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-0">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                      <CardContent className="p-6 md:p-8 h-full flex flex-col">
                        <Quote className="h-8 w-8 text-yellow-300 mb-4 flex-shrink-0" />
                        <p className="text-base md:text-lg mb-6 leading-relaxed flex-1">{testimonial.text}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-base md:text-lg">{testimonial.author}</p>
                            <p className="text-sm opacity-75">{testimonial.role}</p>
                            <p className="text-xs opacity-60 mt-1">{testimonial.location}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-300 fill-current" />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
            
            {/* Mobile scroll indicator */}
            <div className="flex justify-center mt-6 md:hidden">
              <p className="text-sm text-white/70">← Swipe to see more testimonials →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 lg:p-12">
              <Heart className="h-12 w-12 text-emerald-600 mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To democratize personalized healthcare across Africa by providing science-backed, 
                culturally-relevant health solutions that empower individuals to achieve optimal wellness.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700">Make personalized health accessible to all</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700">Bridge the healthcare gap in Africa</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700">Empower informed health decisions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 lg:p-12">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To become Africa's leading personalized health platform, transforming how millions 
                approach their wellness journey through innovative technology and scientific excellence.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Pan-African health transformation</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Global recognition for innovation</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Sustainable health ecosystems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Transform Your Health?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of others who have already started their personalized health journey with HLS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Assessment
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

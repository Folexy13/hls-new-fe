
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).every(value => value)) {
      toast.success('Support ticket submitted successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const faqs = [
    {
      question: "How do I start my health assessment?",
      answer: "To start your health assessment, navigate to the Quiz page and enter your unique quiz code. If you don't have a code, please contact our support team."
    },
    {
      question: "What supplements do you recommend?",
      answer: "Our supplement recommendations are personalized based on your health assessment results. After completing your quiz, you'll receive tailored recommendations in your dashboard."
    },
    {
      question: "How do I track my progress?",
      answer: "You can track your progress through your personal dashboard, which shows your health metrics, supplement intake, and progress over time."
    },
    {
      question: "Is my health data secure?",
      answer: "Yes, we take data security very seriously. All your health information is encrypted and stored securely in compliance with healthcare privacy regulations."
    },
    {
      question: "How often should I update my health information?",
      answer: "We recommend updating your health information monthly or whenever there are significant changes in your health status, activity level, or goals."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-lg text-gray-600">We're here to help you on your health journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card id="contact">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Send us a message and we'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email address"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="health">Health Questions</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue in detail"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Multiple ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">support@hls.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">123 Health Street, Wellness City, WC 12345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-gray-600">Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Support</CardTitle>
                <CardDescription>For urgent health-related concerns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  If you're experiencing a medical emergency, please contact your healthcare provider or emergency services immediately. Our support team cannot provide emergency medical assistance.
                </p>
                <Button variant="outline" className="w-full">
                  Find Healthcare Providers
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card id="faq">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      {/* Privacy Policy */}
      <Card id="privacy" className="mt-8">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardDescription>How we handle your information</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 leading-relaxed space-y-3">
          <p>
            We use your information to deliver personalized recommendations and improve your experience.
            Your data is protected and never sold.
          </p>
          <p>
            If you need a full policy document, contact support and we’ll provide the latest version.
          </p>
        </CardContent>
      </Card>

      {/* Connect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card id="newsletter">
          <CardHeader>
            <CardTitle>Newsletter</CardTitle>
            <CardDescription>Get wellness tips and updates</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Subscribe to receive health insights, new products, and offers.
          </CardContent>
        </Card>

        <Card id="social">
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Follow us for daily tips</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Connect with us on social platforms for bite-sized wellness guidance.
          </CardContent>
        </Card>

        <Card id="community">
          <CardHeader>
            <CardTitle>Community</CardTitle>
            <CardDescription>Join the conversation</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            Ask questions, share progress, and learn with others on the same journey.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;

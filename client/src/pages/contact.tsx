import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const faqs = [
  {
    question: 'How do I schedule a property viewing?',
    answer: 'You can schedule a viewing by clicking the "Schedule Viewing" button on any property listing, or by contacting the assigned agent directly. We typically arrange viewings within 24-48 hours of your request.',
  },
  {
    question: 'What documents do I need to buy a property?',
    answer: 'Generally, you\'ll need proof of identity, proof of income, bank statements, and a mortgage pre-approval letter if financing. Our agents will guide you through the complete documentation process.',
  },
  {
    question: 'How long does the buying process take?',
    answer: 'The typical buying process takes 30-60 days from offer acceptance to closing. This includes inspections, appraisal, mortgage processing, and closing procedures.',
  },
  {
    question: 'Do you help with property financing?',
    answer: 'While we don\'t provide financing directly, we work with trusted mortgage brokers and lenders who offer competitive rates. Our team can connect you with the right financial partners.',
  },
  {
    question: 'What are your commission rates?',
    answer: 'Our commission rates are competitive and transparent. We offer flexible commission structures depending on the property type and services required. Contact us for a detailed discussion.',
  },
  {
    question: 'Can I list my property with LuxeEstates?',
    answer: 'Absolutely! We welcome property listings. Contact our team for a free property valuation and to discuss how we can help you sell your property at the best possible price.',
  },
];

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['123 Luxury Avenue', 'Manhattan, NY 10001'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+1 (234) 567-890', '+1 (234) 567-891'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['info@luxeestates.com', 'support@luxeestates.com'],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We\'ll get back to you soon.',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-contact">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center mb-12">
            <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block">
              Get In Touch
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about a property or our services? We're here to help. Reach out to us using any of the methods below.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Name *</label>
                        <Input
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          data-testid="input-contact-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          data-testid="input-contact-email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+1 (234) 567-890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message *</label>
                      <Textarea
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        required
                        data-testid="input-contact-message"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto bg-primary"
                      disabled={mutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {mutation.isPending ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <Card key={index} className="shadow-md" data-testid={`card-contact-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-muted-foreground text-sm">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <section className="max-w-3xl mx-auto" data-testid="section-faq">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Find answers to common questions about our services.</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
                  data-testid={`accordion-faq-${index}`}
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

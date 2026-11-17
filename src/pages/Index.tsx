import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Heart, Users, BookOpen, Lightbulb, ArrowRight, MapPin, Target, Eye } from 'lucide-react';
import { sections, news } from '@/content/site';
import CountUp from 'react-countup';

import mathareAerial from '@/assets/impact/mathare-aerial.jpg';
import youthDiscussion from '@/assets/impact/youth-discussion.jpg';
import bottleArt from '@/assets/impact/bottle-art.jpg';
import childrenCups from '@/assets/impact/children-cups.jpg';
import presenterBlack from '@/assets/impact/presenter-black.jpg';
import presenterYellow from '@/assets/impact/presenter-yellow.jpg';
import communityCircle from '@/assets/impact/community-circle.jpg';
import womenPhone from '@/assets/impact/women-phone.jpg';

const collageImages = [
  bottleArt,
  childrenCups,
  presenterBlack,
  presenterYellow,
  communityCircle,
  womenPhone,
];

const impactStats = [
  {
    number: new Date().getFullYear() - 2009,
    label: "Years in Mathare",
    icon: Heart,
    image: mathareAerial,
  },
  {
    number: 3,
    label: "Programmes",
    icon: BookOpen,
    collage: collageImages,
  },
  {
    number: 2010,
    label: "Research partner since",
    icon: Lightbulb,
    image: youthDiscussion,
    isYear: true,
  },
  {
    number: 4,
    label: "Community-Led Urban Planning Platforms (CLUPPs)",
    icon: Users,
    image: mathareAerial,
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-white pb-12 sm:pb-16 md:pb-20 lg:pb-32 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight break-words drop-shadow-lg">
                Empowering Communities
                <span className="block text-white mt-1 sm:mt-2">in Mathare, Nairobi</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed max-w-2xl drop-shadow-md">
                The Ghetto Foundation is dedicated to community-driven development, 
                research, and sustainable change through education, innovation, and collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/donate">
                  <Button className="btn-hero bg-white text-community-warm hover:bg-gray-100">
                    Donate Now
                    <Heart className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/publications">
                  <Button className="btn-outline border-white text-white hover:bg-white hover:text-community-warm">
                    Announcements & News
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <Card key={index} className="impact-card relative rounded-xl overflow-hidden h-48">
                
                {/* Single image background */}
                {stat.image && (
                  <img
                    src={stat.image}
                    alt={stat.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 transform hover:scale-105"
                  />
                )}

                {/* Collage background */}
                {stat.collage && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 z-0">
                    {stat.collage.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={"collage-" + idx}
                        className="w-full h-full object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Overlay */}
                <div className="card-overlay" />

                {/* Content */}
                <CardContent className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                  <stat.icon className="w-8 h-8 mb-2 text-white" />
                  <div className="countup-number mb-1">
                    <CountUp end={stat.number} duration={2.5} separator={stat.isYear ? "" : ","} start={stat.isYear ? 1990 : 0} />
                  </div>
                  <div className="countup-label">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-community-warm" />
                <h3>Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To empower communities in Mathare through sustainable development, 
                education, and research-driven initiatives that create lasting positive impact.
              </p>
            </div>
            
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3">
                <Eye className="w-8 h-8 text-community-nature" />
                <h3>Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                A thriving, self-sustaining Mathare community where every individual 
                has access to opportunities for growth, education, and prosperity.
              </p>
            </div>
            
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-3">
                <MapPin className="w-8 h-8 text-community-trust" />
                <h3>Our Approach</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                PartnerUp! Community-Led Research and Action: residents set the questions,
                do the research and turn the findings into action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programmes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the initiatives transforming lives across Mathare through education,
              empowerment, and community-led action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((sec) => ({
                title: sec.menuLabel,
                description: sec.lead,
                image: sec.image,
                link: sec.path,
              })).map((program, index) => (
              <Link
                key={index}
                to={program.link}
                className="group block"
              >
                <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-community-warm transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {program.description}
                    </p>
                    <span className="inline-flex items-center text-community-warm font-medium">
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Latest News */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Latest News</h2>
            <Link to="/publications" className="text-community-warm font-medium hover:underline">All news & publications →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.slice(0, 3).map((item) => (
              <Card key={item.title} className="h-full">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold text-community-warm mb-2">{item.date}</p>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.text}</p>
                  {item.link && (
                    <Link to={item.link} className="inline-flex items-center mt-4 text-community-warm font-medium">
                      Read more <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

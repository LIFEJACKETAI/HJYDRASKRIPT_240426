import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, Shield, Cpu, Headphones, FileText, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: BookOpen,
    title: 'Complete Books, Not Drafts',
    description: 'Generate 90-150+ page books with narrative coherence and professional structure.',
  },
  {
    icon: Zap,
    title: 'Recursive AI Drafting',
    description: 'Each chapter receives Story Bible context + prior summaries for perfect continuity.',
  },
  {
    icon: Shield,
    title: 'Consistency Engine',
    description: 'Automatic flagging of character names, timelines, and setting inconsistencies.',
  },
  {
    icon: Cpu,
    title: 'Style Training',
    description: 'Upload your writing samples. Match Hemingway, King, or develop your unique voice.',
  },
  {
    icon: Headphones,
    title: 'Audiobook Studio',
    description: 'Convert chapters to speech with chunking, stitching, and R2 cloud storage.',
  },
  {
    icon: FileText,
    title: 'Multi-Format Export',
    description: 'PDF with cover & TOC, EPUB, DOCX, Markdown. Publishing-ready outputs.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Indie Author',
    content: 'I wrote my 120-page thriller in 3 weeks. The consistency checking saved me months of revisions.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'YouTuber & Writer',
    content: 'Zero server costs, runs mostly in my browser. This is the bootstrapper\'s dream tool.',
    avatar: 'MJ',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Educator',
    content: 'Created 15 educational eBooks for my students. The style training captured my voice perfectly.',
    avatar: 'ER',
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-300">$0 Cost • Full Control • Open Source</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Write{' '}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  150-Page Books
                </span>{' '}
                With AI
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 max-w-xl">
                Zero cost. Full control. Self-hostable AI book production for independent creators who demand professional results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Start Your Magnum Opus</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white/20 rounded-lg font-semibold hover:bg-white/5 transition-colors"
                >
                  <span>Try Demo</span>
                </Link>
              </div>

              <div className="mt-12 flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Self-hostable</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Open source</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-6 border border-white/10 shadow-2xl">
                {/* Mock Editor */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-sm text-gray-500">The Last Algorithm - Chapter 7</span>
                </div>
                
                <div className="space-y-3 font-mono text-sm">
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-5/6" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-4/5" />
                </div>

                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -left-8 top-1/4 bg-[#2a2a2a] rounded-lg p-3 border border-white/10 shadow-xl"
                >
                  <div className="text-xs text-gray-400">Word Count</div>
                  <div className="text-lg font-bold text-cyan-400">12,847</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -right-8 bottom-1/4 bg-[#2a2a2a] rounded-lg p-3 border border-white/10 shadow-xl"
                >
                  <div className="text-xs text-gray-400">Consistency</div>
                  <div className="text-lg font-bold text-green-400">98%</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Publish Books
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From first idea to finished audiobook. A complete production pipeline designed for serious creators.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5 hover:border-purple-500/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              From Idea to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Published
              </span>{' '}
              in 4 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Project', desc: 'Define title, genre, target length, and tone' },
              { step: '02', title: 'Build Story Bible', desc: 'Characters, settings, themes, and voice uploads' },
              { step: '03', title: 'Generate Outline', desc: 'AI creates 15-30 chapters, editable structure' },
              { step: '04', title: 'Draft & Export', desc: 'Recursive drafting with consistency checks' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Creators
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a2a] rounded-lg p-6 border border-white/5"
              >
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-3xl p-12 lg:p-20 text-center border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-cyan-500/10" />
            
            <div className="relative">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                Ready to Write Your{' '}
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Magnum Opus?
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of creators building professional books with AI. No credit card required. Self-host for $0/month.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                HYDRASKRIPT
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Built for creators by creators. $0 server costs, runs mostly in your browser!
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
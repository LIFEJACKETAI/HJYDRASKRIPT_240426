import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, Shield, Cpu, Headphones, FileText, Sparkles, Check, Star } from 'lucide-react';
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
    description: 'Convert chapters to professional narration with Neural2 voices and cloud storage.',
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
    content: 'The Author plan pays for itself the moment you publish your first book. I\'ve shipped four titles in two months.',
    avatar: 'MJ',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Educator',
    content: 'Created 15 educational eBooks for my students. The style training captured my voice perfectly.',
    avatar: 'ER',
  },
];

const TIERS = [
  {
    name: 'Starter',
    subtitle: 'Curious Killer',
    price: 29,
    credits: 100,
    highlight: false,
    badge: null,
    features: [
      '100 credits / month',
      'Outline & chapter structure',
      'Partial chapter generation',
      '1 active project',
      'PDF export only',
      'Standard queue priority',
    ],
    cta: 'Get Started',
    note: "Not enough for a full book. That's deliberate.",
  },
  {
    name: 'Author',
    subtitle: 'The Volume Tier',
    price: 79,
    credits: 400,
    highlight: true,
    badge: 'Most Popular',
    features: [
      '400 credits / month',
      '1 full-length book / month',
      'PDF + EPUB + DOCX export',
      'AI cover generation',
      'Editorial analysis pass',
      '5 active projects',
      'Faster queue priority',
    ],
    cta: 'Start Writing',
    note: 'One book/month for less than a ghostwriter writes a paragraph.',
  },
  {
    name: 'Publisher',
    subtitle: 'Serious Output',
    price: 149,
    credits: 1000,
    highlight: false,
    badge: null,
    features: [
      '1,000 credits / month',
      '2–3 full books / month',
      'Audiobook generation',
      'Advanced editorial logic',
      'Series & multi-book workflows',
      'Highest queue priority',
      'Early access to new models',
    ],
    cta: 'Start Publishing',
    note: null,
  },
  {
    name: 'Studio',
    subtitle: 'IP Factory',
    price: 299,
    credits: 3000,
    highlight: false,
    badge: 'Custom Available',
    features: [
      '3,000+ credits / month',
      'Bulk generation',
      'White-label exports',
      'Team accounts',
      'API access (coming soon)',
      'Priority support',
      'Commercial licensing included',
    ],
    cta: 'Contact Us',
    note: null,
  },
];

const CREDIT_PACKS = [
  { credits: 100, price: 15, note: null },
  { credits: 500, price: 60, note: null },
  { credits: 1000, price: 100, note: 'Best value' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
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
                <span className="text-sm text-gray-300">AI-Powered Book Studio • From $29/month</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Write{' '}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  150-Page Books
                </span>{' '}
                With AI
              </h1>

              <p className="text-xl text-gray-400 mb-8 max-w-xl">
                Professional AI book production for independent creators and publishers. From outline to audiobook, in one platform.
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
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Professional results</span>
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

      {/* Pricing Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Simple,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Honest Pricing
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A full book typically costs 250–400 credits depending on length and format.
              Yes, books cost money. As they should.
            </p>
          </div>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl p-6 border flex flex-col ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-purple-900/40 to-cyan-900/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'bg-[#2a2a2a] border-white/10'
                }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${
                    tier.highlight
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {tier.badge}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-sm text-gray-500">{tier.subtitle}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end space-x-1">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-400 mb-1">/month</span>
                  </div>
                  <p className="text-sm text-cyan-400 mt-1">{tier.credits.toLocaleString()} credits included</p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.note && (
                  <p className="text-xs text-gray-500 italic mb-4 border-t border-white/5 pt-4">
                    {tier.note}
                  </p>
                )}

                <Link
                  to="/auth"
                  className={`w-full text-center py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90 ${
                    tier.highlight
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Credit Top-ups */}
          <div className="bg-[#2a2a2a] rounded-xl border border-white/10 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Need More Credits?</h3>
              <p className="text-gray-400">Top up your account at any time. Credits never expire.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className={`relative flex items-center justify-between p-4 rounded-lg border ${
                    pack.note ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/10 bg-black/20'
                  }`}
                >
                  {pack.note && (
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-purple-500 rounded text-xs font-semibold">
                      {pack.note}
                    </span>
                  )}
                  <div>
                    <div className="font-bold text-lg">{pack.credits.toLocaleString()} credits</div>
                    <div className="text-sm text-gray-400">${(pack.price / pack.credits * 100).toFixed(1)}¢ per credit</div>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">${pack.price}</div>
                </div>
              ))}
            </div>
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
                Join thousands of creators publishing professional books with AI. Start your 14-day free trial today.
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
              Built for serious creators. Professional AI book production.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

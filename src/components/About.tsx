import { Sparkles, Target, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Sparkles className="h-4 w-4" />
            About AI FormBuilder
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Building the future of<br />form creation
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're making professional form building accessible to everyone through the power of AI.
          </p>
        </motion.div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                AI FormBuilder was born from a simple observation: creating forms shouldn't require hours of work or technical expertise. In today's fast-paced world, you need tools that match your speed.
              </p>
              <p>
                That's why we built AI FormBuilder—the first form creation platform that uses artificial intelligence to generate professional forms in seconds. Just describe what you need, and watch as our AI creates a complete, ready-to-use form.
              </p>
              <p>
                Developed by <strong className="text-gray-900">PlanetSoftweb</strong>, a team passionate about making powerful technology accessible to everyone, we've helped over 10,000 users create more than 50,000 forms and counting.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What drives us</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we build</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl"
            >
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Democratize form building with AI, making it instant, intelligent, and accessible to everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl"
            >
              <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A world where creating professional forms takes seconds, not hours—powered by cutting-edge AI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-2xl"
            >
              <div className="bg-pink-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Speed, simplicity, innovation, and user delight in every feature we ship.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* PlanetSoftweb Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Powered by PlanetSoftweb</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            PlanetSoftweb is a software development company dedicated to creating innovative, 
            user-friendly applications that solve real problems. Our team of developers, designers, 
            and AI specialists work together to build tools that empower businesses worldwide.
          </p>
          <a 
            href="https://planetsoftweb.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Visit PlanetSoftweb
          </a>
        </motion.div>
      </div>
    </div>
  );
};

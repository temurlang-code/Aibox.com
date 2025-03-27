import { motion } from "framer-motion";
import { useTools } from "@/context/ToolsContext";
import { ToolCategory, type ToolCategoryType } from "@shared/schema";

const Hero = () => {
  const { category, setCategory } = useTools();

  const handleCategoryClick = (selectedCategory: ToolCategoryType) => {
    setCategory(selectedCategory);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <header className="relative z-10 overflow-hidden">
      <div className="px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-28 max-w-7xl mx-auto">
        <motion.div 
          className="text-center relative"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
            Discover AI Tools For Every Need
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10">
            Explore our extensive catalog of AI neural networks categorized by functionality.
            Find the perfect tool for your next project.
          </p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {Object.values(ToolCategory).map((cat) => (
              <motion.button
                key={cat}
                variants={fadeIn}
                onClick={() => handleCategoryClick(cat)}
                className={`category-chip group px-5 py-2 ${
                  category === cat 
                    ? "bg-primary/10 hover:bg-primary/20 border border-primary/20" 
                    : "bg-gray-800/70 hover:bg-gray-800 border border-gray-700"
                } rounded-full flex items-center text-${category === cat ? 'white' : 'gray-300'} hover:text-white transition-all`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  category === cat ? "bg-primary animate-pulse" : "bg-gray-500 group-hover:bg-primary group-hover:animate-pulse"
                } mr-2`}></span>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;

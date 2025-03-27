import { Link } from "wouter";
import { Tool } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ToolCardProps {
  tool: Tool;
  variant: "featured" | "popular" | "standard";
}

const ToolCard = ({ tool, variant }: ToolCardProps) => {
  // Format relative time from ISO string
  const timeAgo = formatDistanceToNow(new Date(tool.updatedAt), { addSuffix: true });
  
  // Function to handle rating display (convert from numeric to decimal)
  const displayRating = (rating: number) => (rating / 100).toFixed(1);

  // Function to get icon color class based on tool's iconColor property
  const getIconColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-400 bg-blue-600/20",
      green: "text-green-400 bg-green-600/20",
      purple: "text-purple-400 bg-purple-600/20",
      red: "text-red-400 bg-red-600/20",
      yellow: "text-yellow-400 bg-yellow-600/20",
      teal: "text-teal-400 bg-teal-600/20",
      primary: "text-primary bg-primary/20",
      secondary: "text-secondary bg-secondary/20",
      accent: "text-accent bg-accent/20",
    };
    
    return colorMap[color] || "text-blue-400 bg-blue-600/20";
  };

  // Get category background and text color classes
  const getCategoryClasses = (category: string) => {
    const categoryMap: Record<string, { bg: string; text: string }> = {
      text: { bg: "bg-blue-900/60", text: "text-blue-300" },
      image: { bg: "bg-purple-900/60", text: "text-purple-300" },
      audio: { bg: "bg-green-900/60", text: "text-green-300" },
      video: { bg: "bg-red-900/60", text: "text-red-300" },
      code: { bg: "bg-yellow-900/60", text: "text-yellow-300" },
      data: { bg: "bg-teal-900/60", text: "text-teal-300" },
    };
    
    return categoryMap[category] || { bg: "bg-gray-900/60", text: "text-gray-300" };
  };

  if (variant === "featured") {
    return (
      <motion.div 
        className="card bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden hover:border-primary/50 cursor-pointer"
        whileHover={{ translateY: -8, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/tools/${tool.id}`}>
          <a className="block">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={tool.imageUrl} 
                alt={`${tool.name} visualization`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 ${getCategoryClasses(tool.category).bg} ${getCategoryClasses(tool.category).text} text-xs font-medium rounded-full`}>
                  {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl mb-2 text-white">{tool.name}</h3>
              <p className="text-gray-300 text-sm mb-4">
                {tool.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
                    <i className="fas fa-star text-yellow-400 mr-1"></i> {displayRating(tool.rating)}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
                    <i className={`fas fa-${tool.tags[0] === "Fast" ? "bolt text-blue-400" : 
                                          tool.tags[0] === "Smart" ? "brain text-purple-400" : 
                                          "magic text-orange-400"} mr-1`}></i> 
                    {tool.tags[0] || "AI"}
                  </span>
                </div>
                <span className="text-primary hover:text-white text-sm font-medium hover:underline flex items-center">
                  Explore <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </span>
              </div>
            </div>
          </a>
        </Link>
      </motion.div>
    );
  }

  if (variant === "popular") {
    return (
      <motion.div 
        className="card bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden hover:border-primary/50 p-4 cursor-pointer"
        whileHover={{ translateY: -8, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
        transition={{ duration: 0.3 }}
      >
        <Link href={`/tools/${tool.id}`}>
          <a className="block">
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-full ${
                tool.iconColor.includes("-") 
                  ? `bg-gradient-to-br from-${tool.iconColor.split("-")[0]} to-${tool.iconColor.split("-")[1]}` 
                  : `bg-gradient-to-br from-${tool.iconColor} to-${tool.iconColor}-800`
              } flex items-center justify-center text-white text-xl flex-shrink-0`}>
                <i className={`fas fa-${tool.icon}`}></i>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-white">{tool.name}</h3>
                <span className="text-xs text-gray-400">{tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              {tool.description}
            </p>
            <button className="w-full py-2 border border-primary/40 rounded-lg text-primary text-sm hover:bg-primary/10 transition-colors flex items-center justify-center">
              <i className="fas fa-external-link-alt mr-2 text-xs"></i> Open Tool
            </button>
          </a>
        </Link>
      </motion.div>
    );
  }

  // Default/standard card
  return (
    <motion.div 
      className="card bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden hover:border-primary/50 flex flex-col cursor-pointer"
      whileHover={{ translateY: -8, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/tools/${tool.id}`}>
        <a className="block p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-xl ${getIconColorClass(tool.iconColor)} flex items-center justify-center text-xl flex-shrink-0`}>
                <i className={`fas fa-${tool.icon}`}></i>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-white text-lg">{tool.name}</h3>
                <div className="flex items-center">
                  <span className={`px-2 py-0.5 ${getCategoryClasses(tool.category).bg} ${getCategoryClasses(tool.category).text} text-xs rounded-md`}>
                    {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                  </span>
                  <span className="ml-2 text-gray-400 text-xs flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i> {displayRating(tool.rating)}
                  </span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <i className="far fa-bookmark"></i>
            </button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            {tool.description}
          </p>
          
          <div className="mt-auto flex flex-wrap gap-2 mb-4">
            {(tool.tags as string[]).slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg border-gray-700">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Updated: {timeAgo}</span>
            <span className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-sm rounded-lg transition-colors flex items-center">
              <i className="fas fa-external-link-alt mr-1.5 text-xs"></i> Try it
            </span>
          </div>
        </a>
      </Link>
    </motion.div>
  );
};

export default ToolCard;

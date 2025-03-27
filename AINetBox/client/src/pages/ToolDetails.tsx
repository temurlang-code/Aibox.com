import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Layout from "@/components/Layout";
import ToolDetailModal from "@/components/ToolDetailModal";
import { Tool } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const ToolDetails = () => {
  const [match, params] = useRoute("/tools/:id");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tool, isLoading, error } = useQuery<Tool>({
    queryKey: [`/api/tools/${params?.id}`],
    enabled: !!params?.id,
  });

  // Show modal when tool data is loaded
  useEffect(() => {
    if (tool) {
      setIsModalOpen(true);
    }
  }, [tool]);

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Format relative time from ISO string
  const timeAgo = tool ? formatDistanceToNow(new Date(tool.updatedAt), { addSuffix: true }) : "";
  
  // Format rating to display as decimal
  const displayRating = (rating: number) => (rating / 100).toFixed(1);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <a className="text-primary hover:underline flex items-center">
              <i className="fas fa-arrow-left mr-2"></i> Back to Catalog
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-8">
              <Skeleton className="w-24 h-24 rounded-xl" />
              <div className="ml-6">
                <Skeleton className="h-8 w-60 mb-4" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </div>
            </div>
            
            <Skeleton className="h-6 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-8" />
            
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
            </div>
          </div>
        ) : error ? (
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-8 text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Tool</h2>
            <p className="text-gray-400 mb-6">Sorry, we couldn't load the details for this tool. Please try again later.</p>
            <Link href="/">
              <a>
                <Button className="bg-primary text-white">
                  Return to Catalog
                </Button>
              </a>
            </Link>
          </div>
        ) : tool ? (
          <motion.div 
            className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero section with image */}
            <div className="h-64 md:h-80 overflow-hidden relative">
              <img 
                src={tool.imageUrl} 
                alt={`${tool.name} visualization`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${tool.iconColor} to-${tool.iconColor === 'primary' ? 'accent' : 'purple-700'} flex items-center justify-center text-white text-3xl flex-shrink-0`}>
                    <i className={`fas fa-${tool.icon}`}></i>
                  </div>
                  <div className="ml-5">
                    <h1 className="text-3xl font-bold text-white">{tool.name}</h1>
                    <div className="flex items-center mt-2">
                      <Badge className={`px-3 py-1 rounded-full bg-${tool.category === 'image' ? 'purple' : 
                                                                     tool.category === 'text' ? 'blue' : 
                                                                     tool.category === 'audio' ? 'green' : 
                                                                     tool.category === 'video' ? 'red' : 
                                                                     tool.category === 'code' ? 'yellow' : 
                                                                     'teal'}-900/60 text-${tool.category === 'image' ? 'purple' : 
                                                                                         tool.category === 'text' ? 'blue' : 
                                                                                         tool.category === 'audio' ? 'green' : 
                                                                                         tool.category === 'video' ? 'red' : 
                                                                                         tool.category === 'code' ? 'yellow' : 
                                                                                         'teal'}-300 text-sm border-0`}>
                        {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Generation
                      </Badge>
                      <div className="ml-3 flex items-center text-gray-300">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        <span className="font-medium">{displayRating(tool.rating)}</span>
                        <span className="mx-2">•</span>
                        <span>Updated {timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                    <p className="text-gray-300">
                      {tool.description}
                    </p>
                  </section>
                  
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Features</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(tool.features as string[]).map((feature, index) => (
                        <li key={index} className="flex items-start bg-gray-800/30 p-3 rounded-lg">
                          <i className="fas fa-check text-green-400 mt-1 mr-3"></i>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Use Cases</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(tool.useCases as any[]).map((useCase, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                          <div className={`text-${useCase.iconColor} text-xl mb-2`}>
                            <i className={`fas fa-${useCase.icon}`}></i>
                          </div>
                          <h5 className="font-medium text-white mb-1">{useCase.title}</h5>
                          <p className="text-gray-400 text-sm">{useCase.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-gray-800/30 rounded-xl p-6 sticky top-24">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Tool Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white font-medium">{tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-white font-medium flex items-center">
                            <i className="fas fa-star text-yellow-400 mr-1"></i> {displayRating(tool.rating)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Updated:</span>
                          <span className="text-white font-medium">{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {(tool.tags as string[]).map((tag, index) => (
                          <Badge key={index} variant="outline" className="px-2.5 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg border-gray-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Pricing</h3>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Free Tier:</span>
                        <span className="text-white font-medium">Available</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400">Premium:</span>
                        <span className="text-white font-medium">From $19/mo</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Website</h3>
                      <a 
                        href={tool.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline flex items-center"
                      >
                        <i className="fas fa-globe mr-2"></i>
                        {tool.websiteUrl?.replace(/^https?:\/\//, '') || `${tool.name.toLowerCase()}.ai`}
                        <i className="fas fa-external-link-alt ml-2 text-xs"></i>
                      </a>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <Button 
                        className="w-full py-2.5 bg-primary rounded-lg text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                        onClick={() => window.open(tool.websiteUrl || '#', '_blank')}
                      >
                        <i className="fas fa-external-link-alt mr-2"></i> Open Tool
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
                      >
                        <i className="far fa-bookmark mr-2"></i> Save Tool
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
      
      {/* Tool Detail Modal */}
      {tool && (
        <ToolDetailModal
          tool={tool}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </Layout>
  );
};

export default ToolDetails;

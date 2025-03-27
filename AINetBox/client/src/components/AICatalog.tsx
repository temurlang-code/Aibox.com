import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTools } from "@/context/ToolsContext";
import ToolCard from "./ToolCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tool } from "@shared/schema";

const AICatalog = () => {
  const { category, searchQuery } = useTools();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popularity");
  const itemsPerPage = 6;

  const { data: allTools, isLoading: isLoadingAll } = useQuery<Tool[]>({
    queryKey: ["/api/tools", category],
    enabled: !searchQuery, // Don't fetch if there's a search query
  });

  const { data: featuredTools, isLoading: isLoadingFeatured } = useQuery<Tool[]>({
    queryKey: ["/api/featured-tools"],
  });

  const { data: popularTools, isLoading: isLoadingPopular } = useQuery<Tool[]>({
    queryKey: ["/api/popular-tools"],
  });

  const { data: searchResults, isLoading: isLoadingSearch } = useQuery<Tool[]>({
    queryKey: ["/api/tools/search", searchQuery],
    enabled: !!searchQuery, // Only fetch if there's a search query
  });

  // Use search results if there's a search query, otherwise use all tools filtered by category
  const displayedTools = searchQuery ? searchResults : allTools;

  // Calculate pagination
  const totalPages = displayedTools ? Math.ceil(displayedTools.length / itemsPerPage) : 0;
  const paginatedTools = displayedTools?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sort tools based on selected option
  const sortTools = (tools: Tool[] | undefined) => {
    if (!tools) return [];
    
    const sortedTools = [...tools];
    
    switch(sortBy) {
      case "rating":
        return sortedTools.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sortedTools.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "a-z":
        return sortedTools.sort((a, b) => a.name.localeCompare(b.name));
      case "popularity":
      default:
        // Assuming popularity is determined by a combination of factors
        return sortedTools.sort((a, b) => {
          const aScore = a.rating + (a.isPopular ? 100 : 0);
          const bScore = b.rating + (b.isPopular ? 100 : 0);
          return bScore - aScore;
        });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of catalog
    window.scrollTo({ top: document.getElementById('all-tools')?.offsetTop || 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
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
    <main className="relative z-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Section */}
        {!searchQuery && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <span className="inline-block w-1.5 h-6 bg-primary mr-3"></span>
              Featured AI Tools
            </h2>
            
            {isLoadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-5">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {featuredTools?.map((tool) => (
                  <motion.div key={tool.id} variants={fadeInUp}>
                    <ToolCard tool={tool} variant="featured" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        )}
        
        {/* Popular Tools Section */}
        {!searchQuery && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <span className="inline-block w-1.5 h-6 bg-secondary mr-3"></span>
              Popular AI Tools
            </h2>
            
            {isLoadingPopular ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center mb-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {popularTools?.map((tool) => (
                  <motion.div key={tool.id} variants={fadeInUp}>
                    <ToolCard tool={tool} variant="popular" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        )}
        
        {/* All Tools Section */}
        <section id="all-tools">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="inline-block w-1.5 h-6 bg-accent mr-3"></span>
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : "All AI Tools"}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 text-white text-sm rounded-lg border border-gray-700 w-[140px] focus:outline-none focus:ring-1 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-700">
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoadingAll || isLoadingSearch ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <div className="ml-3">
                        <Skeleton className="h-6 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-24 rounded-lg" />
                    <Skeleton className="h-6 w-32 rounded-lg" />
                    <Skeleton className="h-6 w-20 rounded-lg" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedTools?.length === 0 ? (
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-8 text-center">
              <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
              <p className="text-gray-400">
                {searchQuery 
                  ? `No results found for "${searchQuery}". Try a different search term.` 
                  : "No tools available in this category yet."}
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {sortTools(paginatedTools)?.map((tool) => (
                <motion.div key={tool.id} variants={fadeInUp}>
                  <ToolCard tool={tool} variant="standard" />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-chevron-left text-xs"></i>
                </Button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show ellipsis for large page numbers
                  if (
                    totalPages > 7 &&
                    page !== 1 &&
                    page !== totalPages &&
                    (page < currentPage - 1 || page > currentPage + 1) &&
                    page !== 2 &&
                    page !== totalPages - 1
                  ) {
                    if (page === 3 && currentPage > 4) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400">
                          ...
                        </span>
                      );
                    }
                    if (page === totalPages - 2 && currentPage < totalPages - 3) {
                      return (
                        <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400">
                          ...
                        </span>
                      );
                    }
                    if (
                      (page > 2 && page < totalPages - 1) &&
                      (page < currentPage - 1 || page > currentPage + 1)
                    ) {
                      return null;
                    }
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant="outline"
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === page
                          ? "border-primary bg-primary text-white"
                          : "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <i className="fas fa-chevron-right text-xs"></i>
                </Button>
              </nav>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AICatalog;

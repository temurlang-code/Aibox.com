import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ToolDetailModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

const ToolDetailModal = ({ tool, isOpen, onClose }: ToolDetailModalProps) => {
  if (!tool) return null;

  // Format relative time from ISO string
  const timeAgo = formatDistanceToNow(new Date(tool.updatedAt), { addSuffix: true });
  
  // Format rating to display as decimal
  const displayRating = (rating: number) => (rating / 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-content sm:max-w-3xl max-h-[90vh] overflow-auto bg-gray-900 border border-gray-700 p-0">
        <DialogHeader className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center z-10">
          <DialogTitle className="font-bold text-xl text-white">{tool.name}</DialogTitle>
          <DialogClose className="text-gray-400 hover:text-white">
            <i className="fas fa-times"></i>
          </DialogClose>
        </DialogHeader>
        
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${tool.iconColor} to-purple-700 flex items-center justify-center text-white text-2xl`}>
              <i className={`fas fa-${tool.icon}`}></i>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <span className={`px-3 py-1 bg-${tool.category === 'image' ? 'purple' : 
                                              tool.category === 'text' ? 'blue' : 
                                              tool.category === 'audio' ? 'green' : 
                                              tool.category === 'video' ? 'red' : 
                                              tool.category === 'code' ? 'yellow' : 
                                              'teal'}-900/60 text-${tool.category === 'image' ? 'purple' : 
                                                                 tool.category === 'text' ? 'blue' : 
                                                                 tool.category === 'audio' ? 'green' : 
                                                                 tool.category === 'video' ? 'red' : 
                                                                 tool.category === 'code' ? 'yellow' : 
                                                                 'teal'}-300 text-sm rounded-full`}>
                  {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Generation
                </span>
                <div className="ml-3 flex items-center">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  <span className="text-white font-medium">{displayRating(tool.rating)}</span>
                  <span className="text-gray-400 text-sm ml-1">(1,245 reviews)</span>
                </div>
              </div>
              <div className="flex items-center mt-2 text-gray-400 text-sm">
                <span><i className="fas fa-user-check mr-1"></i> 50K+ users</span>
                <span className="mx-3">•</span>
                <span><i className="fas fa-calendar-alt mr-1"></i> Updated {timeAgo}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
            <p className="text-gray-300 mb-4">
              {tool.description}
            </p>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
            <ul className="space-y-2 text-gray-300">
              {(tool.features as string[]).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check text-green-400 mt-1 mr-3"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3">Use Cases</h4>
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
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="mb-2">
                <span className="text-sm text-gray-400">Pricing:</span>
                <span className="ml-2 text-white font-medium">Free tier available</span>
                <span className="text-gray-400"> • </span>
                <span className="text-white font-medium">Premium from $19/mo</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-globe text-gray-400 mr-2"></i>
                <a 
                  href={tool.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  {tool.websiteUrl?.replace(/^https?:\/\//, '') || `${tool.name.toLowerCase()}.ai`}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center hover:bg-gray-700 transition-colors"
              >
                <i className="far fa-bookmark mr-2"></i> Save
              </Button>
              <Button 
                className="px-4 py-2 bg-primary rounded-lg text-white flex items-center hover:bg-primary/90 transition-colors"
                onClick={() => window.open(tool.websiteUrl || '#', '_blank')}
              >
                <i className="fas fa-external-link-alt mr-2"></i> Open Tool
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDetailModal;

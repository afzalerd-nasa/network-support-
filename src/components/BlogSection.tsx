import React, { useState } from 'react';
import { BlogPost } from '../types/network';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Search,
  Tag,
} from 'lucide-react';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-20 bg-[#060a14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            TECHNICAL WRITING &amp; PAPERS
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Networking Insights &amp; Knowledge Base
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            In-depth engineering articles on enterprise routing mechanics, protocol internals, zero-trust perimeter defense, and cloud networking.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles (e.g. VLAN, OSPF, BGP, Linux)..."
              className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Clean unboxed metadata with dot separators */}
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="text-cyan-400 font-semibold">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight hover:text-cyan-400 transition-colors">
                  <button onClick={() => setSelectedPost(post)} className="text-left">
                    {post.title}
                  </button>
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              {/* Tags and Read CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span key={tag}>
                      #{tag}
                      {i < Math.min(post.tags.length, 3) - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Article Reader Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-[#0b1222] border border-slate-700 rounded-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl my-8">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                aria-label="Close article modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>{selectedPost.category}</span>
                  <span>·</span>
                  <span>{selectedPost.date}</span>
                  <span>·</span>
                  <span>{selectedPost.readTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {selectedPost.title}
                </h2>

                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400 pt-1 border-b border-slate-800 pb-4">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>

                {/* Article Prose Content */}
                <div className="text-sm text-slate-300 space-y-4 leading-relaxed pt-2 whitespace-pre-line font-sans">
                  {selectedPost.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

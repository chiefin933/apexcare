/*
 * ApexCare Blog Page — Warm Medical Humanity Design
 */

import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Clock, Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { blogPosts } from "@/lib/data";

const categories = ["All", "Cardiology", "Pediatrics", "Orthopedics", "Neurology", "Radiology", "Emergency"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 }
  })
};

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = blogPosts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || post.category === category;
    return matchSearch && matchCat;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-16">
        <div className="container">
          <div className="max-w-2xl mb-8">
            <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 px-3 py-1 text-xs uppercase tracking-wide">
              Medical Insights
            </Badge>
            <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">
              Health & Wellness Blog
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Expert insights, health tips, and medical news from ApexCare's team of specialists.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-teal-200 focus:border-teal-400"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`pill-tag transition-all ${
                  category === cat
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {filtered.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="mb-10"
                >
                  <Link href={`/blog/${filtered[0].id}`}>
                    <div className="group grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100 shadow-sm card-lift">
                      <div className="h-64 lg:h-auto overflow-hidden">
                        <img
                          src={filtered[0].image}
                          alt={filtered[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-8 flex flex-col justify-center bg-white">
                        <span className="pill-tag bg-teal-50 text-teal-600 text-xs mb-4 self-start">
                          {filtered[0].category}
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors leading-snug">
                          {filtered[0].title}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                          {filtered[0].excerpt}
                        </p>
                        <div className="flex items-center gap-3">
                          <img
                            src={filtered[0].authorImage}
                            alt={filtered[0].author}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{filtered[0].author}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {filtered[0].readTime} · {filtered[0].date}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Other Posts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(1).map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeUp}
                    custom={i * 0.2}
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="group rounded-2xl overflow-hidden border border-gray-100 card-lift bg-white shadow-sm h-full flex flex-col">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <span className="pill-tag bg-teal-50 text-teal-600 text-xs mb-3 self-start">
                            {post.category}
                          </span>
                          <h3 className="font-serif font-semibold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors flex-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                          <div className="flex items-center gap-2 mt-auto">
                            <img
                              src={post.authorImage}
                              alt={post.author}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="text-xs text-gray-500">
                              {post.author} · <Clock className="w-3 h-3 inline" /> {post.readTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

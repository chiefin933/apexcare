/*
 * ApexCare Blog Detail Page — Warm Medical Humanity Design
 */

import { Link, useParams } from "wouter";
import { Clock, ArrowRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { blogPosts } from "@/lib/data";

const articleContent: Record<string, string> = {
  "understanding-heart-health": `
Cardiovascular disease remains the leading cause of death globally, claiming over 17 million lives each year. Yet, many of these deaths are preventable with early detection and lifestyle changes. Understanding the warning signs your heart sends is the first step toward protecting your health.

**1. Chest Pain or Discomfort**
The most recognized symptom of a heart attack, chest pain can feel like pressure, squeezing, fullness, or pain in the center or left side of the chest. It may last for more than a few minutes or come and go. Never ignore persistent chest discomfort.

**2. Shortness of Breath**
Difficulty breathing, especially during activities that previously caused no problem, can indicate that your heart is struggling to pump blood efficiently. This symptom often accompanies chest pain but can occur independently.

**3. Irregular Heartbeat**
An occasional skipped beat is usually harmless. However, persistent palpitations, fluttering, or racing heartbeats — especially with dizziness or fainting — warrant immediate medical evaluation.

**4. Swelling in Legs, Ankles, or Feet**
When the heart cannot pump blood effectively, fluid accumulates in the lower extremities. This edema is a common sign of heart failure and should not be dismissed as mere tiredness.

**5. Fatigue**
Unusual or extreme fatigue, particularly in women, can be an early warning sign of heart disease. When the heart works harder to pump blood, the body diverts energy away from non-essential functions, causing persistent tiredness.

**Prevention is Your Best Medicine**
Regular cardiovascular check-ups, maintaining a healthy weight, exercising regularly, eating a heart-healthy diet, and not smoking are the cornerstones of heart disease prevention. At ApexCare, our Cardiology Department offers comprehensive cardiac risk assessments and preventive programs tailored to your individual needs.

Schedule a consultation with Dr. Amara Osei and our cardiology team today.
  `,
  "childrens-vaccination-guide": `
Vaccines are one of the most powerful tools in modern medicine, protecting children from diseases that once caused widespread suffering and death. Following the recommended vaccination schedule is one of the most important things parents can do for their child's health.

**Why Vaccinations Matter**
Vaccines work by training the immune system to recognize and fight specific pathogens without causing the disease itself. They protect not only the vaccinated child but also vulnerable community members who cannot be vaccinated, through what is known as herd immunity.

**The 2026 Recommended Schedule**
The vaccination schedule is carefully designed by medical experts to provide protection at the most vulnerable ages. Key milestones include:

- **Birth:** Hepatitis B (first dose)
- **2 Months:** DTaP, IPV, Hib, PCV15, RV
- **4 Months:** DTaP, IPV, Hib, PCV15, RV
- **6 Months:** DTaP, IPV, Hib, PCV15, RV, Influenza (annual)
- **12–15 Months:** MMR, Varicella, Hepatitis A, PCV15
- **4–6 Years:** DTaP, IPV, MMR, Varicella boosters
- **11–12 Years:** Tdap, HPV, MenACWY

**Addressing Common Concerns**
Many parents have questions about vaccine safety. It is important to know that vaccines undergo rigorous testing before approval and continuous monitoring after. The benefits of vaccination far outweigh the risks of the diseases they prevent.

At ApexCare's Pediatrics Department, our team is always available to discuss your child's vaccination schedule and address any concerns you may have.
  `,
};

export default function BlogDetail() {
  const params = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === params.id);
  const related = blogPosts.filter((p) => p.id !== params.id).slice(0, 3);

  if (!post) {
    return (
      <Layout>
        <div className="container py-32 text-center">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Back to Blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const content = articleContent[post.id] || post.excerpt + "\n\nThis article is being expanded with more detailed medical insights from our specialists. Check back soon for the full version, or contact our team for personalized medical advice.";

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="h-72 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/20" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-10">
            <Link href="/blog">
              <span className="text-teal-300 text-sm hover:text-white transition-colors mb-4 inline-flex items-center gap-1">
                ← Back to Blog
              </span>
            </Link>
            <Badge className="mb-3 bg-teal-500/80 text-white border-0 px-3 py-1 text-xs">
              {post.category}
            </Badge>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white max-w-3xl leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Article */}
            <div className="lg:col-span-2">
              {/* Author */}
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                <img src={post.authorImage} alt={post.author} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">{post.author}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime} · {post.date}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">{post.excerpt}</p>
                {content.split("\n\n").map((para, i) => {
                  if (para.startsWith("**") && para.endsWith("**")) {
                    return <h3 key={i} className="font-serif text-xl font-bold text-gray-900 mt-8 mb-3">{para.replace(/\*\*/g, "")}</h3>;
                  }
                  if (para.includes("**")) {
                    return (
                      <p key={i} className="text-gray-700 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{
                          __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        }}
                      />
                    );
                  }
                  if (para.startsWith("- ")) {
                    const items = para.split("\n").filter(l => l.startsWith("- "));
                    return (
                      <ul key={i} className="list-none space-y-2 mb-4">
                        {items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-gray-700">
                            <span className="text-teal-500 mt-1">•</span>
                            <span dangerouslySetInnerHTML={{ __html: item.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return para.trim() ? <p key={i} className="text-gray-700 leading-relaxed mb-4">{para.trim()}</p> : null;
                })}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mt-8 pt-8 border-t border-gray-100">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag) => (
                  <span key={tag} className="pill-tag bg-gray-100 text-gray-600 text-xs">{tag}</span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 p-6 bg-teal-50 rounded-2xl border border-teal-100">
                <h4 className="font-serif font-bold text-gray-900 mb-2">
                  Have questions about your health?
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Our specialists are here to help. Book a consultation with one of our expert doctors today.
                </p>
                <Link href="/book-appointment">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Book a Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {related.map((rp) => (
                    <Link key={rp.id} href={`/blog/${rp.id}`}>
                      <div className="group flex gap-3 p-3 rounded-xl hover:bg-teal-50 transition-colors">
                        <img
                          src={rp.image}
                          alt={rp.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <span className="pill-tag bg-teal-50 text-teal-600 text-xs mb-1">{rp.category}</span>
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors leading-snug">
                            {rp.title}
                          </h4>
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rp.readTime}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-teal-600 rounded-2xl p-6 text-white">
                <h4 className="font-serif font-bold text-lg mb-2">Health Newsletter</h4>
                <p className="text-teal-100 text-sm mb-4">Get expert health tips delivered to your inbox weekly.</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 rounded-lg text-gray-900 text-sm mb-2 outline-none"
                />
                <Button className="w-full bg-white text-teal-700 hover:bg-teal-50">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, Users, MessageSquare, ThumbsUp, MapPin } from 'lucide-react';
import { PhoneShell } from '@/components/agro/PhoneShell';

export const Route = createFileRoute('/community')({
  component: CommunityScreen,
});

const posts = [
  { id: 1, author: "Mahesh Y.", time: "2h ago", text: "What is the best pesticide for stem borer in Paddy? Seeing some early signs.", likes: 12, replies: 4, tag: "Pest Control" },
  { id: 2, author: "Sathwik G.", time: "5h ago", text: "Anyone renting out a tractor this weekend in Moinabad area? Need it for 4 hours.", likes: 3, replies: 1, tag: "Machinery" },
  { id: 3, author: "Druvansh P.", time: "1d ago", text: "Successfully completed my soil test through AgroKisan. Highly recommend getting it done before Kharif!", likes: 45, replies: 8, tag: "General" },
];

function CommunityScreen() {
  return (
    <PhoneShell>
      <div className="min-h-screen bg-background font-sans pb-24">
        <div className="bg-card/80 backdrop-blur-md border-b border-border/40 px-5 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors">
              <ChevronLeft size={24} className="text-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                <Users size={20} />
              </div>
              <h1 className="text-lg font-bold text-foreground">Local Forum</h1>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <button className="w-full bg-surface border border-primary/30 text-primary font-bold py-3 rounded-2xl shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors">
            + Start a Discussion
          </button>

          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card/80 backdrop-blur-md border border-border/40 rounded-3xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">{post.author.charAt(0)}</div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{post.author}</h3>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {post.time}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md">{post.tag}</span>
              </div>
              <p className="text-sm text-foreground/90 mt-3 leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp size={14} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                  <MessageSquare size={14} /> {post.replies} Replies
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}
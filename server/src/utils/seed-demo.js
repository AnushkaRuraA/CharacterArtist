import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env.js';

const run = async () => {
  await mongoose.connect(env.MONGODB_URI);
  const { Portfolio } = await import('../modules/portfolio/portfolio.model.js');

  const exists = await Portfolio.countDocuments();
  if (exists > 0) { console.log('Portfolio already has items'); await mongoose.disconnect(); return; }

  const demoItems = [
    { title: 'Ashen Warlord', category: 'characters', description: 'Game-ready warrior character sculpted in ZBrush, textured in Substance.', isFeatured: true, isPublished: true, year: 2024, software: ['ZBrush','Substance Painter','Maya'], engine: 'Unreal Engine 5', polyCount: '80k tris', images: [{ url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800', publicId: 'demo1', isPrimary: true, order: 0 }] },
    { title: 'Void Creature', category: 'creatures', description: 'Alien horror creature — asymmetric design, bioluminescent textures.', isFeatured: true, isPublished: true, year: 2024, software: ['ZBrush','Substance'], images: [{ url: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800', publicId: 'demo2', isPrimary: true, order: 0 }] },
    { title: 'Neon Ghost', category: 'concepts', description: 'Cyberpunk ghost concept — mix of traditional ink and digital painting.', isFeatured: false, isPublished: true, year: 2023, software: ['Photoshop','Procreate'], images: [{ url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', publicId: 'demo3', isPrimary: true, order: 0 }] },
    { title: 'Iron Sentinel', category: 'game-ready', description: 'Fully rigged mech character, 50k tris, PBR textures.', isFeatured: false, isPublished: true, year: 2024, software: ['Maya','Substance'], engine: 'Unity', polyCount: '50k tris', images: [{ url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800', publicId: 'demo4', isPrimary: true, order: 0 }] },
    { title: 'Desert Prophet', category: 'characters', description: 'Stylised wanderer character — for animated feature pitch.', isFeatured: true, isPublished: true, year: 2023, software: ['ZBrush','Blender'], images: [{ url: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800', publicId: 'demo5', isPrimary: true, order: 0 }] },
    { title: 'Fan Art — Dragonborn', category: 'fanart', description: 'Skyrim Dragonborn reimagined in a darker, more grounded art style.', isFeatured: false, isPublished: true, year: 2022, images: [{ url: 'https://images.unsplash.com/photo-1627163439134-7a8c47e08208?w=800', publicId: 'demo6', isPrimary: true, order: 0 }] },
    { title: 'Ancient Forest Golem', category: 'creatures', description: 'Nature-infused golem concept and sculpt — mossy stone and living wood.', isFeatured: false, isPublished: true, year: 2024, software: ['ZBrush'], images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', publicId: 'demo7', isPrimary: true, order: 0 }] },
    { title: 'Crimson Valkyrie', category: 'characters', description: 'Norse-inspired warrior. Hero character for an unannounced mobile title.', isFeatured: true, isPublished: true, year: 2024, software: ['ZBrush','Substance','Maya'], engine: 'Unreal Engine 5', images: [{ url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800', publicId: 'demo8', isPrimary: true, order: 0 }] },
  ];

  await Portfolio.insertMany(demoItems.map((item, i) => ({ ...item, slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i, order: i })));
  console.log(`Seeded ${demoItems.length} portfolio items`);
  await mongoose.disconnect();
};

run().catch(e => { console.error(e); process.exit(1); });

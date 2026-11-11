import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_FILE_PATH = path.join(__dirname, 'data', 'products.json');

// Initialize Gemini AI Client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Simple in-memory rate limiter for AI endpoint
const requestCounts = new Map<string, { count: number; resetTime: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRate = requestCounts.get(ip);
  if (!userRate || now > userRate.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (userRate.count >= 25) {
    return false;
  }
  userRate.count++;
  return true;
}

// Helper to read product data
async function getProductsData() {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading products data:', err);
    return [];
  }
}

// Helper to write product data
async function saveProductsData(data: unknown) {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Get all products
  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      const products = await getProductsData();
      res.json({ success: true, products });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. Get product by ID
  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const products = await getProductsData();
      const product = products.find((p: any) => p.id === req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, product });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 3. Update product (Admin protected)
  app.put('/api/products/:id', async (req: Request, res: Response) => {
    const adminKey = req.headers['x-admin-key'] as string;
    // Default admin passkey for demonstration: 'nutrismart2026' or configured env
    const expectedKey = process.env.ADMIN_KEY || 'nutrismart2026';

    if (adminKey !== expectedKey) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid Administrator Passkey',
      });
    }

    try {
      const products = await getProductsData();
      const index = products.findIndex((p: any) => p.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const updated = {
        ...products[index],
        ...req.body,
        lastUpdated: new Date().toISOString(),
      };
      products[index] = updated;

      await saveProductsData(products);
      res.json({ success: true, product: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. Toggle Verification Status (Admin simulation for competition presentation)
  app.post('/api/products/:id/toggle-verification', async (req: Request, res: Response) => {
    const adminKey = req.headers['x-admin-key'] as string;
    const expectedKey = process.env.ADMIN_KEY || 'nutrismart2026';
    if (adminKey !== expectedKey) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const products = await getProductsData();
      const product = products.find((p: any) => p.id === req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const willBeVerified = product.verificationStatus !== 'VERIFIED';

      if (willBeVerified) {
        product.verificationStatus = 'VERIFIED';
        product.verificationSource = 'Accredited Food Analysis Laboratory (ISO/IEC 17025 Certified)';
        product.verificationDate = '2026-11-10';
        product.labCertificateNo = 'CERT-AOAC-2026-SB048';
        product.nutritionMetrics = [
          {
            key: 'calories',
            label: { en: 'Energy / Calories', ms: 'Tenaga / Kalori' },
            unit: 'kcal',
            value: 138,
            status: 'VERIFIED',
            dailyValuePercentage: 7,
            notes: {
              en: 'Verified via ISO 17025 Parr Bomb Calorimetry method.',
              ms: 'Disahkan melalui kaedah Kalorimetri Bom Parr ISO 17025.',
            },
          },
          {
            key: 'protein',
            label: { en: 'Crude Protein', ms: 'Protein Kasar' },
            unit: 'g',
            value: 2.5,
            status: 'VERIFIED',
            dailyValuePercentage: 5,
            notes: {
              en: 'Kjeldahl total nitrogen analysis (N × 6.25).',
              ms: 'Analisis jumlah nitrogen Kjeldahl (N × 6.25).',
            },
          },
          {
            key: 'carbohydrates',
            label: { en: 'Total Carbohydrates', ms: 'Jumlah Karbohidrat' },
            unit: 'g',
            value: 19.4,
            status: 'VERIFIED',
            dailyValuePercentage: 7,
            notes: {
              en: 'Chromatographic & proximate difference analysis.',
              ms: 'Analisis perbezaan proksimat & kromatografi.',
            },
          },
          {
            key: 'totalFat',
            label: { en: 'Total Fat', ms: 'Jumlah Lemak' },
            unit: 'g',
            value: 5.8,
            status: 'VERIFIED',
            dailyValuePercentage: 8,
            notes: {
              en: 'Acid hydrolysis and Soxhlet solvent extraction.',
              ms: 'Pengekstrakan pelarut Soxhlet dan hidrolisis asid.',
            },
          },
          {
            key: 'dietaryFibre',
            label: { en: 'Dietary Fibre', ms: 'Serat Diet' },
            unit: 'g',
            value: 2.7,
            status: 'VERIFIED',
            dailyValuePercentage: 10,
            notes: {
              en: 'Enzymatic-gravimetric method (AOAC 991.43).',
              ms: 'Kaedah enzimatik-gravimetrik rasmi (AOAC 991.43).',
            },
          },
          {
            key: 'totalSugar',
            label: { en: 'Total Sugars', ms: 'Jumlah Gula' },
            unit: 'g',
            value: 7.9,
            status: 'VERIFIED',
            dailyValuePercentage: 8,
            notes: {
              en: 'HPLC sugar profile: Fructose (4.1g), Glucose (3.8g), Sucrose (<0.1g), 0g added white sugar.',
              ms: 'Profil HPLC: Fruktosa (4.1g), Glukosa (3.8g), Sukrosa (<0.1g), 0g gula putih ditambah.',
            },
          },
        ];
      } else {
        // Switch back to PENDING
        product.verificationStatus = 'PENDING';
        product.verificationSource = 'School Food Technology Innovation Lab & Pending Accredited Food Analysis';
        product.verificationDate = '2026-11-10';
        product.labCertificateNo = 'LAB-PENDING-SB2026-01';
        product.nutritionMetrics = product.nutritionMetrics.map((m: any) => ({
          ...m,
          value: null,
          status: 'PENDING',
          dailyValuePercentage: null,
        }));
      }

      product.lastUpdated = new Date().toISOString();
      await saveProductsData(products);
      res.json({ success: true, product });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. Config / Host inspection
  app.get('/api/config', (req: Request, res: Response) => {
    const hostHeader = req.get('host') || `localhost:${PORT}`;
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const computedAppUrl = process.env.APP_URL || `${protocol}://${hostHeader}`;

    res.json({
      success: true,
      appUrl: computedAppUrl,
      environment: process.env.NODE_ENV || 'development',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // 6. Gemini AI Nutrition Assistant Endpoint
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before asking another question.',
      });
    }

    const { message, language = 'en', history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid question.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured in environment secrets.',
      });
    }

    try {
      const products = await getProductsData();
      const sorghubites = products.find((p: any) => p.id === 'sorghubites') || products[0];

      const currentStatus = sorghubites.verificationStatus;
      const metricsSummary = sorghubites.nutritionMetrics
        .map((m: any) => `${m.label.en}: ${m.value !== null ? `${m.value} ${m.unit} (VERIFIED)` : `${m.referenceEstimate || 'Pending verification'} (STATUS: ${m.status})`}`)
        .join('; ');

      const systemInstruction = `You are NutriSmart AI, an advanced and scientifically rigorous Food Technology & Nutrition Assistant developed for the school innovation project "SorghuBites".

PHYSICAL PROTOTYPE PACKAGING & FORMULATION DATA:
- Product Name: SorghuBites
- Category: Sorghum-based artisan biscuit (Biskut berasaskan sorgum)
- Physical Packaging: Clear glass packaging jar with golden lid containing whole sorghum biscuits with visible date specks.
- Origin: Product of Malaysia (Inovasi Makanan Sekolah Malaysia)
- Exact Formulation Proportions (as labeled on physical packaging jar):
  * Sorghum Flour: 40% (Primary structural grain base, replacing wheat flour completely)
  * Dates (Puree): 30% (Whole fruit sweetening and moisture binding)
  * Creamery Butter: 25% (Dairy lipid matrix providing tender melt-in-mouth crumb structure)
  * Pure Natural Honey: 5% (Natural humectant and thermal golden browning agent)
- Physical Packaging Badges:
  * "HIGH FIBER"
  * "WHEAT FREE"
  * "NO ADDED SUGAR"
- Target Audience Notice on Label: "That is suitable for diabetic and celiac disease patients"
  * FOOD SCIENCE & MEDICAL SAFETY NUANCE: Explain with scientific balance:
    - For celiac disease: The recipe contains NO wheat flour and uses sorghum flour. However, clarify that certified gluten-free status officially requires accredited laboratory testing (<20 ppm) to ensure zero facility cross-contamination.
    - For diabetic individuals: Emphasize that there is ZERO added refined white cane sugar, and whole dates + sorghum provide dietary fibre. However, be transparent that dates and honey naturally contain fructose and glucose; it is NOT sugar-free or carbohydrate-free. Advise consulting healthcare professionals and mindful portion control.
- Current Nutritional Laboratory Status: ${currentStatus}.
  * Current metrics data: ${metricsSummary}
  * Lab Notice: ${sorghubites.disclaimers.labNotice.en}

STRICT FOOD SCIENCE & SAFETY RULES:
1. NEVER FABRICATE NUTRITIONAL DATA:
   - If the user asks for exact calories, protein, carbs, fat, sugar, or fibre, look at the verification status:
   - When status is PENDING: Explicitly state that official laboratory proximate analysis is currently PENDING accredited testing. You may mention the general educational preliminary range, but clearly emphasize it is NOT a certified finished laboratory value.
   - When status is VERIFIED: You may quote the verified lab numbers accurately from the product data.
   - Never invent numbers out of thin air.
2. SUGAR CLARIFICATION RULE (CRITICAL):
   - Clearly explain that while SorghuBites contains NO added refined white sugar, it is NOT "sugar-free".
   - Dates and honey inherently contain naturally occurring sugars (fructose and glucose). Be transparent and scientifically accurate about this.
3. GLUTEN & WHEAT NOTICE:
   - SorghuBites does NOT use wheat flour in its recipe; it uses sorghum grain flour.
   - However, do NOT claim that the finished biscuit is "certified gluten-free" unless verified by accredited lab testing (<20 ppm) and certified facility audits.
4. INGREDIENT FUNCTIONS:
   - Sorghum flour: Climate-resilient, drought-resistant ancient C4 grain requiring less water; naturally wheat-free; rich in complex slow-digesting carbs, resistant starch, dietary fibre, and antioxidant polyphenols (tannins, 3-deoxyanthocyanidins).
   - Dates: Moisture binding, natural fruit sweetness, intact fruit fibre matrix, potassium, magnesium.
   - Honey: Natural humectant keeping the biscuit tender, golden browning during baking, aromatic depth, unrefined fructose/glucose.
   - Butter: Shortening lipid matrix that coats starch granules, delivering melt-in-the-mouth texture without wheat gluten, supplying natural dairy fat and fat-soluble vitamins.
5. NO MEDICAL CLAIMS:
   - Never claim that SorghuBites prevents, treats, or cures diabetes, celiac disease, obesity, or any medical condition.
   - Emphasize balanced nutrition and mindful snacking.
6. MULTILINGUAL SUPPORT:
   - You must answer fluently in English or Bahasa Melayu, matching the user's inquiry language or the requested language (${language}).
   - In Bahasa Melayu, use accurate scientific and educational terminology (e.g., bijirin purba, tahan kemarau, tiada gula putih bertapis, gula semula jadi, bebas gandum, belum disahkan makmal bertauliah).
7. TONE:
   - Professional, educational, welcoming, food-science oriented, proud of the student innovation. Keep answers clear, structured with concise bullet points where helpful.`;

      // Format previous chat messages for context if provided
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'assistant') {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      contents.push({ role: 'user', parts: [{ text: message }] });

      const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let response: any = null;
      let lastError: any = null;

      for (const modelCandidate of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelCandidate,
            contents: contents as any,
            config: {
              systemInstruction,
            },
          });
          if (response && response.text) {
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Model ${modelCandidate} failed:`, modelErr?.message || modelErr);
          lastError = modelErr;
          // Continue to next model fallback
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error('All model candidates failed to return a response.');
      }

      const replyText = response.text;

      res.json({
        success: true,
        reply: replyText,
        groundingStatus: currentStatus === 'VERIFIED' ? 'GROUNDED_SORGHUBITES' : 'PENDING_NOTICE',
      });
    } catch (error: any) {
      console.error('Gemini AI API Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to communicate with NutriSmart AI service.',
      });
    }
  });

  // Setup Vite in development or static in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NutriSmart AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});

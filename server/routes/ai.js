import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// AI Scoring endpoint
router.post('/score', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured on server' });
        }

        // Call Gemini API
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ 
                error: errorData.error?.message || 'Gemini API request failed' 
            });
        }

        const data = await response.json();

        // Extract text response
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            return res.status(500).json({ error: 'No response from AI' });
        }

        // Parse JSON from response (handle markdown wrapper if present)
        let jsonText = responseText.trim();

        // Remove markdown code block if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const result = JSON.parse(jsonText);

        // Validate response structure
        if (typeof result.score !== 'number' ||
            typeof result.analysis !== 'string' ||
            typeof result.onTrack !== 'boolean' ||
            typeof result.suggestion !== 'string') {
            return res.status(500).json({ error: 'Invalid response format from AI' });
        }

        // Clamp score to 0-20 range
        result.score = Math.max(0, Math.min(20, result.score));

        res.json(result);

    } catch (error) {
        console.error('AI scoring error:', error);
        
        if (error.message.includes('JSON')) {
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }
        
        res.status(500).json({ error: error.message || 'Failed to get AI score' });
    }
});

export default router;

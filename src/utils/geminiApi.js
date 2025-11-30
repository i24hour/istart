// Gemini API Integration

import { getApiKey } from './storageApi.js';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Score daily work using Gemini AI
export const scoreWork = async (project, logs, todayWork) => {
    const apiKey = await getApiKey();

    if (!apiKey) {
        throw new Error('No API key found. Please configure your Gemini API key in settings.');
    }

    const { name, description, milestones, deadline, currentDay } = project;
    const remainingDays = deadline - currentDay;

    // Build previous work log
    const previousLogsText = logs.length > 0
        ? logs.map(log => `Day ${log.day}: ${log.work} (Score: ${log.score}/20)`).join('\n')
        : 'No previous work logged.';

    // Build milestones text
    const milestonesText = milestones.join(', ');

    // Construct prompt for Gemini
    const prompt = `You are a project progress analyzer. Here's the project:

Project: ${name}
Description: ${description}
Milestones: ${milestonesText}
Deadline: ${deadline} days
Days Elapsed: ${currentDay}
Days Remaining: ${remainingDays}

Previous Work Log:
${previousLogsText}

Today (Day ${currentDay}): ${todayWork}

Based on ALL the progress so far, analyze if the user can complete this project on time.

Give today a score from 0-20 points based on:
- How much meaningful work was done today
- Whether this pace will complete the project on time
- Complexity of remaining tasks
- Quality and relevance of work done

Return ONLY valid JSON (no markdown, no code blocks):
{
  "score": <number 0-20>,
  "analysis": "<brief explanation of today's score in 1-2 sentences>",
  "onTrack": <boolean>,
  "suggestion": "<specific actionable advice for tomorrow in 1 sentence>"
}`;

    try {
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
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
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();

        // Extract text response
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error('No response from AI');
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
            throw new Error('Invalid response format from AI');
        }

        // Clamp score to 0-20 range
        result.score = Math.max(0, Math.min(20, result.score));

        return result;

    } catch (error) {
        console.error('Gemini API error:', error);

        // Provide more specific error messages
        if (error.message.includes('API_KEY_INVALID')) {
            throw new Error('Invalid API key. Please check your Gemini API key in settings.');
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
            throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('JSON')) {
            throw new Error('Failed to parse AI response. Please try again.');
        } else {
            throw new Error(error.message || 'Failed to get AI score. Please try again.');
        }
    }
};

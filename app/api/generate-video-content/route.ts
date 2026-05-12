import { client } from "@/config/openai";
import { GENERATE_VIDEO_CONTENT_PROMPT } from "@/data/Prompt";
import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import Replicate from "replicate";
import { db } from "@/config/db";
import { chapterContentSlides } from "@/config/schema";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { currentUser } from "@clerk/nextjs/server";
import { getClientIp, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";

// Vercel Pro extended timeout — allows up to 300s for this serverless function
export const maxDuration = 300;


const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || "",
});

// 15 chapter generations per 15 minutes per user (courses have multiple chapters)
const LIMIT = 15;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication Check
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const rateLimitKey = `generate-video:${user.primaryEmailAddress?.emailAddress ?? getClientIp(req)}`;
        const rl = rateLimit(rateLimitKey, LIMIT, WINDOW_MS);
        if (!rl.success) {
            return NextResponse.json(
                { error: "Too many requests. Please wait before generating more video content." },
                { status: 429, headers: rateLimitHeaders(rl, LIMIT) }
            );
        }

        // 2. Input Parsing and Validation
        const body = await req.json();
        const { chapter, courseId } = body;

        if (!courseId || typeof courseId !== 'string') {
            return NextResponse.json({ error: "Missing or invalid 'courseId'" }, { status: 400 });
        }

        if (!chapter || typeof chapter !== 'object') {
            return NextResponse.json({ error: "Missing or invalid 'chapter' object" }, { status: 400 });
        }

        if (!chapter.chapterId) {
            return NextResponse.json({ error: "Missing 'chapter.chapterId' inside chapter object" }, { status: 400 });
        }

        console.log("Processing chapter:", chapter.chapterId, "for course:", courseId);

        // 3. Generate JSON Schema for Video Content
        const response = await client.chat.completions.create({
            model: 'gpt-5.1', // Note: Ensure this model string is correct for your OpenAI plan
            messages: [
                { role: 'system', content: GENERATE_VIDEO_CONTENT_PROMPT },
                { role: 'user', content: 'Chapter Detail Is' + JSON.stringify(chapter) }
            ]
        });

        const AiResult = response.choices[0].message?.content;
        const VideoContentJson = JSON.parse(AiResult?.replace('```json', '').replace('```', '') || '[]');

        // 4. Audio File Generation using TTS for Narration — all slides in parallel
        const audioFileUrls: string[] = await Promise.all(
            VideoContentJson.map(async (slide: any) => {
                const ttsResponse = await elevenlabs.textToSpeech.convert(
                    "JBFqnCBsd6RMkjVDRZzb",
                    {
                        text: slide.narration.fullText,
                        modelId: "eleven_multilingual_v2",
                        outputFormat: "mp3_44100_128"
                    }
                );

                const reader = ttsResponse.getReader();
                const chunks: Uint8Array[] = [];
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    if (value) chunks.push(value);
                }

                const audioBuffer = Buffer.concat(chunks);
                const audioUrl = await SaveAudioToStorage(audioBuffer, slide.audioFileName);
                console.log("Uploaded:", audioUrl);
                return audioUrl;
            })
        );

        // 5. Generate Captions for the Audio — all slides in parallel
        const captionsArray: any[] = await Promise.all(
            audioFileUrls.map(async (url) => {
                const captions = await GenerateCaptions(url);
                console.log(captions);
                return captions;
            })
        );

        // 6. Save Everything to Database
        const dbErrors: string[] = []
        for (let index = 0; index < VideoContentJson.length; index++) {
            const slide = VideoContentJson[index];

            try {
                await db
                .insert(chapterContentSlides)
                .values({
                    chapterId: chapter.chapterId, // Safely guaranteed to exist now
                    courseId,                     // Safely guaranteed to exist now
                    slideIndex: slide.slideIndex,
                    slideId: slide.slideId,
                    audioFileName: slide.audioFileName,
                    narration: slide.narration,
                    revelData: slide.revelData,
                    html: slide.html,
                    audioFileUrl: audioFileUrls[index],
                    caption: captionsArray[index] ?? {},
                })
                .returning();
            } catch (err) {
                console.error("Database insert error on slide", index, err);
                dbErrors.push(`slide ${index}`)
            }
        }

        // Return Response
        if (dbErrors.length > 0) {
            return NextResponse.json(
                { error: "Partial Failure: some slides were not saved", failed: dbErrors },
                { status: 207 }
            )
        }
        return NextResponse.json({ slides: VideoContentJson, audioFileUrls, captionsArray });

    } catch (error: any) {
        console.error("API Error in generate-video-content:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}

const SaveAudioToStorage = async (audioBuffer: Buffer, fileName: string) => {
    //Implement Cloud Storage Saving Logic Here
    const blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || "");
    const container = blobService.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME || "");

    const blobName = `tts/${fileName}`;
    const blockBlob = container.getBlockBlobClient(blobName);

    await blockBlob.uploadData(audioBuffer, {
        blobHTTPHeaders: {
            blobContentType: 'audio/mpeg',
            blobCacheControl: 'public, max-age=31536000, immutable'
        }
    })

    //Return Url
    const publicBase = process.env.AZURE_STORAGE_PUBLIC_BASE_URL || "";
    const url = publicBase ?
        publicBase + "/" + container.containerName + "/" + blobName :
        blockBlob?.url
        ;
    return url;
}


const GenerateCaptions = async (audioUrl: string) => {
    const input = {
        audio: audioUrl,
        batch_size: 120
    };
    const output = await replicate.run("vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c", { input });
    console.log(output)
    return output;
}
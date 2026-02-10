import { client } from "@/config/openai";
import { GENERATE_VIDEO_CONTENT_PROMPT } from "@/data/Prompt";
import axios from "axios";
import { Languages } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import Replicate from "replicate";
import { db } from "@/config/db";
import { chapterContentSlides } from "@/config/schema";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';


const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
});


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY || "",
});
export async function POST(req: NextRequest) {

    const { chapter, courseId } = await req.json();
    console.log(chapter, courseId);
    //Generate JSON Schema for Video Content

    const response = await client.chat.completions.create({
        model: 'gpt-5.1',
        messages: [
            { role: 'system', content: GENERATE_VIDEO_CONTENT_PROMPT },
            { role: 'user', content: 'Chapter Detail Is' + JSON.stringify(chapter) }
        ]
    });

    const AiResult = response.choices[0].message?.content;
    const VideoContentJson = JSON.parse(AiResult?.replace('```json', '').replace('```', '') || '[]');

    //  Audio File Generation using TTS for Narration
    // const VideoContentJson = VideoSlidesDummy;
    let audioFileUrls: string[] = [];
    for (let i = 0; i < VideoContentJson?.length; i++) {
        //if (i > 0) break;

        const narration = VideoContentJson[i].narration.fullText;

        // Call ElevenLabs TTS
        const ttsResponse = await elevenlabs.textToSpeech.convert(
            "JBFqnCBsd6RMkjVDRZzb",
            {
                text: narration,
                modelId: "eleven_multilingual_v2",
                outputFormat: "mp3_44100_128"
            }
        );

        // Convert Web ReadableStream to Buffer
        const reader = ttsResponse.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
        }

        const audioBuffer = Buffer.concat(chunks);

        // Upload to Azure storage
        const audioUrl = await SaveAudioToStorage(
            audioBuffer,
            VideoContentJson[i].audioFileName
        );

        audioFileUrls.push(audioUrl);
        console.log("Uploaded:", audioUrl);
    }



    //Generate Captions for the Audio

    let captionsArray: any[] = [];
    for (let i = 0; i < audioFileUrls.length; i++) {
        const captions = await GenerateCaptions(audioFileUrls[i]);
        console.log(captions)
        captionsArray.push(captions);
    }

    //Save Everyhting to Database
    for (let index = 0; index < VideoContentJson.length; index++) {
        const slide = VideoContentJson[index];

        const result = await db
            .insert(chapterContentSlides)
            .values({
                chapterId: chapter.chapterId,
                courseId,
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

        console.log(result);
    }


    //Return Response



    return NextResponse.json({ ...VideoContentJson, audioFileUrls, captionsArray });
}

const SaveAudioToStorage = async (audioBuffer: Buffer, fileName: string) => {
    //Implement Cloud Storage Saving Logic Here
    const blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || "");
    const container = blobService.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME || "");

    const blobName = `tts/${fileName}.mp3`;
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
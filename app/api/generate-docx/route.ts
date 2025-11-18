// app/api/generate-docx/route.ts
import { NextRequest, NextResponse } from 'next/server';
import HTMLtoDOCX from 'html-to-docx';

export async function POST(request: NextRequest) {
  try {
    const { content, fileName } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.5;
            }
            p {
              margin-bottom: 12pt;
              text-align: justify;
            }
            strong {
              font-weight: bold;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `;

    const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
      margins: {
        top: 1440,
        right: 1440,
        bottom: 1440,
        left: 1440,
      },
    });

    // Convertir a Uint8Array para NextResponse
    let uint8Array: Uint8Array;
    if (fileBuffer instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(fileBuffer);
    } else if (fileBuffer instanceof Blob) {
      uint8Array = new Uint8Array(await fileBuffer.arrayBuffer());
    } else {
      uint8Array = new Uint8Array(fileBuffer);
    }

    return new NextResponse(uint8Array as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName || 'contrato.docx'}"`,
      },
    });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 });
  }
}
